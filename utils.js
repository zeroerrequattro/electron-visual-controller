const fs = require('fs')
const path = require('path')
const lt = require('localtunnel')

const joinPath = string => path.join(`${__dirname}${string}`)

const tempDir = joinPath('/public/temp')

const cleanDir = excludeFilePath => {
  const tempFiles = fs.readdirSync(tempDir)
  const currentFile = excludeFilePath?.replace(tempDir,'').substr(1)

  tempFiles.forEach(tempFile => {
    if (currentFile && tempFile === currentFile) {
      return
    }

    fs.unlinkSync(`${tempDir}/${tempFile}`)
  })
}

const tunnelInit = async () => await lt({
  port: 12627,
  subdomain: 'top-layer-app'
})

module.exports = {
    tempDir,
    cleanDir, 
    joinPath,
    tunnelInit,
}
