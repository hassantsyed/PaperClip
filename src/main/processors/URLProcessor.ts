import { ProcessUrlEvent } from "../../constants/eventInterfaces";
import { events } from "../events";

events.on('resource:url-submitted', async ({ url, id, sender }: ProcessUrlEvent) => {
    try {
        // Check content type
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/pdf')) {
            // Emit PDF detected event
            events.emit('resource:pdf-detected', { url, id, sender });
        } else {
            sender.send('resource:error', `Content type '${contentType}' is not supported yet`);
        }
    } catch (error) {
        sender.send('resource:error', `Failed to fetch URL: ${error.message}`);
    }
});