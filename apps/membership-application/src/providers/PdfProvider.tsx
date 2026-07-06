import React, { createContext, useContext, useState, useRef } from "react";

interface PDFContextProps {
  pdfDoc: any;
  setPdfDoc: React.Dispatch<React.SetStateAction<any>>;
  pageNum: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
  totalPageNum: number;
  setTotalPageNum: React.Dispatch<React.SetStateAction<number>>;
  pdfUrl: string;
  setPdfUrl: React.Dispatch<React.SetStateAction<string>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  drawingCanvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: React.MutableRefObject<boolean>;
}

const PDFContext = createContext<PDFContextProps | undefined>(undefined);

export const usePDFContext = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error("usePDFContext must be used within a PDFProvider");
  }
  return context;
};

export const PDFProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [pdfUrl, setPdfUrl] = useState("MutualAidAgreement-2019.pdf");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  return (
    <PDFContext.Provider
      value={{
        pdfDoc,
        setPdfDoc,
        pageNum,
        setPageNum,
        totalPageNum,
        setTotalPageNum,
        pdfUrl,
        setPdfUrl,
        canvasRef,
        drawingCanvasRef,
        isDrawing,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};