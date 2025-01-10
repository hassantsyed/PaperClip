import { LinkResource, PDFResource, ProcessingStage, StageStatus } from "../constants/interfaces";
import { BaseAnnotation } from "../constants/interfaces";

const createStage = (name: string, status: StageStatus): ProcessingStage => {
    return {
        name: name,
        status: status
    }
}

export abstract class BaseResourceModel {
    id: string;
    createdAt: Date;
    tags: string[];
    notes: any[];
    annotations: BaseAnnotation[];
    progress: number;
    stages: ProcessingStage[];

    constructor() {
        this.id = Math.random().toString(36).substring(2);
        this.createdAt = new Date();
        this.tags = [];
        this.notes = [];
        this.annotations = [];
        this.progress = 0;
        this.stages = [];
    }
}

export class PDFResourceModel extends BaseResourceModel implements PDFResource {
    resourceType: 'pdf' = 'pdf';
    title: string;
    settledTitle: boolean;
    content: string;

    constructor(title: string = 'PDF Document') {
        super();
        this.title = title;
        this.settledTitle = false;
        this.content = '';
        this.stages = [
            createStage("pdf-scrape-metadata", "PENDING"),
            createStage("pdf-scrape-content", "PENDING"),
        ]
    }
}

export class LinkResourceModel extends BaseResourceModel implements LinkResource {
    resourceType: 'link' = 'link';
    url: string;
    title: string;
    content: string;
    settledTitle: boolean

    constructor(url: string) {
        super();
        this.url = url;
        this.title = 'Loading...';
        this.content = '';
        this.settledTitle = false;

        this.stages = [
            createStage("url-submitted", "PENDING"),
        ]
    }
} 