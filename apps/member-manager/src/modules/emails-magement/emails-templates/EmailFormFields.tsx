import {
  TextInput,
  useDataProvider,
  required
} from "react-admin";
import { Box, Grid } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";

// Import the new components
import RecipientDetails from "./components/RecipientDetails";
import ModuleSelector from "./components/ModuleSelector";
import ResourceSelector from "./components/ResourceSelector";
import EnhancedRichTextEditor from "./components/EnhancedRichTextEditor";
import TemplateFieldDialog from "./components/TemplateFieldDialog";
import GrantFields from "./components/GrantFields";
import FileUploadField from "../../_components/FileUploadField";

// Declare the TinyMCE global object for TypeScript
declare global {
  interface Window {
    tinymce: {
      activeEditor: {
        execCommand: (command: string, ui: boolean, value: any) => void;
      } | null;
    };
  }
}

interface EmailFormFieldsProps {
  module?: string;
}

const EmailFormFields = ({ module }: EmailFormFieldsProps) => {
  const form = useFormContext();
  const status = form.watch("grant_status");
  const formResource = form.watch("resource");
  const [resource, setResource] = useState<string>("");
  const [schemaFields, setSchemaFields] = useState<string[]>([]);
  const [currentFocusField, setCurrentFocusField] = useState<string>("");
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [cursorPositions, setCursorPositions] = useState<{
    [key: string]: number;
  }>({});

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const dataProvider = useDataProvider();

  // Fetch resource fields dynamically
  const fetchResourceFields = async (selectedResource: string) => {
    try {
      const { data } = await dataProvider.getList(selectedResource, {
        filter: {},
        pagination: { page: 1, perPage: 1 },
        sort: { field: "id", order: "DESC" },
        meta: { raw: true, populate: true },
      });

      if (data && data.length > 0) {
        const fields = extractFields(data[0]);
        setSchemaFields(fields);
      }
    } catch (error) {
      console.error(
        `Error fetching resource fields for ${selectedResource}:`,
        error
      );
    }
  };

  // Recursively extract nested field names
  const extractFields = (obj: Record<string, any>, prefix = ""): string[] => {
    return Object.keys(obj).reduce((fields, key) => {
      const value = obj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        return fields.concat(extractFields(value, fullKey)); // Recursively handle nested fields
      }

      return fields.concat(fullKey); // Add flat field
    }, [] as string[]);
  };

  useEffect(() => {
    if (formResource && formResource !== resource) {
      setResource(formResource);
    }
  }, [formResource, resource]);

  // Trigger field fetching on resource change
  useEffect(() => {
    if (resource) {
      fetchResourceFields(resource);
    }
  }, [resource]);

  // Insert field at cursor position
  const handleInsertField = (field: string) => {
    const valueToInsert = `{${field}}`;

    if (currentFocusField === "body") {
      // For TinyMCE editor, we need to insert at cursor position
      try {
        if (window.tinymce && window.tinymce.activeEditor) {
          window.tinymce.activeEditor.execCommand('mceInsertContent', false, valueToInsert);
        } else {
          // Fallback: append to the end
          const currentValue = form.getValues("body") || "";
          form.setValue("body", `${currentValue}${valueToInsert}`);
        }
      } catch (error) {
        console.error("Error inserting content into TinyMCE:", error);
        // Fallback method
        const currentValue = form.getValues("body") || "";
        form.setValue("body", `${currentValue}${valueToInsert}`);
      }
    } else {
      const inputElement = inputRefs.current[currentFocusField];
      const cursorPosition = cursorPositions[currentFocusField] || 0;
      const currentValue = form.getValues(currentFocusField) || "";

      const newValue =
        currentValue.slice(0, cursorPosition) +
        valueToInsert +
        currentValue.slice(cursorPosition);

      form.setValue(currentFocusField, newValue);

      if (inputElement) {
        inputElement.focus();
        inputElement.setSelectionRange(
          cursorPosition + valueToInsert.length,
          cursorPosition + valueToInsert.length
        );
      }
    }
  };

  // Save cursor position for input fields
  const handleCursorPosition = (
    field: string,
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    setCurrentFocusField(field);
    const position = event.target.selectionStart || 0;
    setCursorPositions((prev) => ({ ...prev, [field]: position }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        {/* Resource Selector */}
        <ResourceSelector onResourceChange={setResource} />

        {/* Recipient Details */}
        <Grid item xs={12}>
          <RecipientDetails 
            onFieldFocus={handleCursorPosition}
            onInsertFieldClick={(field) => {
              setCurrentFocusField(field);
              setPopupOpen(true);
            }}
            inputRefs={inputRefs}
          />
        </Grid>

        {/* Email Name */}
        <Grid item xs={12} md={module?.length ?? 0 > 0 ? 6 : 6}>
          <TextInput source="email_name" fullWidth helperText={false} validate={required()} />
        </Grid>

        {/* Hidden Module Field if module is provided */}
        {module && (
          <Grid item sx={{ display: "none" }}>
            <TextInput source="module" defaultValue={module} />
          </Grid>
        )}
        
        {/* Module Selector if module is not provided */}
        {!module && (
          <ModuleSelector moduleValue={module} />
        )}

        {/* Rich Text Editor for Body */}
        <Grid item xs={12}>
          <EnhancedRichTextEditor
            onInsertFieldClick={() => {
              setCurrentFocusField("body");
              setPopupOpen(true);
            }}
          />
        </Grid>

        {/* Grant-Specific Fields */}
        {module?.includes("Grant") && (
          <GrantFields status={status} />
        )}

        {/* Template Field Selection Dialog */}
        <TemplateFieldDialog
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          fields={[
            ...(resource === "scholarship-applications"
              ? [
                  "all_fields",
                  "currentYear",
                  "Applicant first name",
                  "Applicant first",
                  "Applicant last",
                  "Eligible Participant first name",
                  "form_title",
                ]
              : resource === "award-nominations"
              ? ["all_fields", "currentYear", "form_title"]
              : []),
            ...schemaFields,
          ]}
          onFieldSelect={handleInsertField}
        />
      </Grid>

      {/* Attachment */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <FileUploadField multiple source="attachments" label="Attachment" />
      </Grid>
    </Box>
  );
};

export default EmailFormFields;