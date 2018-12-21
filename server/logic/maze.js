const {Maze} = require('../models/maze')

let width = 200
let height = 200

let limit = 100

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Рекурсивная функция разделения массива на регионы с помощью чисел в ячейках массива
//arr - субрегион для разделения
//counter - метка для деления, которая увеличивается каждую итерацию на 2
//map - исходный массив для деления
function sliceMap(arr, counter, map, regions) {
  let cellsA = []
  let cellsB = []
  let growBox = []

  if(arr.length > limit) {
      let firstCell = getRandom(0, arr.length)
      let secondCell = getRandom(0, arr.length)

      for(let j = 0; j < arr.length; j++) {
          map[arr[j][0]][arr[j][1]] = 0
      }

      let a = arr[firstCell]
      let freeCell = 0
      map[a[0]][a[1]] = counter + 1
      cellsA.push(a)
      growBox.push(a)

      let b = arr[secondCell]
      map[b[0]][b[1]] = counter + 2
      cellsB.push(b)
      growBox.push(b)

      arr.splice(firstCell, 1)
      arr.splice(secondCell, 1)

      let walk = 0

      while(growBox.length > 0) {
          let cell = 0
          if(growBox.length > 1) {
              cell = getRandom(0, growBox.length)
          }
          for(let x = -1; x < 2; x++) {
              for(let y = -1; y < 2; y++) {
                  if(growBox[cell][0]+x >= 0 && growBox[cell][0]+x < map.length && growBox[cell][1]+y >= 0 && growBox[cell][1]+y < map[0].length) {
                      if(map[growBox[cell][0]+x][growBox[cell][1]+y] == freeCell) {
                          map[growBox[cell][0]+x][growBox[cell][1]+y] = map[growBox[cell][0]][growBox[cell][1]]
                          if(map[growBox[cell][0]][growBox[cell][1]] < counter+2) {
                            cellsA.push([growBox[cell][0]+x, growBox[cell][1]+y])
                          } else {
                            cellsB.push([growBox[cell][0]+x, growBox[cell][1]+y])
                          }
                          growBox.push([growBox[cell][0]+x, growBox[cell][1]+y])
                      }
                  }
                  }
              }
          growBox.splice(cell, 1)
          }
      if(cellsA.length > limit) {
          regions.push(cellsA)
      }
      if(cellsB.length > limit) {
          regions.push(cellsB)
      }
      regions.shift()
  } else {
    regions.shift()
  }
}

//Функция определения необходимости стены в зависимости от координат массива, возвращает true или false
//Делает определённое количество проходов между комнатами
//x, y - координаты; map - массив карты
function isNeedAWall(x, y, map, walks) {
  let result = true
  if(x == 0 || y == 0 || x == (width*2) || y == (height*2)) {

  } else if ( (x % 2) != 0 && (y % 2) != 0) {
      result = false
  } else if ( (x % 2) == 0 && (y % 2) == 0) {
    let one = map[Math.floor(x/2)-1][Math.floor(y/2)-1]
    let two = map[Math.floor(x/2)][Math.floor(y/2)-1]
    let three = map[Math.floor(x/2)][Math.floor(y/2)]
    let four = map[Math.floor(x/2)-1][Math.floor(y/2)]
    if(one == two && two == three && three == four && four == one) {
      result = false
    }
  } else if ( (x % 2) == 0 && (y % 2) != 0) {
    if(map[Math.floor(x/2)][Math.floor(y/2)] == map[Math.floor(x/2)-1][Math.floor(y/2)]) {
      result = false
    } else {
        let regA = map[Math.floor(x/2)][Math.floor(y/2)]
        let regB = map[Math.floor(x/2)-1][Math.floor(y/2)]
        if(!walks.has(regA + ':' + regB)) {
            result = false
            walks.add(regA + ':' + regB)
            walks.add(regB + ':' + regA)
        }
    }
  } else if ( (x % 2) != 0 && (y % 2) == 0) {
    if(map[Math.floor(x/2)][Math.floor(y/2)] == map[Math.floor(x/2)][Math.floor(y/2)-1]) {
      result = false
    } else {
        let regA = map[Math.floor(x/2)][Math.floor(y/2)]
        let regB = map[Math.floor(x/2)][Math.floor(y/2)-1]
        if(!walks.has(regA + ':' + regB)) {
            result = false
            walks.add(regA + ':' + regB)
            walks.add(regB + ':' + regA)
        }
    }
  }
  return result
}

//Функция возвращает финальный массив карты, где 0 отмечены проходы и пустота, а 1 - отмечены стены
function getFinalMaze() {
  let finalMaze  = Array.from({length: width*2+1})
  let map = Array.from({length: width})
  for(let i = 0; i < map.length; i++) {
    map[i] = Array.from({length: height})
  }
  for(let i = 0; i<height*2+1; i++) {
      finalMaze[i] = Array.from({length: height})
  }

  let cells = []

  for(let x = 0; x < map.length; x++) {
    for(let y = 0; y < map[0].length; y++) {
      map[x][y] = 0
      cells.push([x, y])
    }
  }

  let regions = []
  regions.push(cells)

  let walks = new Set()

  let counter = 0
  while(regions.length > 0) {
      sliceMap(regions[0], counter, map, regions)
      counter = counter + 2
  }
  let coords = []
  for(let x = 0; x < (width*2+1); x++) {
      for(let y = 0; y < (height*2+1); y++) {
          coords.push([x, y])
      }
  }
  let playerCounter = 0

  while(coords.length > 0) {
      let cellNum = 0
      if(coords.length > 1) {
          cellNum = getRandom(0, coords.length)
      }
      let cell = coords[cellNum]
      if(isNeedAWall(cell[0], cell[1], map, walks)) {
        finalMaze[cell[0]][cell[1]] = 1
      } else {
        finalMaze[cell[0]][cell[1]] = 0
      }
      coords.splice(cellNum, 1)
  }
  return finalMaze
}

let getMaze = (x, y) => {
  return Maze.findOne({activeStatus: true}).then((result) => {
    if(result) {
      return result.map[x][y]
    } else {
      let maze = getFinalMaze();
      let mazeToSave = new Maze({map: [[[] ,[] ,[] ,[], []], [[], [] ,[] ,[], []], [[] ,[], maze, [], []], [[], [], [], [], []], [[], [], [], [], []]], activeStatus: true})
      return mazeToSave.save().then((result) => {
        return result.map[x][y]
      }).catch((err) => console.log('wtf err 1'))
    }
  }).catch((err) => console.log('wtf err 2'))
}

module.exports = {getMaze}
