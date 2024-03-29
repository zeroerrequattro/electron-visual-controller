(() => {
  const form = document.getElementById('form')
  const submitButton = form.querySelector('button[type="submit"]')
  const data = {}

  const resetPanel = () => {
    document.querySelectorAll('.controls').forEach(c => {
      c.classList.add('hidden')
    })
    document.querySelector('button[data-request="video-pause"]').classList.remove('hidden')
    document.querySelector('button[data-request="video-play"]').classList.add('hidden')
    document.querySelector('input[data-request*="opacity"]').value = 0.05
    document.querySelector('input[data-request="video-speed"]').value = 1
  }

  form.addEventListener('submit', e => {
    e.preventDefault()
    resetPanel()

    const formData = new FormData(e.currentTarget)

    for (const [key, val] of formData.entries() ) {
      data[key] = val
    }

    submitButton.setAttribute('disabled', true)
    submitButton.classList.add('loading')
    submitButton.innerText = 'Loading'

    fetch('/', {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(r => {
      const { files: { file: { type, path }}} = r
      const [ currentFilename ] = path.replace(/\\/g,'/').split('/').splice(-1,1)

      if (type.includes('video')) {
        document.querySelector('.video-player').classList.remove('hidden')
      }

      if (type.includes('image')) {
        document.querySelector('.image-player').classList.remove('hidden')
        const imagePreview = document.querySelector('img.preview')
        imagePreview.src = `/static/temp/${currentFilename}`
        const positionSelect = 
        document.querySelector('.position-select')

        positionSelect.classList.remove('horizontal','vertical')

        imagePreview.addEventListener('load', () => {

          const screenAspectRatio = Number(positionSelect.getAttribute('data-screen-aspect-ratio'))
          const imageAspectRatio = imagePreview.offsetHeight / imagePreview.offsetWidth

          positionSelect.style = `--position-width: ${imagePreview.offsetWidth}px; --position-height: ${imagePreview.offsetHeight}px; --screen-aspect-ratio: ${screenAspectRatio};`
  
          if (imageAspectRatio > screenAspectRatio) {
            positionSelect.classList.add('vertical')
            positionSelect.style.top = `${(imagePreview.offsetHeight / 2) - ((imagePreview.offsetWidth * screenAspectRatio) / 2)}px`
          } else {
            positionSelect.classList.add('horizontal')
            positionSelect.style.left = `${(imagePreview.offsetWidth / 2) - ((imagePreview.offsetHeight / screenAspectRatio) / 2)}px`
          }
        })
      }
    })
    .finally(res => {
      submitButton.removeAttribute('disabled')
      submitButton.classList.remove('loading')
      submitButton.innerText = 'Submit'
    })
  })

  window.addEventListener('load', () => {
    fetch(
      '/init',
      {
        method: 'GET',
      }
    )
    .then(r => r.json())
    .then(r => {
      const { widthAspectRatio } = r.screen
      const positionSelect = 
      document.querySelector('.position-select')
      positionSelect.setAttribute('data-screen-aspect-ratio', widthAspectRatio)
    })
  })

  const toggles = document.querySelectorAll('button[data-toggle]')
  toggles.forEach(t => {
    t.addEventListener('click', ({ currentTarget }) => {
      const toggle = currentTarget.getAttribute('data-toggle')
      toggles.forEach(tt => {
        const toggleCompare = tt.getAttribute('data-toggle')
        if ( toggle !== toggleCompare ) {
          return
        }

        tt.classList.toggle('hidden')
      })
    })
  })

  document.querySelectorAll('input[type="range"]').forEach(r => {
    r.addEventListener('change', ({ currentTarget }) => {
      const { value } = currentTarget
      const target = currentTarget.getAttribute('id')
      document.querySelector(`label[for="${target}"] > [data-value]`).innerText = value
    })
  })

  document.querySelector('button[data-request="video-stop"]')
    .addEventListener('click', () => {
      document.querySelector('button[data-request="video-pause"]').classList.add('hidden')
      document.querySelector('button[data-request="video-play"]').classList.remove('hidden')
    })
  
  const onDragX = ({ currentTarget, movementX }) => {
    const {
      left: targetLeft,
      width: targetWidth,
    } = window.getComputedStyle(currentTarget)

    const {
      width: parentWidth,
    } = window.getComputedStyle(currentTarget.parentNode)

    const targetLeftInt = parseInt(targetLeft)
    const targetWidthInt = parseInt(targetWidth)
    const parentWidthInt = parseInt(parentWidth)
    const finalPositionX = targetLeftInt + movementX

    if(
      finalPositionX < 0 
      || (finalPositionX + targetWidthInt) > parentWidthInt
    ) {
      return
    }
    
    currentTarget.style.left = `${finalPositionX}px`
  }

  const onDragY = ({ currentTarget, movementY }) => {
    const {
      top: targetTop,
      height: targetHeight,
    } = window.getComputedStyle(currentTarget)

    const {
      height: parentHeight,
    } = window.getComputedStyle(currentTarget.parentNode)

    const targetTopInt = parseInt(targetTop)
    const targetHeightInt = parseInt(targetHeight)
    const parentHeightInt = parseInt(parentHeight)
    const finalPositionY = targetTopInt + movementY

    if(
      finalPositionY <= 0
      || (finalPositionY + targetHeightInt) >= parentHeightInt
    ) {
      return
    }
    
    currentTarget.style.top = `${finalPositionY}px`
  }
  
  document.querySelectorAll('[data-draggable]').forEach(drag => {
    drag.addEventListener('mousedown', () => {
      drag.addEventListener('mousemove', onDragX)
      drag.addEventListener('mousemove', onDragY)
    })

    drag.addEventListener('mouseup', async () => {
      drag.removeEventListener('mousemove', onDragX)
      drag.removeEventListener('mousemove', onDragY)

      const req = drag.getAttribute('data-request')

      if(!req) {
        return
      }

      const {
        left: targetLeft,
        top: targetTop,
        width: targetWidth,
        height: targetHeight,
      } = window.getComputedStyle(drag)
      const {
        width: parentWidth,
        height: parentHeight,
      } = window.getComputedStyle(drag.parentNode)

      const posX = ((parseInt(targetLeft) + (parseInt(targetWidth) / 2)) / parseInt(parentWidth)) * 100
      const posY = ((parseInt(targetTop) + (parseInt(targetHeight) / 2)) / parseInt(parentHeight)) * 100

      await fetch(`/send/${req}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ posX, posY })
      })
    })
  })

  const sendRequest = async ({ currentTarget }) => {
    const req = currentTarget.getAttribute('data-request')
    const { value } = currentTarget
  
    if(!req) {
      console.log('no request available')
      return
    }

    await fetch(`/send/${req}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value })
    })
      // .then(r => r.json())
      // .then(r => console.log(r))
  }

  document.querySelectorAll('[data-request]').forEach(r => {
    if (r.tagName === 'select') {
      r.addEventListener('change', sendRequest)
    } else {
      r.addEventListener('click', sendRequest)
    }
  })
})()