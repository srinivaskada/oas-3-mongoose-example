import fs from 'fs'
import http from 'http'
import path from 'path'
import oasTools from 'oas-tools'
import jsYaml from 'js-yaml'

import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(
  bodyParser.json({
    strict: false
  })
)
const serverPort = process.env.PORT

const spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8')
const oasDoc = jsYaml.safeLoad(spec)

var optionsObject = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'error',
  strict: true,
  router: true,
  validator: true
}

oasTools.configure(optionsObject)

oasTools.initialize(oasDoc, app, () => {
  http.createServer(app).listen(serverPort, function () {
    console.log('App running at http://localhost:%s', serverPort)
    console.log(
      '________________________________________________________________'
    )
    if (optionsObject.docs !== false) {
      console.log(
        'API docs (Swagger UI) available on http://localhost:%s/docs',
        serverPort
      )
      console.log(
        '________________________________________________________________'
      )
    }
  })
})

app.get('/info', (req, res) => {
  res.send({
    info: 'This API was generated using oas-generator!',
    name: oasDoc.info.title
  })
})
module.exports = app
