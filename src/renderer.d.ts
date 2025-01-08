interface Window {
    electronAPI: {
        db: {
            get: (collection: string) => Promise<any>;
            set: (collection: string, data: any) => Promise<any>;
        }
    }
}

export interface ElectronAPI {
    db: {
        get: (collection: string) => Promise<any>;
        set: (collection: string, data: any) => Promise<any>;
    }
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
} 