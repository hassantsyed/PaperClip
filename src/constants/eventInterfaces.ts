import { WebContents } from "electron";

export interface ProcessUrlEvent {
    url: string;
    id: string;
    sender: WebContents;
}

export interface PDFProcessEvent {
    sender: WebContents;
    id: string;
    filePath: string;
}