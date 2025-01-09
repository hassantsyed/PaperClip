export interface BaseAnnotation {
    id: string;
    annotationType: string;
    createdAt: Date;
    content?: string; // Optional note/comment on the annotation
    color?: string; // Color of the annotation
}

export interface HighlightAnnotation extends BaseAnnotation {
    annotationType: 'highlight';
    highlightedText: string;
    pageNumber?: number; // For PDFs
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    textRange: {
        start: number;
        end: number;
    };
}

export interface UnderlineAnnotation extends BaseAnnotation {
    annotationType: 'underline';
    underlinedText: string;
    pageNumber?: number; // For PDFs
    position: {
        x: number;
        y: number;
        width: number;
    };
    textRange: {
        start: number;
        end: number;
    };
}

export type Annotation = HighlightAnnotation | UnderlineAnnotation;

export type ResourceStatus = "ERROR" | "PENDING" | "PROCESSING" | "CHUNKING" | "EMBEDDING" | "DONE";
export const TERMINAL_REOSURCE_STATES = ["ERROR", "DONE"];

export interface BaseResource {
  resourceType: string;
  id: string;
  createdAt: Date;
  tags: string[];
  notes: any[];
  annotations: BaseAnnotation[];
  progress: number;
  loading: boolean;
  status: ResourceStatus;
}

export interface PDFResource extends BaseResource {
  resourceType: 'pdf';
  title: string;
  settledTitle: boolean;
  content: string;
}

export interface YoutubeResource extends BaseResource {
  resourceType: 'youtube';
  videoId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: string;
}

export interface LinkResource extends BaseResource {
  resourceType: 'link';
  url: string;
  title?: string;
  content?: string;
}

export interface FileResource extends BaseResource {
  resourceType: 'file';
  filename: string;
  path: string;
  size: number;
  mimeType: string;
}

export type Resource = PDFResource | LinkResource | FileResource | YoutubeResource;

export interface Project {
    id: string;
    title: string;
    resources: Resource[];
}