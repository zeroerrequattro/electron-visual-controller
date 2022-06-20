const { ipcMain } = require('electron')

const ipcMainHandler = () => {
  console.log('hello')
}

module.exports = { ipcMainHandler }
