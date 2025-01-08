// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    db: {
        get: (collection: string) => ipcRenderer.invoke('db:get', collection),
        set: (collection: string, data: any) => ipcRenderer.invoke('db:set', collection, data)
    }
});
