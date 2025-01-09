import { ProcessUrlEvent } from "../../constants/eventInterfaces";
import { PDFResource } from "../../constants/interfaces";
import { events } from "../events";


events.on('resource:pdf-detected', ({ url, id, sender }: ProcessUrlEvent) => {
    // Simulate PDF processing
    setTimeout(() => {
        const resource: PDFResource = {
            resourceType: 'pdf',
            id: id,
            createdAt: new Date(),
            tags: [],
            notes: [],
            annotations: [],
            progress: 0,
            content: '', 
            title: 'PDF Document',
            settledTitle: false,
            loading: false,
            status: "DONE"
        };
        
        sender.send('resource:processed', resource);
    }, 5000);
});