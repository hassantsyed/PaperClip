import { PDFProcessEvent } from "../../constants/eventInterfaces";
import { events } from "../events";

events.on('resource:pdf-detected', ({ id, sender, filePath }: PDFProcessEvent) => {
    // Start parallel processing
    events.emit('resource:pdf-scrape-metadata', { id, sender, filePath });
    events.emit('resource:pdf-scrape-content', { id, sender, filePath });
});

events.on('resource:pdf-scrape-metadata', async ({ id, sender, filePath }: PDFProcessEvent) => {
    try {
        // Update stage status
        sender.send('resource:processed', id, {
            stages: [{ name: 'pdf-scrape-metadata', status: 'PROCESSING' }]
        });

        // TODO: Extract metadata using pdf.js or similar
        // For now, simulate metadata extraction
        setTimeout(() => {
            console.log("resource:resource:pdf-scrape-metadata done")
            sender.send('resource:processed', id, {
                title: 'Extracted PDF Title',
                settledTitle: true,
                stages: [{ name: 'pdf-scrape-metadata', status: 'DONE' }]
            });
        }, 2000);
    } catch (error) {
        sender.send('resource:processed', id, {
            stages: [{ name: 'pdf-scrape-metadata', status: 'ERROR' }]
        });
        console.error('Metadata extraction failed:', error);
    }
});

events.on('resource:pdf-scrape-content', async ({ id, sender, filePath }: PDFProcessEvent) => {
    try {
        // Update stage status
        sender.send('resource:processed', id, {
            stages: [{ name: 'pdf-scrape-content', status: 'PROCESSING' }]
        });

        // TODO: Extract content using pdf.js or similar
        // For now, simulate content extraction
        setTimeout(() => {
            console.log("resource:pdf-scrape-content done")
            sender.send('resource:processed', id, {
                content: 'Extracted PDF content...',
                stages: [{ name: 'pdf-scrape-content', status: 'DONE' }]
            });
        }, 5000);
    } catch (error) {
        sender.send('resource:processed', id, {
            stages: [{ name: 'pdf-scrape-content', status: 'ERROR' }]
        });
        console.error('Content extraction failed:', error);
    }
});