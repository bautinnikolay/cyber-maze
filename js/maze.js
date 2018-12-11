let width = 50
let height = 50

let deathLimit = 3
let birthLimit = 3
let numberOfSteps = 2

let chance = 0.45

function initialiseMap() {
	let map = Array.from({length: width})
	for(let x = 0; x < width; x++) {
		map[x] = Array.from({length: height})
		for(let y = 0; y < height; y++) {
			if(Math.random() > chance) {
				map[x][y] = true
			} else {
				map[x][y] = false
			}
		}
	}
	return map
}

function countAliveNeighbours(map, x, y) {
	let count = 0
	for(let i = -1; i < 2; i++) {
		for(let j = -1; j < 2; j++) {
			let neighbourX  = x + i
			let neighbourY = y + i
			if (i != 0 && j != 0) {
				if(neighbourX < 0 || neighbourY < 0 || neighbourX >= map.length || neighbourY >= map[0].length) {
					count += 1
				} else {
					if(map[neighbourX][neighbourY]) {
						count += 1
					}
				}
			}
		}
	}
	return count
}

function doSimulationStep(oldMap) {
	let newMap = Array.from({length: oldMap.length})
	for(let i = 0; i < newMap.length; i++) {
		newMap[i] = Array.from({length: oldMap[0].length})
	}
	for(let x = 0; x < oldMap.length; x++) {
		for(let y = 0; y < oldMap[0].length; y++) {
			let neighboursCount = countAliveNeighbours(oldMap, x, y)
			if(oldMap[x][y]) {
				if(neighboursCount < deathLimit) {
					newMap[x][y] = false;
				} else {
					newMap[x][y] = true;
				}
			} else {
				if(neighboursCount > birthLimit) {
					newMap[x][y] = true
				} else {
					newMap[x][y] = false
				}
			}
		}
	}
	return newMap
}

function generateMap() {
	map = initialiseMap()
	for(let i = 0; i < numberOfSteps; i++) {
		map = doSimulationStep(map)
	}
	return map
}

