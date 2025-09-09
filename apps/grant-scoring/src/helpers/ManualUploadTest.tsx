import React, { useContext, useState } from "react";
import uploadService from "../services/uploadService";
import { DirectoryContext, useScoringCriterias } from "../grant-scoring/helpers/AppContextProvider";
import { generatePDF } from "./generateScoringPacket";

export const ManualUploadTest = () => {

//   const applicationId = useGetApplicationId();
const { applications, applicationIndex } = useContext(DirectoryContext)
    const {scoringCriterias} = useScoringCriterias();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<string | null>(null);


  const getApprovedCriterias = (selectedProjects: string[]) => {
    return scoringCriterias
      .filter((criteria) => {
        return (
          criteria.project_type.data &&  selectedProjects.includes(
            criteria.project_type.data.id.toString()
          )
        );
      })
      .map((criteria) => {
        return [criteria.order, criteria.label, criteria.score];
      });
  }

  const handleGeneratePDF = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    console.log("Generating PDF...");
    // log approved projects

    console.log(getApprovedCriterias(applications[applicationIndex].approved_projects.data.map((project) => project.id.toString()))  )
    try {
      const pdfBytes = await generatePDF(
        applications[applicationIndex], 
        getApprovedCriterias(applications[applicationIndex].approved_projects.data.map((project) => project.id.toString()))
      )
    
      const generatedFile = new File([pdfBytes], "grant_application.pdf", {
        type: "application/pdf",
      });
      setFile(generatedFile);

      const url = URL.createObjectURL(generatedFile);
      setFileUrl(url); // Set the URL for viewing the PDF
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = "grant_application.pdf";
      a.click();
      URL.revokeObjectURL(fileUrl); // Revoke the object URL after downloading
      setFileUrl(null); // Reset the file URL
    }
  };

  const handleView = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const uploadedFile = await uploadService.uploadFile(file);
        setUploadResult("File uploaded successfully: " + uploadedFile.url);
      } catch (error: any) {
        console.error("Error uploading file:", error);
        setUploadResult("Error uploading file: " + error.message);
      }
    } else {
      setUploadResult("No file selected.");
    }
  };


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manual PDF Upload Test</h2>
      <div className="mb-4">
        <button
          onClick={handleGeneratePDF}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
        >
          Generate PDF
        </button>
        <button
          onClick={handleDownload}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
          disabled={!fileUrl}
        >
          Download PDF
        </button>
        <button
          onClick={handleView}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          disabled={!fileUrl}
        >
          View PDF
        </button>
      </div>
      <div className="mb-4">
        <button
          onClick={handleUpload}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Upload Generated File
        </button>
      </div>
      {uploadResult && <p className="mt-4">{uploadResult}</p>}
    </div>
  );
};
