let game = new Phaser.Game(600, 600, Phaser.WEBGL, '', {preload: preload, create: create, update: update})
let player
let builders
let walls
let loadingText
let maze
let buildersCounter = 10

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

Silicon = function (index, coords, game, player) {
  let x = coords[0]
  let y = coords[1]

  this.game = game
  this.player = player
  this.alive = true
  this.silicon = game.add.sprite(x, y, 'silicon')
  this.silicon.name = index.toString()
  game.physics.enable(this.silicon, Phaser.Physics.ARCADE)
  this.silicon.body.immovable = false
  this.silicon.body.collideWorldBounds = true
}

Builder = function (index, coords, game, player) {
  this.game = game
  this.player = player
  this.alive = true

  this.builder = game.add.sprite(coords[0], coords[1], 'builder')
  this.builder.name = index.toString()
  this.builder.buildTimer = 20
  game.physics.enable(this.builder, Phaser.Physics.ARCADE)
  this.builder.body.immovable = false
  this.builder.body.collideWorldBounds = true
}

function preload() {
    game.load.image('wall', 'images/wall2.png')
    game.load.spritesheet('human', 'images/human2.png', 14, 14)
    game.load.spritesheet('silicon', 'images/silicon2.png', 14, 14)
    game.load.spritesheet('builder', 'images/builder.png', 20, 20, 4)
    game.world.setBounds(0, 0, 6020, 6020)
    game.stage.disableVisibilityChange = true
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    game.scale.pageAlignHorizontally = true
    game.scale.pageAlignVertically = true
    game.stage.backgroundColor = "#ffffff"
    loadingText = game.add.text(32, 32, 'Loading...', {fill: '#000000'})
    walls = game.add.group()
    walls.enableBody = true
    builders = []
    let playerCounter = 0
    fetch('/getmaze', {method: 'POST'}).then((res) => {
      res.json().then((data) => {
        maze = data.maze
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
              } else if(buildersCounter > 0) {
                  builders.push(new Builder(buildersCounter, [cell[0]*20, cell[1]*20], game, player))
                  buildersCounter--
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
    game.time.events.loop(Phaser.Timer.SECOND, createWall)
}
function update() {
  for(let i = 0; i < builders.length; i++) {
    if(builders[i].alive) {
      game.physics.arcade.collide(builders[i].builder, walls)
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

function createWall() {
  builders.forEach(function(unit) {
    if(unit.alive) {
      if(unit.builder.buildTimer > 0) {
        if(unit.builder.buildTimer%2 == 0) {
          unit.builder.frame = 2
        } else {
          unit.builder.frame = 1
        }
        unit.builder.buildTimer = unit.builder.buildTimer-5
      } else {
        let side = getMoveSide(unit.builder.x, unit.builder.y)
        let unitMovement = game.add.tween(unit.builder)
        switch (side) {
          case 'up':
            unitMovement.to({x: unit.builder.x, y: unit.builder.y-20}, 300)
            unitMovement.onComplete.add(function(){
              let wall = walls.create(unit.builder.x, unit.builder.y+20, 'wall')
              wall.body.immovable = true
            })
            unitMovement.start()
            break
          case 'down':
            unitMovement.to({x: unit.builder.x, y: unit.builder.y+20}, 300)
            unitMovement.onComplete.add(function(){
              let wall = walls.create(unit.builder.x, unit.builder.y-20, 'wall')
              wall.body.immovable = true
            })
            unitMovement.start()
            break
          case 'left':
            unitMovement.to({x: unit.builder.x-20, y: unit.builder.y}, 300)
            unitMovement.onComplete.add(function(){
              let wall = walls.create(unit.builder.x+20, unit.builder.y, 'wall')
              wall.body.immovable = true
            })
            unitMovement.start()
            break
          case 'right':
            unitMovement.to({x: unit.builder.x+20, y: unit.builder.y}, 300)
            unitMovement.onComplete.add(function(){
              let wall = walls.create(unit.builder.x-20, unit.builder.y, 'wall')
              wall.body.immovable = true
            })
            unitMovement.start()
            break
          case 'die motherfucker':
            unit.alive = false;
            let wall = walls.create(unit.builder.x, unit.builder.y, 'wall')
            wall.body.immovable = true
            game.world.remove(unit.builder)
            console.log('Builder ' + unit.builder.name + ' dead((')
            buildersCounter++
        }
        unit.builder.buildTimer = 20
      }
    }
  })
}

function getMoveSide(x, y) {
  let moves = []
  if(maze[x/20-1][y/20] == 0) {
    moves.push('left')
  }
  if(maze[x/20+1][y/20] == 0) {
    moves.push('right')
  }
  if(maze[x/20][y/20-1] == 0) {
    moves.push('up')
  }
  if(maze[x/20][y/20+1] == 0) {
    moves.push('down')
  }
  maze[x/20][y/20] = 1
  if(moves.length > 0) {
    return moves[getRandom(0, moves.length)]
  } else {
    return 'die motherfucker'
  };

}
