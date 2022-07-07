const fs = require('fs')
const path = require('path')

const joinPath = string => path.join(`${__dirname}${string}`)
const tempDir = joinPath('/temp')
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

module.exports = {
    tempDir,
    cleanDir, 
    joinPath,
}
