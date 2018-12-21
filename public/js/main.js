let game = new Phaser.Game(600, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update})
let player
let walls

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function preload() {
    game.load.image('wall', 'images/wall.png')
    game.load.spritesheet('human', 'images/human.png', 10, 10)
    game.world.setBounds(0, 0, 4010, 4010)
}

function create() {
    game.stage.backgroundColor = "#ffffff"
    walls = game.add.group()
    walls.enableBody = true
    let playerCounter = 0
    fetch('/getmaze', {method: 'POST'}).then((res) => {
      res.json().then((data) => {
        let maze = data.maze
        let coords = []
        for(let x = 0; x < (maze.length); x++) {
            for(let y = 0; y < (maze[x].length); y++) {
                coords.push([x, y])
            }
        }
        while(coords.length > 0) {
          let cellNum = 0
          if(coords.length > 1) {
              cellNum = getRandom(0, coords.length)
          }
          let cell = coords[cellNum]
          if(maze[cell[0]][cell[1]] == 1) {
              let wall = walls.create(cell[0]*10, cell[1]*10, 'wall')
              wall.body.immovable = true
          } else {
              if(playerCounter == 0) {
                  player = game.add.sprite(cell[0]*10, cell[1]*10, 'human')
                  playerCounter++
              }
          }
          coords.splice(cellNum, 1)
        }
        game.physics.arcade.enable(player)
        player.body.collideWorldBounds = true
        player.body.velocity.x = 0
        player.body.velocity.y = 0
        game.camera.follow(player)
      })
    })
}
function update() {
  cursors = game.input.keyboard.createCursorKeys()
  if(player) {
    player.body.velocity.x = 0
    player.body.velocity.y = 0
    if(cursors.left.isDown) {
        player.body.velocity.x = -150
        player.frame = 3
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150
        player.frame = 1
    } else if (cursors.up.isDown) {
        player.body.velocity.y = -150
        player.frame = 0
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 150
        player.frame = 2
    }
    game.physics.arcade.collide(player, walls)
  }
}
