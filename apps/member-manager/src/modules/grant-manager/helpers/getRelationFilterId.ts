/**
 * Re-export shared Strapi id helpers (grant-manager import path preserved).
 */
export {
  getRelationFilterId,
  sanitizeNumericFilterIds,
  isDocumentId,
  toRelationWriteId,
  toRelationWriteIds,
} from "../../../helpers/strapiIds";
