let game = new Phaser.Game(600, 600, Phaser.WEBGL, 'game', {preload: preload, create: create, update: update})
let player
let silicons
let walls
let loadingText

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

Silicon = function (index, coords, game, player) {
  let x = coords[0]
  let y = coords[1]
  let angles = [0, 90, 180, -90]

  this.game = game
  this.player = player
  this.alive = true
  this.silicon = game.add.sprite(x, y, 'silicon')
  this.silicon.name = index.toString()
  game.physics.enable(this.silicon, Phaser.Physics.ARCADE)
  this.silicon.body.immovable = false
  this.silicon.body.collideWorldBounds = true
  this.silicon.body.bounce.setTo(1, 1)

  //this.silicon.angle = angles[getRandom(0, 3)]
  game.physics.arcade.velocityFromRotation(this.silicon.rotation, 150, this.silicon.body.velocity)
}

function preload() {
    game.load.image('wall', 'images/wall2.png')
    game.load.spritesheet('human', 'images/human2.png', 14, 14)
    game.load.spritesheet('silicon', 'images/silicon2.png', 14, 14)
    game.world.setBounds(0, 0, 4020, 4020)
    game.stage.disableVisibilityChange = true
}

function create() {
    game.stage.backgroundColor = "#ffffff"
    loadingText = game.add.text(32, 32, 'Loading...', {fill: '#000000'})
    walls = game.add.group()
    walls.enableBody = true
    let siliconsCounter = 0
    silicons = []
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
              } else if(siliconsCounter < 30) {
                  silicons.push(new Silicon(0, [cell[0]*20, cell[1]*20], game, player))
                  siliconsCounter++
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
  for(let i = 0; i < silicons.length; i++) {
    if(silicons[i].alive) {
      game.physics.arcade.collide(player, silicons[i].silicon)
      game.physics.arcade.collide(silicons[i].silicon, walls)
    }
  }
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
