import 'dotenv/config';
import { app, BrowserWindow, ipcMain, session } from 'electron';
import { db } from './main/db';
import { processUrl } from './main/events';

// Import processors to register their event listeners
import './main/handlers/URLHandler';
import './main/handlers/PDFHandler';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Add these IPC handlers before createWindow
ipcMain.handle('db:get', async (_, collection: string) => {
    return db.get(collection);
});

ipcMain.handle('db:set', async (_, collection: string, data: any) => {
    return db.set(collection, data);
});

ipcMain.on('resource:process', (event, url: string, id: string) => {
    processUrl(url, id, event.sender);
});

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowFileAccessFromFileURLs: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Modify CSP for PDF.js worker
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-eval' 'unsafe-inline' blob: data: file:;",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: data: file:;",
          "worker-src 'self' blob: data: file:;",
          "connect-src 'self' ws: wss: file:;"
        ]
      }
    });
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
