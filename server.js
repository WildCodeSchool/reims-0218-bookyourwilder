const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

const html = `
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <title>NodeJS server</title>
    <link rel="stylesheet" href="bootstrap.min.css" />
  </head>
  <body>
    <div id="main">

    </div>
    <script src="page.js"></script>
    <script src="app.js"></script>
  </body>
</html>`

// i'm sending the skeleton of the page (when i'm receiving any of the routes)
app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

// i will do something when receiving the homepage request
app.get('/', (req, res) => {

})

app.listen(8000)
