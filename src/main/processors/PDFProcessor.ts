import { PDFReader, Document } from "llamaindex";
import { PDFResource, ProcessingStage } from "../../constants/interfaces";

export const extractPDFText = async (filePath: string): Promise<string> => {
  try {
    const reader = new PDFReader();
    const documents: Document[] = await reader.loadData(filePath);
    console.log(`Number of documents/pages: ${documents.length}`);

    const textContent = documents.map(doc => doc.getText()).join('\n');
    console.log(textContent)

    return textContent;

  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}


export const extractPDFTitle = async (filePath: string): Promise<string> => {
    const reader = new PDFReader();
    const documents: Document[] = await reader.loadData(filePath);
    // Get up to first 3 pages
    const firstPages = documents.slice(0, 3);
    
    const firstPagesContent = firstPages.map(doc => doc.getText()).join('\n');
    const extractedTitle = "";

    return extractedTitle;
}