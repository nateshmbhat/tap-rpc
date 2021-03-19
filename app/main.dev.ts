import { BrowserWindow } from "electron";

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 */
const {
  app,
  ipcMain,
  ipcRenderer
} = require('electron');

class Main {
  private mainWindow: BrowserWindow | null = null;

  public getMainWindow(): BrowserWindow {
    return this.mainWindow!
  }

  public init() {
    if (process.env.NODE_ENV === 'production') {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }

    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      require('electron-debug')();
      const path = require('path');
      const p = path.join(__dirname, '..', 'app', 'node_modules');
      require('module').globalPaths.push(p);
      this.installExtensions();
    }

    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('ready', this.createWindow);
  }


  private installExtensions(): Promise<any> {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions: any[] = [];

    return Promise.all(
      extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log);
  }


  private onWindowAllClosed() {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private async createWindow() {
    this.mainWindow = new BrowserWindow({
      show: false,
      width: 1324,
      height: 728,
      backgroundColor: "#f0f2f5",
      //@ts-ignore : webpack defined constant
      title: __APP_DISPLAY_NAME,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
      }
    });

    this.mainWindow.loadURL(`file://${__dirname}/app.html`);

    // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    this.mainWindow.once('ready-to-show', () => {
      if (!this.mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }

      setTimeout(() => {
        this.mainWindow?.show();
        this.mainWindow?.focus();
      }, 150);
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }
}


new Main().init()