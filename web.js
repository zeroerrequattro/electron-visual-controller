const express = require('express')

const app = express()
const port = 12627

app.get('/', (req, res) => {
  res.json('go away')
})

const webInit = async () => await app.listen(port, () => {
  console.log(`App listening port ${port}`)
})

module.exports = { webInit }
