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
    .finally(res => {
      submitButton.removeAttribute('disabled')
    })
  })

  document.querySelectorAll('button.request').forEach(r => {
    r.addEventListener('click', ({ currentTarget }) => {
      const req = currentTarget.getAttribute('data-target')
      fetch(req, {
        method: 'POST',
      }).finally(() => {
        window.close()
      })
    })
  })
})()