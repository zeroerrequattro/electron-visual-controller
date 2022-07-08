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

  const toggles = document.querySelectorAll('button.toggle')
  toggles.forEach(t => {
    console.log(t)
    t.addEventListener('click', ({ currentTarget }) => {
      const toggle = currentTarget.getAttribute('data-toggle')
      console.log(toggle)

      toggles.forEach(tt => {
        const toggleCompare = tt.getAttribute('data-toggle')
        console.log(toggleCompare)

        if ( toggle !== toggleCompare ) {
          return
        }
        tt.classList.toggle('hidden')
      })
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