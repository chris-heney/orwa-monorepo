import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import CustomHeader from "../_components/CustomHeader";
import { RaRecord, useGetList, useNotify, useRecordContext } from "react-admin";
import CustomTextInput from "../_components/CustomTextInput";
import authProvider from "../../authProvider";
import { formatNumber } from "../../helpers/Formators";
import { createPayloadVariables, extractFieldsFromHTML } from "./helper";

const EmailSidebar = ({ module }: { module: string }) => {
  const [overrideTo, setOverrideTo] = React.useState("");
  const { data: emails } = useGetList("email-templates", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "email_name", order: "ASC" },
    filter: { module: module },
  });

  const [emailIndex, setEmailIndex] = React.useState(0);
  const application = useRecordContext<RaRecord>();
  const notify = useNotify();

  // 🔄 Replace placeholders dynamically from template fields
  const replaceVariables = (
    template: string,
    data: RaRecord | null,
    missingVariables: string[]
  ) => {
    if (typeof template !== "string" || !data) return template;
  
    // 🔍 Regex to search for placeholders and detect if formatting is needed
    const variableSearch = /(\$)?{([^}]+)}/g;
  
    return template.replace(variableSearch, (_, dollarSign, key) => {
      const keys = key.trim().split(".");
      let value: any = data;
  
      for (const k of keys) {
        value = value ? value[k] : null;
      }
  
      // ✅ Filter approved_projects by classification
      if (key === "approved_projects" && Array.isArray(value)) {
        const filteredProjects = value
          .filter((project) => project.classification !== "Both")
          .map((project) => project.name || JSON.stringify(project));
  
        return filteredProjects.length > 0
          ? filteredProjects.join(", ")
          : `{${key}}`;
      }
  
      // ✅ Handle arrays of objects
      if (Array.isArray(value)) {
        const names = value.map((item) =>
          item && item.name ? item.name : JSON.stringify(item)
        );
        return names.length > 0 ? names.join(", ") : `{${key}}`;
      }
  
      // ✅ Handle objects with name properties
      if (typeof value === "object" && value !== null) {
        return value.name || JSON.stringify(value);
      }
  
      // ❌ Handle missing values
      if (value === undefined || value === null) {
        missingVariables.push(key);
        return `{${key}}`;
      }
  
      // ✅ Format numbers if the placeholder has a $ sign
      if (dollarSign) {
        return formatNumber(Number(value));
      }
  
      // ✅ Direct value replacement
      return value;
    });
  };
  // 📧 Send Email
  const sendEmail = async () => {
    const emailTemplate = emails ? emails[emailIndex] : null;

    let attachments = null;

    if (!emailTemplate) {
      return notify("No email template selected.", { type: "error" });
    }

    const identity = await authProvider.getIdentity?.();
    if (!identity) return;

    const missingVariables: string[] = [];

    // Dynamically replace variables for email fields
    const toEmail =
      overrideTo ||
      replaceVariables(emailTemplate.to || "", application, missingVariables);
    const ccEmail = replaceVariables(
      emailTemplate.cc || "",
      application,
      missingVariables
    );
    const bccEmail = replaceVariables(
      emailTemplate.bcc || "",
      application,
      missingVariables
    );
    const subject = replaceVariables(
      emailTemplate.subject || "",
      application,
      missingVariables
    );
    const emailBody = replaceVariables(
      emailTemplate.body || "",
      application,
      missingVariables
    );
    if (missingVariables.length > 0) {
      notify(`Missing variables: ${missingVariables.join(", ")}`, {
        type: "error",
      });
      return; // Stop the email from being sent
    }

    if (!toEmail || toEmail.trim() === "") {
      return notify("Recipient email is missing or variable was not found.", {
        type: "error",
      });
    }

    // Extract variables from the email body for replacements
    const extractedFields = extractFieldsFromHTML(
      emailBody as unknown as RaRecord
    );
    const payloadVariables = createPayloadVariables(
      application,
      extractedFields.map((field) => {
        const keys = field.trim().split(".");
        let value = application;

        for (const key of keys) {
          value = value ? value[key] : null;
        }

        if (value === undefined || value === null) {
          missingVariables.push(field); // Add to the missing variables
          return `{${field}}`; // Placeholder if value missing
        } else {
          return value.toString();
        }
      })
    );

    if (missingVariables.length > 0) {
      notify(`Missing variables: ${missingVariables.join(", ")}`, {
        type: "error",
      });
      return; // Stop the email from sending
    }

    if (
      emails &&
      emails[emailIndex]?.email_name === "Grant Award Letter" &&
      application.award_letter
    ) {
      attachments = application.award_letter
        ? [
            {
              name: "Awards-Letter.pdf",
              url: `${import.meta.env.VITE_API_ENDPOINT}${
                application.award_letter.url
              }`,
              // url: "https://admin.orwa.org/uploads/riggrant02032025_01bccd2af1.pdf"
            },
          ]
        : null;
    }

    if (
      emails &&
      emails[emailIndex]?.email_name === "Application Receipt" &&
      application.applicant_pdf
    ) {
      attachments = application.applicant_pdf
        ? [
            {
              name: `${application.legal_entity_name}.pdf`,
              url: `${import.meta.env.VITE_API_ENDPOINT}${
                application.applicant_pdf.url
              }`,
              // url: "https://admin.orwa.org/uploads/riggrant02032025_01bccd2af1.pdf"
            },
          ]
        : null;
    }

    // Email payload without attachments
    const payload = {
      variables: payloadVariables,
      templateId: emailTemplate.id,
      to: toEmail,
      cc: ccEmail || undefined,
      bcc: bccEmail || undefined,
      from: emailTemplate.from_email,
      subject: subject,
      html: emailBody,
      attachments,
    };

    try {
      const response = await fetch(import.meta.env.VITE_MAILER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${identity.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        notify(`Email "${emailTemplate.email_name}" sent to ${toEmail}`, {
          type: "success",
        });
      } else {
        notify(
          `Failed to send email "${emailTemplate.email_name}" to ${toEmail}`,
          { type: "error" }
        );
      }
    } catch (error) {
      console.error(error);
      notify(
        `Error sending email "${emailTemplate.email_name}" to ${toEmail}`,
        { type: "error" }
      );
    }
  };

  return (
    <Paper
      component={"aside"}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        minWidth: 300,
      }}
    >
      <CustomHeader title="Notifications" />
      <Box sx={{ p: 2, overflowY: "scroll", maxHeight: "70vh" }}>
        <FormControl>
          <RadioGroup
            value={emailIndex}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              const clickedIndex = parseInt(target.value);
              setEmailIndex(clickedIndex === emailIndex ? -1 : clickedIndex);
            }}
          >
            {emails?.map((email, i) => (
              <FormControlLabel
                key={`email-${i}`}
                value={i}
                control={<Radio checked={i === emailIndex} />}
                label={email.email_name}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Divider />
      </Box>
      <Box sx={{ p: 2 }}>
        {emailIndex !== -1 && (
          <CustomTextInput
            label="Override To"
            value={overrideTo}
            onChange={(value) => setOverrideTo(value)}
          />
        )}
        <Button onClick={sendEmail} sx={{ mt: 3 }} variant="outlined">
          Send Email
        </Button>
      </Box>
    </Paper>
  );
};

export default EmailSidebar;
