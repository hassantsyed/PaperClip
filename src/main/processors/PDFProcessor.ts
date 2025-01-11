import { PDFReader, Document } from "llamaindex";
import { PDFResource, ProcessingStage } from "../../constants/interfaces";
import { callAIwTools, Conversation, extractTitle } from "../../llms/utils";

export const extractPDFText = async (filePath: string): Promise<string> => {
  try {
    const reader = new PDFReader();
    const documents: Document[] = await reader.loadData(filePath);
    console.log(`Number of documents/pages: ${documents.length}`);

    const textContent = documents.map(doc => doc.getText()).join('\n');
    // console.log(textContent)

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
    const convo: Conversation = {
        messages:
            [
                {
                    role: "user",
                    content: [{
                        type: "text",
                        text: firstPagesContent
                    }]
                }
            ],
    }

    const titleResp = await callAIwTools(convo, [extractTitle])
    return titleResp["inputs"]["title"]
}