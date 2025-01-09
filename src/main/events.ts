import { EventEmitter } from 'events';
import { PDFResource, Resource } from '../constants/interfaces';
import { WebContents } from 'electron';
import { ProcessUrlEvent } from '../constants/eventInterfaces';

export const events = new EventEmitter();

// Export a function to start processing
export const processUrl = (url: string, id: string, sender: WebContents) => {
    events.emit('resource:url-submitted', { url, id, sender });
}; 