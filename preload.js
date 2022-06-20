const { ipcRenderer } = require('electron')

ipcRenderer.on('tunnel:init', (event, args) => {
  console.log(args)
})

ipcRenderer.on('tunnel:request', (event, args) => {
  console.log(args)
})