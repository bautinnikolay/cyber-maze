let width = 100
let height = 100

let limit = 4

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let map = Array.from({length: width})
for(let i = 0; i < map.length; i++) {
	map[i] = Array.from({length: height})
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

function sliceMap(arr) {
  let cellsA = []
  let cellsB = []
  let growBox = []

  let firstCell = getRandom(0, arr.length)
  let secondCell = getRandom(0, arr.length)

  let a = arr[firstCell]
  let freeCell = map[a[0]][a[1]]
  map[a[0]][a[1]] = map[a[0]][a[1]] + 2
  cellsA.push(a)
  growBox.push(a)

  let b = arr[secondCell]
  map[b[0]][b[1]] = map[b[0]][b[1]] + 3
  cellsB.push(b)
  growBox.push(b)

  arr.splice(firstCell, 1)
  arr.splice(secondCell, 1)

  if(arr.length > limit) {
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
                        if(map[growBox[cell][0]][growBox[cell][1]] < freeCell+3) {
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
    if(cellsA.length > 0) {
        regions.push(cellsA)
    }
    if(cellsB.lenght > 0) {
      regions.push(cellsB)
    }
    regions.shift()
  } else {
    regions.shift()
  }
}

while(regions.length > 0) {
  sliceMap(regions[0])
}
console.log(3 % 2)
