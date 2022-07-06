const { ipcRenderer } = require('electron')

ipcRenderer.on('tunnel:init', (event, args) => {
  console.log(args)
})

ipcRenderer.on('tunnel:request', (event, { body, files }) => {
  const { type, path } = files.file
  const [ fileType, ext ] = type.split('/')

  console.log(type, fileType, ext)

  document.querySelectorAll('.contain').forEach(c => {
    c.style.display = 'none'
  })
  
  switch (fileType) {
    case 'image':
      const imgContain = document.querySelector('.image.contain')
      imgContain.style.backgroundImage = `url(${path})`
      imgContain.style.display = 'block'
      break
    case 'video':
      const videoContain = document.querySelector('video.contain')
      videoContain.setAttribute('src', path)
      videoContain.style.display = 'block'
      break
  }
})