// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain, powerMonitor } = require('electron')
const { cleanDir, tunnelInit } = require('./utils')
const { webInit } = require('./web')

const cleanQuit = () => {
  cleanDir()
  app.quit()
}

const createWindow = async () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  
  // Create the browser window.
  const win = new BrowserWindow({
    width: primaryDisplay.size.width,
    height: primaryDisplay.size.height,
    x: 0,
    y: 0,
    show: false,
    frame: false,
    opacity: .5,
    backgroundColor: '#00FFFFFF',
    transparent: true,
    resizable: false,
    movable: false,
    focusable: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    fullscreenable: false,
    hasShadow: false,
    roundedCorners: false,
    thickFrame: false,
    webPreferences: {
      preload: `${__dirname}/preload.js`
    }
  })

  win.setIgnoreMouseEvents(true)
  win.setSkipTaskbar(true)

  // and load the index.html of the app.
  win.loadFile(`${__dirname}/index.html`)

  // Open the DevTools.
  // win.webContents.openDevTools()

  return win
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await webInit()
  const win = await createWindow()
  let tunnel = await tunnelInit()
  // win.webContents.send('tunnel:init', tunnel.url)
  win.show()
  process.platform === 'darwin' && app.dock.hide()
  ipcMain.on('tunnel:hide', () => { win.hide() })
  ipcMain.on('tunnel:show', () => { win.show() })

  powerMonitor.on('suspend', tunnel.close)
  powerMonitor.on('resume', async () => {
    cleanDir()
    tunnel = await tunnelInit()
  })
  powerMonitor.on('shutdown', cleanQuit)
})

// app.on('window-all-closed', cleanQuit)
ipcMain.on('tunnel:quit', cleanQuit)
