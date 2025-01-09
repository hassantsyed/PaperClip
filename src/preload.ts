// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    db: {
        get: (collection: string) => ipcRenderer.invoke('db:get', collection),
        set: (collection: string, data: any) => ipcRenderer.invoke('db:set', collection, data)
    },
    resources: {
        process: (url: string, id: string) => ipcRenderer.send('resource:process', url, id),
        onProcessed: (callback: (resource: any) => void) => 
            ipcRenderer.on('resource:processed', (_, resource) => callback(resource)),
        onError: (callback: (error: string) => void) => 
            ipcRenderer.on('resource:error', (_, error) => callback(error)),
        removeProcessedListener: (callback: (resource: any) => void) => 
            ipcRenderer.removeListener('resource:processed', (_, resource) => callback(resource)),
        removeErrorListener: (callback: (error: string) => void) => 
            ipcRenderer.removeListener('resource:error', (_, error) => callback(error))
    }
});
