import { BrowserWindow } from "electron";
import { IpcChannel, IpcMainChannelInterface } from "./commons/ipc/ipcChannelInterface";
import { NetworkUtil } from "./commons/utils";
import { StartServerChannel, SetProtoImportPathsChannel, CloseElectronAppChannel } from "./main_process/ipc/ipcMainChannels";

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
} = require('electron');

const gotSingleInstanceLock = app.requestSingleInstanceLock()
let appReadyToQuit = false
if (!gotSingleInstanceLock) {
  app.quit()
}

let mainWindow: BrowserWindow | null = null;


function init() {
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
    installExtensions();
  }

  app.on('window-all-closed', onWindowAllClosed);
  app.on('ready', createWindow);
  app.on('before-quit', event => notifyRendererToCleanUp(event))
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}


function installExtensions(): Promise<any> {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions: any[] = [];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
}


function onWindowAllClosed() {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
}


function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1324,
    height: 800,
    backgroundColor: "#f0f2f5",
    //@ts-ignore : webpack defined constant
    title: `${__APP_DISPLAY_NAME__} @ ${NetworkUtil.getLocalIp()}:50051`,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    setTimeout(() => {
      mainWindow?.show();
      mainWindow?.focus();
    }, 150);
  });

  mainWindow.on('close', (event) => notifyRendererToCleanUp(event))
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  registerIpcChannels([new SetProtoImportPathsChannel(), new StartServerChannel(), new CloseElectronAppChannel()])
}

function registerIpcChannels(ipcChannels: IpcMainChannelInterface[]) {
  ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
}

function notifyRendererToCleanUp(event: Electron.Event) {
  if (appReadyToQuit) return;
  event.preventDefault()
  mainWindow?.webContents.send(IpcChannel.onAppCloseRequest)
  appReadyToQuit = true
}


init()