const maze = require('../logic/maze')
const {mongoose} = require('../db/mongoose')

module.exports = function(app) {
  app.post('/getmaze', (req, res) => {
    maze.getMaze(2, 2).then((data) => {
      res.send({maze: data})
    }).catch((err) => {
      res.send({err: err})
    })
  })
}
