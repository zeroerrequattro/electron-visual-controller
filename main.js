// Modules to control application life and create native browser window
const { app, BrowserWindow, screen } = require('electron')
const lt = require('localtunnel')
const { ipcMainHandler } = require('./ipcMainHandler')
const { webInit } = require('./web')

const createWindow = async () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  
  // Create the browser window.
  const win = new BrowserWindow({
    width: primaryDisplay.size.width,
    height: primaryDisplay.size.height,
    x: 0,
    y: 0,
    show: false,
    // frame: false,
    // opacity: .02,
    // backgroundColor: '#00FFFFFF',
    // transparent: true,
    // resizable: false,
    // movable: false,
    // focusable: false,
    // autoHideMenuBar: true,
    // alwaysOnTop: true,
    // fullscreenable: false,
    // hasShadow: false,
    // roundedCorners: false,
    // thickFrame: false,
    webPreferences: {
      preload: `${__dirname}/preload.js`
    }
  })

  // win.setIgnoreMouseEvents(true)
  // win.setSkipTaskbar(true)

  // and load the index.html of the app.
  win.loadFile(`${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  return win
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await webInit()
  const win = await createWindow()
  // const tunnel = await lt({
  //   port: 12627,
  //   subdomain: 'top-layer-app'
  // })
  // win.webContents.send('tunnel:init', tunnel.url)
  win.show()
  // ipcMainHandler()
  // process.platform === 'darwin' && app.dock.hide()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', app.quit)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.