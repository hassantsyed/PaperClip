import { ProcessUrlEvent } from "../../constants/eventInterfaces";
import { events } from "../events";
import { app } from 'electron';
import { createWriteStream } from 'fs';
import { join } from 'path';
import https from 'https';
import fs from 'fs/promises';
import { PDFResourceModel } from "../../models/Resource";

// Ensure downloads directory exists
const downloadsPath = join(app.getPath('userData'), 'downloads');
fs.mkdir(downloadsPath, { recursive: true }).catch(console.error);

events.on('resource:url-submitted', async ({ url, id, sender }: ProcessUrlEvent) => {
    try {
        // Check content type
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/pdf')) {
            // Convert to PDF resource
            const pdfResource = new PDFResourceModel('PDF Document');
            pdfResource.id = id;  // Keep same ID for tracking

            // Create file path and download
            const filePath = join(downloadsPath, `${id}.pdf`);
            await new Promise((resolve, reject) => {
                https.get(url, (response) => {
                    const fileStream = createWriteStream(filePath);
                    response.pipe(fileStream);
                    
                    fileStream.on('finish', () => {
                        fileStream.close();
                        resolve(filePath);
                    });
                    
                    fileStream.on('error', reject);
                }).on('error', reject);
            });
            pdfResource.filePath = filePath;
            sender.send('resource:processed', id, pdfResource);
            // Start PDF processing
            events.emit('resource:pdf-detected', { url, id, sender, filePath });
        } else {
            sender.send('resource:error', `Content type '${contentType}' is not supported yet`);
        }
    } catch (error) {
        sender.send('resource:error', `Failed to fetch URL: ${error.message}`);
    }
});