const mongoose = require('mongoose')

let MazeSchema  = new mongoose.Schema({
  map: {
    type: Array
  },
  createdAt: {
    type: Number
  },
  activeStatus: {
    type: Boolean,
    required: true
  },
  winners: {
    type: String
  }
})

const Maze = mongoose.model('Maze', MazeSchema)

module.exports = {Maze}
