const express = require('express')
const path = require('path')
const { ipcMain } = require('electron')

const joinPath = string => path.join(`${__dirname}${string}`)
const app = express()
const port = 12627
const router = express.Router()
const static = express.static(joinPath('/public'))

app.use(express.json())
app.use('/static', static)
app.use('/', router)

app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
  res.render(joinPath('/web/index.ejs'))
  // res.json('go away')
})

const webInit = async () => await app.listen(port, () => {
  console.log(`App listening port ${port}`)
})

module.exports = { webInit }
