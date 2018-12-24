let game = new Phaser.Game(600, 600, Phaser.WEBGL, 'game', {preload: preload, create: create, update: update})
let player
let walls
let loadingText

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function preload() {
    game.load.image('wall', 'images/wall2.png')
    game.load.spritesheet('human', 'images/human2.png', 14, 14)
    game.world.setBounds(0, 0, 8020, 8020)
}

function create() {
    game.stage.backgroundColor = "#ffffff"
    loadingText = game.add.text(32, 32, 'Loading...', {fill: '#000000'})
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
        let counter = coords.length
        let percent = 10
        loadingText.setText('Loading... ' + percent + '%')
        while(coords.length > 0) {
          let cellNum = 0
          if(coords.length > 1) {
              cellNum = getRandom(0, coords.length)
          }
          let cell = coords[cellNum]
          if(maze[cell[0]][cell[1]] == 1) {
              let wall = walls.create(cell[0]*20, cell[1]*20, 'wall')
              wall.body.immovable = true
          } else {
              if(playerCounter == 0) {
                  player = game.add.sprite(cell[0]*20, cell[1]*20, 'human')
                  playerCounter++
              }
          }
          coords.splice(cellNum, 1)
          if(Math.floor(100-coords.length/(counter/100)) == percent) {
            console.log('Loading... ' + percent + '%')
            percent = Math.floor(100-coords.length/(counter/100)) + 10
          }
        }
        game.world.remove(loadingText)
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
  let fire = game.input.keyboard.addKey(Phaser.Keyboard.C)
  if(player) {
    player.body.velocity.x = 0
    player.body.velocity.y = 0
    if(cursors.left.isDown) {
        player.body.velocity.x = -225
        player.frame = 3
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 225
        player.frame = 1
    } else if (cursors.up.isDown) {
        player.body.velocity.y = -225
        player.frame = 0
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 225
        player.frame = 2
    }
    if(fire.isDown) {
      console.log('SHOOOT!')
    }
    game.physics.arcade.collide(player, walls)
  }
}
