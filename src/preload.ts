// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { Resource } from './constants/interfaces';

contextBridge.exposeInMainWorld('electronAPI', {
    db: {
        get: (collection: string) => ipcRenderer.invoke('db:get', collection),
        set: (collection: string, data: any) => ipcRenderer.invoke('db:set', collection, data)
    },
    resources: {
        process: (url: string, id: string) => ipcRenderer.send('resource:process', url, id),
        onProcessed: (callback: (resourceId: string, updates: Partial<Resource>) => void) => 
            ipcRenderer.on('resource:processed', (_, resourceId, updates) => callback(resourceId, updates)),
        onError: (callback: (error: string) => void) => 
            ipcRenderer.on('resource:error', (_, error) => callback(error)),
        removeProcessedListener: (callback: (resourceId: string, updates: Partial<Resource>) => void) => {
            const wrappedCallback = (_: any, resourceId: string, updates: Partial<Resource>) => callback(resourceId, updates);
            ipcRenderer.removeListener('resource:processed', wrappedCallback);
        },
        removeErrorListener: (callback: (error: string) => void) => 
            ipcRenderer.removeListener('resource:error', (_, error) => callback(error))
    }
});
