import React from "react";
import uploadService from "../../services/uploadService";
import { useFormContext } from "react-hook-form";
import { transformFile } from "../../helpers/transformFile";
import { StrapiFormattedFile } from "../../types/types";

const FileUpload: React.FC = () => {
  const { setValue, watch } = useFormContext();

  const selectedFiles = watch("files") || [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    if (event.target.files) {
      const transformedFiles = Array.from(event.target.files).map((file) =>
        transformFile(file, `${watch("legal_enitiy_name")}`)
      );

      setValue("files", [...selectedFiles, ...transformedFiles]);
      console.log("Selected files:", Array.from(event.target.files)); // Debugging
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    console.log("Uploading files:", selectedFiles); // Debugging

    try {
      const data = await uploadService.uploadFiles(selectedFiles);
      console.log("Files uploaded successfully:", data);
      // Optionally, clear the selected files after successful upload
      setValue("files", []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upload Files</h2>
      <label
        htmlFor="file-input"
        className="block text-sm font-medium text-gray-700"
      >
        Choose files
      </label>
      <input
        type="file"
        id="file-input"
        name="files"
        accept="*/*"
        multiple
        onChange={handleFileChange}
        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-1">Selected Files:</h3>
        <ul className="list-disc list-inside">
          {selectedFiles.map((file: StrapiFormattedFile, index: number) => (
            <li key={index}>{file.title}</li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
