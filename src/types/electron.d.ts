declare global {
    interface Window {
        electronAPI: {
            db: {
                get: (collection: string) => Promise<any>;
                set: (collection: string, data: any) => Promise<any>;
            },
            resources: {
                process: (url: string, id: string) => void;
                onProcessed: (callback: (resourceId: string, updates: Partial<Resource>) => void) => void;
                onError: (callback: (error: string) => void) => void;
                removeProcessedListener: (callback: (resourceId: string, updates: Partial<Resource>) => void) => void;
                removeErrorListener: (callback: (error: string) => void) => void;
            }
        }
    }
}

export {}; 