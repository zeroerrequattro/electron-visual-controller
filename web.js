const express = require('express')
const formData = require('express-form-data')
const { webContents } = require('electron')
const { tempDir, cleanDir, joinPath } = require('./utils')

const app = express()
const port = 12627
const router = express.Router()
const static = express.static(joinPath('/public'))
const options = {
  uploadDir: tempDir,
  autoClean: false
}

// app.use(express.json())
app.use(formData.parse(options))
app.use('/static', static)
app.use('/', router)

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render(joinPath('/web/index'), {})
})

app.post('/', formData.parse(options), (req, res) => {
  const { body, files } = req
  const { path: filePath } = files.file
  const allWC = webContents.getAllWebContents()

  cleanDir(filePath)

  allWC.forEach(webContent => {
    webContent.send('tunnel:request', { body, files })
  })

  res.json({
    status: 'ok',
    body,
    files,
  })
})

app.post('/show', () => {
  const allWC = webContents.getAllWebContents()
  allWC.forEach(webContent => {
    webContent.send('tunnel:show')
  })
})

app.post('/hide', () => {
  const allWC = webContents.getAllWebContents()
  allWC.forEach(webContent => {
    webContent.send('tunnel:hide')
  })
})

app.post('/quit', () => {
  const allWC = webContents.getAllWebContents()
  allWC.forEach(webContent => {
    webContent.send('tunnel:quit')
  })
})

const webInit = async () => await app.listen(port, () => {
  console.log(`App listening port ${port}`)
})

module.exports = { webInit }
