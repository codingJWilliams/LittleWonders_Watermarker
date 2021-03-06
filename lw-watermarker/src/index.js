const {app, BrowserWindow, ipcMain, protocol} = require('electron');
const path = require('path')
const url = require('url')
var wm = require("./watermarking");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400, 
    height: 800,
    resizable: false,
    alwaysOnTop: true,
    x: 1520,
    y: 0,
    frame: true,
    minimizable: false,
    maximizable: false,
    thickFrame: true
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.setMenu(null);
  // Open the DevTools.
  //win.webContents.openDevTools()
  protocol.registerFileProtocol('local', (request, callback) => {
    const url = request.url.substr(8)
    callback({path: path.normalize(`${__dirname}/${url}`)})
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
ipcMain.on('async', (event, arg) => {  
  wm.batch(arg).then( () => {
    event.sender.send('async-reply', {status: "done"});
  })
  // Reply on async message from renderer process
  
});
