
//  Get Parent Element
const gameHead = Array.from(document.querySelectorAll('.gameTile'))

// Main Board
let curTiles = []

// List all keys in keypress
const keys = [37, 38, 39, 40]

// Box positions
let pos1 = 11, pos2 = 117,
  pos3 = 223, pos4 = 329


// Required Entities
const grid = {
  top: 11,
  left: 11,
  h: 90,
  w: 90,
  gap: 16
}


//  Box Object
function Cajas(x, y, tile) {
  this.x = x,
    this.y = y,
    this.tile = tile
}


//  Function store
const store = {
  objTiles: function (arrs) {
    let cur = []

    for (let arr of arrs) {
      // Get x & y of tile
      let cord = this.locale(arr)

      // New box
      let box = new Cajas(cord[0], cord[1], arr)

      // Add to main Board
      cur.push(box)
    }

    return cur
  },

  locale: function (arr) {
    let node = arr.parentNode
    let nodeNumb = undefined
    let row = undefined
    let col = undefined

    //  Get parent index
    gameHead.forEach((tile, ind) => {
      if (tile === node) nodeNumb = ind
    })


    //  Get row
    if (nodeNumb >= 0 && nodeNumb <= 3) {
      row = 0
      col = nodeNumb - 0
    } else if (nodeNumb >= 4 && nodeNumb <= 7) {
      row = 1
      col = nodeNumb - 4
    } else if (nodeNumb >= 8 && nodeNumb <= 11) {
      row = 2
      col = nodeNumb - 8
    } else if (nodeNumb >= 12 && nodeNumb <= 15) {
      row = 3
      col = nodeNumb - 12
    }

    // Check for x & y
    let x = parseInt(getComputedStyle(arr).left)
    let y = parseInt(getComputedStyle(arr).top)

    if (x !== 0 && y !== 0) { return [x, y] } else {
      if (x === 0) {
        x = grid.left + (col * grid.w) + (col * grid.gap)
      }

      if (y === 0) {
        y = grid.top + (row * grid.h) + (row * grid.gap)
      }

      return [x, y]
    }
  },

  green: function (arrs, code) {
    let col1 = [], col2 = [],
      col3 = [], col4 = [];


    //  For Horizontal Movement
    if (code === keys[0] || code === keys[2]) {
      for (let arr of arrs) {
        if (arr.y === pos1) { col1.push(arr) }
        else if (arr.y === pos2) { col2.push(arr) }
        else if (arr.y === pos3) { col3.push(arr) }
        else if (arr.y === pos4) { col4.push(arr) }
      }
    } else if (code === keys[1] || code === keys[3]) {
      //  For Vertical Movement  
      for (let arr of arrs) {
        if (arr.x === pos1) { col1.push(arr) }
        else if (arr.x === pos2) { col2.push(arr) }
        else if (arr.x === pos3) { col3.push(arr) }
        else if (arr.x === pos4) { col4.push(arr) }
      }
    }

    return [col1, col2, col3, col4]
  },

  checkDir: function (cd) {
    let mv = 0

    if (cd === keys[0] || cd === keys[1]) {
      mv = -106
    } else if (cd === keys[2] || cd === keys[3]) {
      mv = 106
    }

    return mv
  },

  minOMax: function (arr, key, dir) {
    let nums = []

    for (var i = 0; i < arr.length; i++) {
      let obj = arr[i]
      nums.push(obj[dir])
    }

    if (key === keys[0] || key === keys[1]) {
      let first = Math.max(...nums)
      return nums.indexOf(first)
    } else if (key === keys[2] || key === keys[3]) {
      let first = Math.min(...nums)
      return nums.indexOf(first)
    }
  },

  action: function (arrs, code) {
    //let move = this.checkDir(code)
    //let end = move > 0 ? 329 : 11;

    if (code === keys[0] || code === keys[2]) {
      for (let arr of arrs) {
        let lead = arr[this.minOMax(arr, code, 'x')]
        //let length = this.numOf(move, lead.x, end)
        console.log(lead)
      }
    } else if (code === keys[1] || code === keys[3]) {
      for (let arr of arrs) {
        let lead = arr[this.minOMax(arr, code, 'y')]
        //let length = this.numOf(move, lead.y, end)
        console.log(lead)
      }
    }
  }
}


// selection box
let numbs = [2, 2, 2, 2, 2, 2, 4, 2, 2, 2]


//  Listen for Keypress Eevent
document.addEventListener('keydown', (e) => {
  if (keys.indexOf(e.keyCode) !== -1) {

    //  Game Tiles
    let tiles = Array.from(document.querySelectorAll('.gameTile-jr'))

    //  Get objs tiles 
    let getTiles = store.objTiles(tiles)

    //  Fill rows & cols
    curTiles = store.green(getTiles, e.keyCode)

    // Movements
    store.action(curTiles, e.keyCode)
  }
})


//  Function to begin Game
function start(numOf) {
  let gHead = Array.from(document.querySelectorAll('.gameTile'))

  for (var i = 0; i < numOf; i++) {
    let div = document.createElement('div')
    div.classList.add('gameTile-jr')
    div.textContent = numbs[rdm(numbs.length)]

    // Get Parent
    let rand = rdm(gHead.length)

    // Append child
    gHead[rand].appendChild(div)

    // Filter Parent
    gHead = gHead.filter((cur, ind) => ind !== rand)
  }
}


function rdm(lgth) {
  return Math.floor(Math.random() * lgth)
}


// Begin Game
start(8)