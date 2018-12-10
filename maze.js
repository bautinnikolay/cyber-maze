let width = 100
let height = 100

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let map = Array.from({length: width})
for(let i = 0; i < map.length; i++) {
	map[i] = Array.from({length: height})
}

for(let x = 0; x < map.length; x++) {
	for(let y = 0; y < map[0].length; y++) {
		map[x][y] = 0
	}
}

let a = [getRandom(0, width), getRandom(0, height)]
let b = [getRandom(0, width), getRandom(0, height)]

map[a[0]][a[1]] = 1
map[b[0]][b[1]] = 2

let sum = [a, b]

function getOne(arr) {
    while(arr.length > 0) {
        let cell = 0
        if(arr.length > 1) {
            cell = getRandom(0, arr.length)
        }
        for(let x = -1; x < 2; x++) {
            for(let y = -1; y < 2; y++) {
                if(arr[cell][0]+x >= 0 && arr[cell][0]+x < map.length && arr[cell][1]+y >= 0 && arr[cell][1]+y < map[0].length) {
                    if(map[arr[cell][0]+x][arr[cell][1]+y] == 0) {
                        map[arr[cell][0]+x][arr[cell][1]+y] = map[arr[cell][0]][arr[cell][1]]
                        sum.push([arr[cell][0]+x, arr[cell][1]+y])
                    }
                }
            }
        }
        arr.splice(cell, 1)
    }
}

function isNeedAWall(x, y) {
  let result = true
  if( x % 2 == 0 && y % 2 == 0) {
    if(map[x/2-1][y/2-1] == map[x/2][y/2-1] && map[x/2][y/2-1] == map[x/2][y/2] && map[x/2][y/2] == map[x/2-1][y/2] && map[x/2-1][y/2] == map[x/2-1][x/2-1]) {
      result = false
    }
  } else if (x % 2 == 0 && y % 2 != 0) {
    if(map[x/2][y/2] == map[x/2-1][y/2]) {
      result = false
    }
  } else if (x % 2 != 0 && y % 2 == 0) {
    if(map[x/2][y/2] == map[x/2][y/2-1]) {
      result = false
    }
  }
  return result
}

getOne(sum)
console.log(map)