declare global {
    interface Window {
        electronAPI: {
            db: {
                get: (collection: string) => Promise<any>;
                set: (collection: string, data: any) => Promise<any>;
            },
            resources: {
                process: (url: string, id: string) => void;
                onProcessed: (callback: (resource: any) => void) => void;
                onError: (callback: (error: string) => void) => void;
                removeProcessedListener: (callback: (resource: any) => void) => void;
                removeErrorListener: (callback: (error: string) => void) => void;
            }
        }
    }
}

export {}; 