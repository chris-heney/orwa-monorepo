import React from "react";
import { useFormContext } from "react-hook-form";
import { transformFile } from "../../helpers/transformFile";
import { StrapiFormattedFile } from "../../types/types";
import { fileCache } from "../../helpers/fileCache";

interface FileInputProps {
  name: string;
  label: string;
  required?: boolean;
  multiple?: boolean;
  helperText?: string;
}

const FileInput = ({
  name,
  label,
  required = false,
  multiple = false,
  helperText,
}: FileInputProps) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const selectedFiles = watch(name) || [];
  const facilityId = watch("facility_id");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const transformedFiles = [];

      for (const file of files) {
        // Save file to cache first
        let cacheId: string | undefined;
        try {
          cacheId = await fileCache.saveFile(file, name, facilityId || 'unknown');
        } catch (error) {
          console.warn('Failed to cache file:', error);
        }

        const transformedFile = transformFile(file, facilityId, cacheId);
        transformedFiles.push(transformedFile);
      }

      if (multiple) {
        setValue(name, [...selectedFiles, ...transformedFiles]);
      } else {
        setValue(name, transformedFiles);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_file: File, i: number) => i !== index);
    setValue(name, updatedFiles);
  };

  return (
    <div className="max-w-lg p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5">
          <label className="block mb-1 text-left text-sm font-semibold">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="relative mt-2 block w-full text-sm mr-4 py-2 px-4 rounded border-0 font-semibold bg-blue-50 text-blue-700 cursor-pointer transition-transform duration-300 ease-in-out transform hover:bg-blue-600 hover:text-white hover:scale-105">
            <input
               {...register(name, { 
                validate: {
                  validate: (value: StrapiFormattedFile[] | StrapiFormattedFile) => {
                    if (required) {
                      if (Array.isArray(value)) {
                        if (value.length === 0) return `${label} is required`;
                      } else {
                        if (!value) return `${label} is required`;
                      }
                    }
                    return true;
                  }
                },
              })}
              type="file"
              id="file-input"
              name="files"
              accept="*/*"
              multiple={multiple}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div >
              Choose File
            </div>
          </div>
          {errors[name] && (
            <p className="text-red-500 text-sm mt-1 text-left">{`${errors[name]?.message}*`}</p>
          )}
        </div>
        <div className="col-span-7">
          <h3 className="block mb-1 text-left text-sm font-semibold">Selected {multiple ? 'Files' : 'File'}</h3>
          {selectedFiles.length === 0 && <p className="text-sm text-gray-500 mt-4">No files selected</p>}
          {multiple ? (
            <ul className="list-disc list-inside max-h-48 overflow-y-auto">
              {selectedFiles.map((file: StrapiFormattedFile, index: number) => (
                <li key={index} className="flex justify-between items-center text-left">
                  <a
                    href={file.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline truncate"
                    title={file.title} // Tooltip text
                  >
                    {file.title}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            selectedFiles.length > 0 && (
              <div className="flex justify-between items-center text-left">
                <a
                  href={selectedFiles[0].src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate"
                  title={selectedFiles[0].title} // Tooltip text
                >
                  {selectedFiles[0].title}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(0)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>
      </div>
      <div className=" flex-grow"/>
      <p className="text-sm text-gray-500 mt-8 text-left">{helperText}</p>
    </div>
  );
};

export default FileInput;