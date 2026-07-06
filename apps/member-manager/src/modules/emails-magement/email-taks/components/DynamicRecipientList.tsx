import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  Link,
  useDataProvider,
  useRecordContext,
  useNotify,
  useGetOne,
} from "react-admin";
import { Person, Email, Send } from "@mui/icons-material";
import { getRecipientDisplayInfo, createPayloadVariables, extractFieldsFromHTML } from "../../helper";
import authProvider from "../../../../authProvider";
import { formatNumber } from "../../../../helpers/Formators";

interface DynamicRecipientListProps {
  maxHeight?: number;
  entity?: string;
  condition?: any;
  emailTemplate?: any;
  taskId?: number;
  taskName?: string;
}

const DynamicRecipientList: React.FC<DynamicRecipientListProps> = ({
  maxHeight = 400,
  entity = "",
  condition = {},
  emailTemplate = null,
  taskId = null,
  taskName = "",
}) => {
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const notify = useNotify();

  const [recipients, setRecipients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(1000);
  const [isSending, setIsSending] = useState(false);

  // Use props if provided, otherwise fallback to record context
  const finalEntity = entity || record?.entity || "";
  const finalEmailTemplateId = emailTemplate || record?.email_template || null;
  const finalTaskId = taskId || record?.id || null;

  // Fetch the full email template if we only have an ID
  const { data: fetchedEmailTemplate, isLoading: templateLoading } = useGetOne(
    'email-templates', 
    { id: typeof finalEmailTemplateId === 'object' ? finalEmailTemplateId?.id : finalEmailTemplateId },
    { enabled: !!finalEmailTemplateId }
  );

  // Use the fetched template if we had an ID, otherwise use the object directly
  const finalEmailTemplate = typeof finalEmailTemplateId === 'object' 
    ? finalEmailTemplateId 
    : fetchedEmailTemplate;

  // Handle condition logic properly - if condition prop is explicitly provided (even if empty), use it
  // Only fallback to record condition if no condition prop is provided at all
  const finalCondition =
    condition !== undefined ? condition : record?.condition || {};

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / perPage);

  // Per page options
  const perPageOptions = [10, 25, 50, 100, 1000];

  // 🔄 Advanced variable replacement from EmailSidebar
  const replaceVariables = (
    template: string,
    data: any,
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

  // Send emails to all recipients
  const sendEmailsToAllRecipients = async () => {
    if (!finalEmailTemplate || !finalTaskId) {
      notify("Email template or task information is missing", {
        type: "error",
      });
      return;
    }

    if (recipients.length === 0) {
      notify("No recipients to send emails to", { type: "warning" });
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let failureCount = 0;
    const allMissingVariables: string[] = [];

    try {
      const identity = await authProvider.getIdentity?.();
      if (!identity) {
        notify("Authentication required", { type: "error" });
        return;
      }

      // Send emails to all current recipients
      for (const recipient of recipients) {
        try {
          const missingVariables: string[] = [];

          // Replace variables in email template using advanced replacement
          const emailBody = replaceVariables(finalEmailTemplate.body || "", recipient, missingVariables);
          const toEmail = replaceVariables(finalEmailTemplate.to || "", recipient, missingVariables);
          const ccEmail = replaceVariables(finalEmailTemplate.cc || "", recipient, missingVariables);
          const bccEmail = replaceVariables(finalEmailTemplate.bcc || "", recipient, missingVariables);
          const subject = replaceVariables(finalEmailTemplate.subject || "", recipient, missingVariables);

          // Track any missing variables
          if (missingVariables.length > 0) {
            allMissingVariables.push(...missingVariables);
            console.warn(`Missing variables for recipient ${recipient.id}:`, missingVariables);
          }

          if (!toEmail || toEmail.trim() === "" || toEmail.includes("{")) {
            console.warn(
              `No valid email found for recipient: ${
                recipient.name || recipient.id
              }`
            );
            failureCount++;
            continue;
          }

          // Extract variables from the email body for replacements (like EmailSidebar)
          const extractedFields = extractFieldsFromHTML(emailBody as any);
          const payloadVariables = createPayloadVariables(
            recipient,
            extractedFields.map((field) => {
              const keys = field.trim().split(".");
              let value = recipient;

              for (const key of keys) {
                value = value ? value[key] : null;
              }

              if (value === undefined || value === null) {
                missingVariables.push(field);
                return `{${field}}`;
              } else {
                return value.toString();
              }
            })
          );
        
          // Prepare email payload matching EmailSidebar format
          const payload = {
            variables: payloadVariables,
            templateId: finalEmailTemplate.id,
            to: toEmail,
            cc: ccEmail || undefined,
            bcc: bccEmail || undefined,
            from: finalEmailTemplate.from_email,
            subject: subject,
            html: emailBody,
          };

          // Send email using mailer endpoint
          const response = await fetch(import.meta.env.VITE_MAILER_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${identity.token}`,
            },
            body: JSON.stringify(payload),
          });

          if (response.status === 200) {
            successCount++;
            
            // Log success in the email_logs collection
            try {
              await dataProvider.create("email-logs", {
                data: {
                  html: emailBody,
                  to: toEmail,
                  from: finalEmailTemplate.from_name + `<${finalEmailTemplate.from_email}>`,
                  subject: subject,
                  template: finalEmailTemplate.id,
                  sent_at: new Date().toISOString(),
                  status: "success",
                  recipient_name: recipient.name || "Unknown",
                  task_name: taskName || "Manual Send",
                  entity_id: recipient.id,
                  cron_rule: null, // Manual send, not cron
                },
              });
            } catch (logError) {
              console.error("Error creating success email log:", logError);
            }
          } else {
            failureCount++;
            console.error(`Failed to send email to: ${toEmail}`);
            
            // Log failure in the email_logs collection
            try {
              await dataProvider.create("email-logs", {
                data: {
                  html: emailBody,
                  to: toEmail,
                  from: finalEmailTemplate.from_name + `<${finalEmailTemplate.from_email}>`,
                  subject: subject,
                  template: finalEmailTemplate.id,
                  sent_at: new Date().toISOString(),
                  status: "failure",
                  error_message: `HTTP ${response.status}: ${response.statusText}`,
                  recipient_name: recipient.name || "Unknown",
                  task_name: taskName || "Manual Send",
                  entity_id: recipient.id,
                  cron_rule: null, // Manual send, not cron
                },
              });
            } catch (logError) {
              console.error("Error creating failure email log:", logError);
            }
          }
        } catch (error) {
          failureCount++;
          console.error(`Error sending email to recipient:`, error);
          
          // Log error in the email_logs collection
          try {
            const missingVariablesForError: string[] = [];
            const safeEmailBody = replaceVariables(finalEmailTemplate.body || "", recipient, missingVariablesForError);
            const safeToEmail = replaceVariables(finalEmailTemplate.to || "", recipient, missingVariablesForError);
            const safeSubject = replaceVariables(finalEmailTemplate.subject || "", recipient, missingVariablesForError);
            
            await dataProvider.create("email-logs", {
              data: {
                html: safeEmailBody,
                to: safeToEmail || "Unknown",
                from: finalEmailTemplate.from_name + `<${finalEmailTemplate.from_email}>`,
                subject: safeSubject,
                template: finalEmailTemplate.id,
                sent_at: new Date().toISOString(),
                status: "failure",
                error_message: error instanceof Error ? error.message : String(error),
                recipient_name: recipient.name || "Unknown",
                task_name: taskName || "Manual Send",
                entity_id: recipient.id,
                cron_rule: null, // Manual send, not cron
              },
            });
          } catch (logError) {
            console.error("Error creating error email log:", logError);
          }
        }
      }

      // Update task's last_sent timestamp
      if (finalTaskId && successCount > 0) {
        try {
          await dataProvider.update("scheduled-email-tasks", {
            id: finalTaskId,
            data: { last_sent: new Date().toISOString() },
            previousData: record || {},
          });
        } catch (updateError) {
          console.error("Error updating task last_sent:", updateError);
        }
      }

      // Show missing variables warning if any
      if (allMissingVariables.length > 0) {
        const uniqueMissingVariables = Array.from(new Set(allMissingVariables));
        notify(`Warning: Missing variables found: ${uniqueMissingVariables.join(", ")}`, {
          type: "warning",
        });
      }

      // Notify user of results
      if (successCount > 0 && failureCount === 0) {
        notify(
          `Successfully sent ${successCount} emails to all recipients!`,
          { type: "success" }
        );
      } else if (successCount > 0 && failureCount > 0) {
        notify(
          `Sent ${successCount} emails successfully, ${failureCount} failed`,
          { type: "warning" }
        );
      } else {
        notify(`❌ Failed to send emails to all ${failureCount} recipients`, {
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error in email sending process:", error);
      notify("Error occurred while sending emails", { type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  // Entity options mapping for better display
  const fetchRecipients = async (
    entityType: string,
    conditions: any,
    page: number = 1,
    pageSize: number = 1000
  ) => {
    if (!entityType) return;

    setLoading(true);
    setError(null);

    try {
      // Clean up conditions - remove empty objects and null values
      let filter = {};
      if (
        conditions &&
        typeof conditions === "object" &&
        Object.keys(conditions).length > 0
      ) {
        // Only apply conditions if they exist and are not empty
        filter = Object.fromEntries(
          Object.entries(conditions).filter(
            ([key, value]) =>
              value !== null && value !== undefined && value !== ""
          )
        );
      }

      const { data, total } = await dataProvider.getList(entityType, {
        pagination: { page, perPage: pageSize },
        sort: { field: "id", order: "ASC" },
        filter,
        meta: { populate: true }, // Ensure relations are populated for better display
      });

      setRecipients(data || []);
      setTotalCount(total || 0);
    } catch (err) {
      console.error("Error fetching recipients:", err);
      setError(
        "Failed to load recipients. Please check your entity type and conditions."
      );
      setRecipients([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (finalEntity) {
      fetchRecipients(finalEntity, finalCondition, currentPage, perPage);
    } else {
      setRecipients([]);
      setTotalCount(0);
    }
  }, [finalEntity, finalCondition, currentPage, perPage]);

  // Reset to page 1 when entity or condition changes
  useEffect(() => {
    setCurrentPage(1);
  }, [finalEntity, finalCondition]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (event: any) => {
    setPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when changing per page
  };

  if (!finalEntity) {
    return (
      <Paper elevation={1} sx={{ p: 2, height: maxHeight }}>
        <Typography variant="h6" gutterBottom>
          Recipients Preview
        </Typography>
        <Alert severity="info">
          Select an entity type to preview recipients
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        height: maxHeight,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Recipients Preview</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={
              finalEntity.charAt(0).toUpperCase() +
              finalEntity.slice(1, finalEntity.length - 1).replace("-", " ")
            }
            color="primary"
            variant="outlined"
            size="small"
          />
          {finalEmailTemplate && totalCount > 0 && (
            <Tooltip title={`Send "${finalEmailTemplate.email_name || 'email'}" to all ${totalCount} recipients`}>
              <IconButton
                size="small"
                onClick={sendEmailsToAllRecipients}
                disabled={isSending || recipients.length === 0}
                >
                {isSending ? <CircularProgress size={16} color="inherit" /> : <Send fontSize="small" color="primary" />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : recipients.length === 0 ? (
          <Alert severity="warning">
            No recipients found for the selected entity and conditions
          </Alert>
        ) : (
          <List dense>
            {recipients.map((recipient, index) => {
              const displayInfo = getRecipientDisplayInfo(
                recipient,
                finalEntity
              );
              return (
                <React.Fragment key={recipient.id || index}>
                  <ListItem
                    component={Link}
                    to={`/${finalEntity}/${recipient.id}`}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "success.main",
                        }}
                      >
                        <Email
                          fontSize="small"
                          sx={{
                            color: "white",
                          }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={displayInfo.primary}
                      secondary={displayInfo.secondary}
                      primaryTypographyProps={{ fontSize: "0.875rem" }}
                      secondaryTypographyProps={{ fontSize: "0.75rem" }}
                    />
                  </ListItem>
                  {index < recipients.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>

      {/* Pagination Controls */}
      {totalCount > 0 && (
        <Box
          sx={{
            p: 1.5,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
            }}
          >
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <InputLabel>Per page</InputLabel>
              <Select
                size="small"
                value={perPage}
                label="Per page"
                onChange={handlePerPageChange}
                sx={{ fontSize: "0.875rem" }}
              >
                {perPageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
            >
              Showing {(currentPage - 1) * perPage + 1}-
              {Math.min(currentPage * perPage, totalCount)} of {totalCount}
            </Typography>
          </Box>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
            sx={{ flexShrink: 0 }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default DynamicRecipientList;
