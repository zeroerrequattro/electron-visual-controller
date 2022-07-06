const express = require('express')
const formData = require('express-form-data')
const fs = require('fs')
const path = require('path')
const { webContents } = require('electron')

const joinPath = string => path.join(`${__dirname}${string}`)
const app = express()
const port = 12627
const router = express.Router()
const tempDir = joinPath('/temp')
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
  const { name, path } = files.file
  const allWC = webContents.getAllWebContents()
  const tempFiles = fs.readdirSync(tempDir)
  const currentFile = path.replace(tempDir,'').substr(1)

  tempFiles.forEach(tempFile => {
    if (tempFile === currentFile) {
      return
    }

    fs.unlinkSync(`${tempDir}/${tempFile}`)
  })

  allWC.forEach(webContent => {
    webContent.send('tunnel:request', { body, files })
  })

  res.json({
    status: 'ok',
    body,
    files,
  })
})

const webInit = async () => await app.listen(port, () => {
  console.log(`App listening port ${port}`)
})

module.exports = { webInit }
