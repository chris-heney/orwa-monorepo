/**
 * Server-side applicant PDF for grant applications.
 *
 * Renders from the stored record (never from a client upload) and writes the
 * bytes over the existing `applicant_pdf` media file with the upload plugin's
 * `replace()`, which keeps the file id, hash and URL stable. When the
 * application has no PDF yet, a new file is uploaded and linked through the
 * media morph table. Neither path updates the application row, so the
 * grant-application lifecycle does not re-fire.
 */

import fs from "fs";
import os from "os";
import path from "path";
import {
  applicantPdfFileName,
  applicationToPdfInput,
  renderApplicantPdf,
} from "../../../shared/grant-application-pdf";

export const GRANT_APPLICATION_UID =
  "api::grant-application-final.grant-application-final" as const;
const SCORING_UID = "api::grant-application-scoring.grant-application-scoring" as const;
const APPLICANT_PDF_FIELD = "applicant_pdf";

const PDF_POPULATE = {
  status: true,
  point_of_contact: true,
  chairman: true,
  engineer: true,
  additional_contacts: true,
  selected_projects: true,
  project_costs: true,
  applicant_pdf: true,
};

export type RegenerateResult =
  | { ok: true; file: { id: number; url: string; name: string; updatedAt?: string }; replaced: boolean }
  | { ok: false; error: string; code: "not_found" | "render_failed" | "upload_failed" };

type RegenerateOptions = { reason?: string };

const isDocumentId = (id: string | number) =>
  typeof id === "string" && /^[a-z0-9]{16,64}$/.test(id) && !/^\d+$/.test(id);

/** Build the formidable-shaped file object the upload service expects. */
const tmpPdfFile = async (bytes: Uint8Array, name: string) => {
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "applicant-pdf-"));
  const filepath = path.join(dir, name);
  await fs.promises.writeFile(filepath, bytes);
  return {
    dir,
    file: {
      filepath,
      originalFilename: name,
      mimetype: "application/pdf",
      detectedMimeType: "application/pdf",
      size: bytes.byteLength,
    },
  };
};

export default ({ strapi }) => ({
  async loadApplication(documentIdOrId: string | number) {
    if (isDocumentId(documentIdOrId)) {
      return strapi.documents(GRANT_APPLICATION_UID).findOne({
        documentId: documentIdOrId,
        populate: PDF_POPULATE,
      });
    }
    return strapi.documents(GRANT_APPLICATION_UID).findFirst({
      filters: { id: Number(documentIdOrId) },
      populate: PDF_POPULATE,
    });
  },

  async regenerate(
    documentIdOrId: string | number,
    options: RegenerateOptions = {}
  ): Promise<RegenerateResult> {
    const reason = options.reason ?? "manual";
    const application = await this.loadApplication(documentIdOrId);
    if (!application) {
      return { ok: false, code: "not_found", error: "Grant application not found." };
    }

    let bytes: Uint8Array;
    try {
      const scorings = await strapi.documents(SCORING_UID).findMany({
        populate: { project_type: true },
        limit: 1000,
      });
      bytes = await renderApplicantPdf({
        ...applicationToPdfInput(application, scorings),
        revisedDate: reason === "create" ? null : new Date(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      strapi.log.error(
        `applicant-pdf regenerate failed ${application.documentId} (${reason}): render: ${message}`
      );
      return { ok: false, code: "render_failed", error: message };
    }

    const name = applicantPdfFileName(application.legal_entity_name ?? "");
    const upload = strapi.plugin("upload").service("upload");
    const existing = application.applicant_pdf;
    const { dir, file } = await tmpPdfFile(bytes, name);

    try {
      let saved;
      if (existing?.id) {
        saved = await upload.replace(existing.id, {
          data: { fileInfo: { name } },
          file,
        });
      } else {
        const uploaded = await upload.upload({
          data: {
            refId: application.id,
            ref: GRANT_APPLICATION_UID,
            field: APPLICANT_PDF_FIELD,
            fileInfo: { name },
          },
          files: file,
        });
        saved = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      }

      strapi.log.info(
        `applicant-pdf ${existing?.id ? "replaced" : "created"} for ${application.documentId} (#${
          application.application_id ?? application.id
        }, ${reason}) -> file ${saved?.id}`
      );

      return {
        ok: true,
        replaced: !!existing?.id,
        file: {
          id: saved?.id ?? existing?.id,
          url: saved?.url ?? existing?.url,
          name: saved?.name ?? name,
          updatedAt: saved?.updatedAt,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      strapi.log.error(
        `applicant-pdf regenerate failed ${application.documentId} (${reason}): upload: ${message}`
      );
      return { ok: false, code: "upload_failed", error: message };
    } finally {
      await fs.promises.rm(dir, { recursive: true, force: true }).catch(() => undefined);
    }
  },
});
