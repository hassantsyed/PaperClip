import { WebContents } from "electron";

export interface ProcessUrlEvent {
    url: string;
    id: string;
    sender: WebContents;
}