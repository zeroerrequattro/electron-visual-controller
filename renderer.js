let i = 0
const cycleImages = async () => {
  const dataJson = document.querySelector('[data-json]').innerText
  if(!dataJson) { return }
  
  const images = JSON.parse(dataJson)
  const container = document.querySelector('video.contain')
  container.setAttribute('src',images[i])
  // container.style.opacity = 0
  setTimeout(() => {
    // container.style.backgroundImage = `url(${images[i]})`
    // container.style.opacity = 1
    i = (i >= (images.length - 1)) ? 0 : (i+1)
    cycleImages()
  }, 60000)
}

window.addEventListener('load', cycleImages)
