import { PDFProcessEvent } from "../../constants/eventInterfaces";
import { events } from "../events";
import { extractPDFText, extractPDFTitle } from "../processors/PDFProcessor";

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
        console.log("resource:resource:pdf-scrape-metadata starting");

        const title = await extractPDFTitle(filePath);
        sender.send('resource:processed', id, {
            title: title,
            settledTitle: true,
            stages: [{ name: 'pdf-scrape-metadata', status: 'DONE' }]
        });
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

        console.log("resource:pdf-scrape-content starting;")

        const content = await extractPDFText(filePath);

        sender.send('resource:processed', id, {
            content: content,
            stages: [{ name: 'pdf-scrape-content', status: 'DONE' }]
        });
    } catch (error) {
        sender.send('resource:processed', id, {
            stages: [{ name: 'pdf-scrape-content', status: 'ERROR' }]
        });
        console.error('Content extraction failed:', error);
    }
});