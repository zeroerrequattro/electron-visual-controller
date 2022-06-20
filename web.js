const express = require('express')
const { ipcMain } = require('electron')

const app = express()
const port = 12627
const static = express.static(path.join(__dirname + '/public'))

app.use(express.json())
app.use('/static', static)
app.use('/', router)



app.get('/', (req, res) => {
  res.json('go away')
})

const webInit = async () => await app.listen(port, () => {
  console.log(`App listening port ${port}`)
})

module.exports = { webInit }
