export interface BaseResource {
  resourceType: string;
  id: string;
  createdAt: Date;
  tags: string[];
  notes: any[];
}

export interface PDFResource extends BaseResource {
  resourceType: 'arxiv-paper';
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

export type Resource = PDFResource | LinkResource | FileResource;

export interface Project {
    id: string;
    title: string;
    resources: any[];
}