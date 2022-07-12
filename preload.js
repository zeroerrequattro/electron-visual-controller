const { ipcRenderer } = require('electron')
 
ipcRenderer.on('tunnel:init', (event, args) => {
  console.log(args)
})

ipcRenderer.on('tunnel:show', () => {
  ipcRenderer.send('tunnel:show')
})

ipcRenderer.on('tunnel:hide', () => {
  ipcRenderer.send('tunnel:hide')
})

ipcRenderer.on('tunnel:quit', () => {
  ipcRenderer.send('tunnel:quit')
})

ipcRenderer.on('tunnel:video-play', () => {
  const video = document.querySelector('video')
  video.play()
})

ipcRenderer.on('tunnel:video-pause', () => {
  const video = document.querySelector('video')
  video.pause()
})

ipcRenderer.on('tunnel:video-stop', () => {
  const video = document.querySelector('video')
  video.pause()
  video.currentTime = 0
})

ipcRenderer.on('tunnel:opacity', (event, { value }) => {
  document.querySelectorAll('.contain').forEach(c => {
    c.style.opacity = value
  })
})

ipcRenderer.on('tunnel:request', (event, { body: { opacity }, files: { file } }) => {
  const { type, path } = file
  const [ fileType, ext ] = type.split('/')
  const unixPath = path.replace(/\\/g,'/')

  document.querySelectorAll('.contain').forEach(c => {
    c.style.display = 'none'
  })
  
  switch (fileType) {
    case 'image':
      const imgContain = document.querySelector('.image.contain')
      imgContain.style.backgroundImage = `url(${unixPath})`
      imgContain.style.display = 'block'
      imgContain.style.opacity = opacity
      break
    case 'video':
      const videoContain = document.querySelector('video.contain')
      videoContain.setAttribute('src', unixPath)
      videoContain.style.display = 'block'
      videoContain.style.opacity = opacity
      break
  }
})
