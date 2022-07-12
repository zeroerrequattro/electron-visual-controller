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
    document.querySelector('input[data-request="video-opacity"]').value = 0.05
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

    fetch('/', {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(r => {
      const { files: { file: { type }}} = r
      const videoPlayer = document.querySelector('.video-player')
      if (type.includes('video')) {
        videoPlayer.classList.remove('hidden')
      } else {
        videoPlayer.classList.add('hidden')
      }
    })
    .finally(res => {
      submitButton.removeAttribute('disabled')
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

  document.querySelector('input[type="range"]')
    .addEventListener('change', ({ currentTarget }) => {
      const { value } = currentTarget
      const target = currentTarget.getAttribute('id')
      document.querySelector(`label[for="${target}"] > [data-value]`).innerText = value
    })

  document.querySelector('button[data-request="video-stop"]')
    .addEventListener('click', () => {
      document.querySelector('button[data-request="video-pause"]').classList.add('hidden')
      document.querySelector('button[data-request="video-play"]').classList.remove('hidden')
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
    r.addEventListener('click', sendRequest)
    // r.addEventListener('change', sendRequest)
  })
})()