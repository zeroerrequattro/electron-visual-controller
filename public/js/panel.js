(() => {
  const form = document.getElementById('form')
  const submitButton = form.querySelector('button[type="submit"]')
  const data = {}

  form.addEventListener('submit', e => {
    e.preventDefault()

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

  document.querySelectorAll('button[data-request]').forEach(r => {
    r.addEventListener('click', ({ currentTarget }) => {
      const req = currentTarget.getAttribute('data-request')
      if(!req) {
        console.log('no request available')
        return
      }

      fetch(`/send/${req}`, {
        method: 'POST',
      }).finally(() => {
        window.close()
      })
    })
  })
})()