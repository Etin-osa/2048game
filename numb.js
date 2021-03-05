
//  Get Parent Element
const gameHead = Array.from(document.querySelectorAll('.gameTile'))

// Main Board
let curTiles = []

// Free Board
let eptTile = []

// Notice Movement
let movement = 0

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
function Cajas(x, y, add, tile) {
  this.x = x,
  this.y = y,
  this.add = add
  this.tile = tile
}


//  Function store
const store = {
  locale: function (cur) {
    let node = cur.parentNode
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
    let x = parseInt(getComputedStyle(cur).left)
    let y = parseInt(getComputedStyle(cur).top)

    if (x !== 0 && y !== 0) { return [x, y] } else {
      if (x === 0) {
        x = grid.left + (col * grid.w) + (col * grid.gap)
        cur.style.left = `${x}px`
      }

      if (y === 0) {
        y = grid.top + (row * grid.h) + (row * grid.gap)
        cur.style.top = `${y}px`
      }

      return [x, y]
    }
  },

  green: function (arrs, code) {
    let col1 = [], col2 = [],
      col3 = [], col4 = [];

    let dir = ''

    if (code === keys[0] || code === keys[2]) { dir = 'y' } // Horizontal Movement
    else if (code === keys[1] || code === keys[3]) { dir = 'x' } // Vertical Movement

    for (let arr of arrs) {
      if (arr[dir] === pos1) { col1.push(arr) }
      else if (arr[dir] === pos2) { col2.push(arr) }
      else if (arr[dir] === pos3) { col3.push(arr) }
      else if (arr[dir] === pos4) { col4.push(arr) }
    }

    return [col1, col2, col3, col4]
  },

  createBox: function (arr) {
    let { row, col } = arr[rdm(arr.length)]
    let arrHead = undefined

    // To get row
    if (row === 0) { arrHead = gameHead.slice(0, 4) } 
    else if (row === 1) { arrHead = gameHead.slice(4, 8) }
    else if (row === 2) { arrHead = gameHead.slice(8, 12) }
    else if (row === 3) { arrHead = gameHead.slice(12, 16) }
    

    // To get Column
    let parent = arrHead[col]
    
    // Creating Div
    let div = document.createElement('div')
    div.classList.add('gameTile-jr')
    div.textContent = numbs[rdm(numbs.length)]

    // Append child
    parent.appendChild(div)

    // Add Colour
    div.style.background = `${this.colorB(div.textContent)}`

    // Arrange Element
    this.locale(div)
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

    if (key === keys[2] || key === keys[3]) {
      let first = Math.max(...nums)
      return nums.indexOf(first)
    } else if (key === keys[0] || key === keys[1]) {
      let first = Math.min(...nums)
      return nums.indexOf(first)
    }
  },

  details: function (arr, code) {
    // Get Dir 
    const dir = this.checkKey(code)

    // Get Inc
    const pace = this.checkDir(code)

    // Get Final
    const end = pace > 0 ? 329 : 11;

    // Get Min or Max
    let lead = arr[this.minOMax(arr, code, dir)]

    // Get length to reach end
    let length = this.numOf(pace, lead[dir], end)

    // Box Kit
    return { lead, dir, end, length, pace }
  },

  colorB: function (val) {
    if (val == '2') { return '#CA3C25' }
    else if (val == '4') { return '#F0C977' }
    else if (val == '8') { return '#99A88C' }
    else if (val == '16') { return '#2E86AB' }
    else if (val == '32') { return '#E09F3E' }
    else if (val == '64') { return '#9E2A2B' }
    else if (val == '128') { return '#D0823A' }
    else if (val == '256') { return '#791B1D' }
    else if (val == '512') { return '#BF6535' }
    else if (val == '1024') { return '#540B0E' }
    else if (val == '2048') { return '#335C67' }
  },

  outside: function (dir, fir) {
    if (dir === 'x') {
      fir['tile'].style.left = `${fir.x}px`
    } else {
      fir['tile'].style.top = `${fir.y}px`
    }
  },

  numOf: function (inc, start, end) {
    let num = 0
    if (end === 11) {
      for (var i = start; i > end; i += inc) {
        num += 1
      }
    } else {
      for (var i = start; i < end; i += inc) {
        num += 1
      }
    }

    return num
  },

  moveAlong: function (lead, dir, arr, doc) {
    let arrOfEach = []

    for (let each of arr) {
      if (each !== lead) {
        if (doc['end'] === 11) {
          if (each[dir] > (lead[dir] - doc['pace'])) {
            arrOfEach.push(each)
          }
        } else {
          if (each[dir] < (lead[dir] + doc['pace'])) {
            arrOfEach.push(each)
          }
        }
      }
    }

    return arrOfEach
  },

  checkKey: function (key) {
    if (key === keys[0] || key === keys[2]) { return 'x' }
    else if (key === keys[1] || key === keys[3]) { return 'y' }
  }
}


const action = function (doc, arr, id) {
  let { lead, dir } = doc;
  let curID = id;
  let nt = [];
  let backArr = [];

  if (doc['length'] > 0) {
    // If Lead is not at End
    // Increment Movement
    lead[dir] += doc['pace']

    // Check Borders
    if (lead[dir] > pos4) { lead[dir] = pos4 }
    if (lead[dir] < pos1) { lead[dir] = pos1 }

    // Move 
    store.outside(dir, lead)

    // Reduce Length
    doc['length'] -= 1

    // Increase Movement
    movement += 1

    // Re-call Function
    action(doc, arr, curID)
  } else {
    for (let each of arr) {
      if (each !== lead) {
        if (each[dir] === (lead[dir] - doc['pace'])) { nt.push(each) }
      }
    }

    // If the box behind is empty
    if (nt.length === 0) {
      backArr = store.moveAlong(lead, dir, arr, doc)

      // If they are boxes behind
      if (backArr.length > 0) {
        backArr.forEach(tile => {
          // Increment Movement
          tile[dir] += doc['pace']

          // Check Borders
          if (tile[dir] > pos4) { tile[dir] = pos4 }
          if (tile[dir] < pos1) { tile[dir] = pos1 }

          // Move 
          store.outside(dir, tile)
        })

        // Increase Movement
        movement += 1

        // Re-call Function
        action(doc, arr, curID)
      } else {
        let arrNom = 4
        let start = doc['end'] === 11 ? arr.length :  arrNom - arr.length
        let end = doc['end'] === 11 ? 4 : 0

        if (doc['end'] === 11) {
          for (var i = start; i < end; i++) { 
            let subGrid = {
              row: undefined,
              col: undefined,
            }

            if (dir === 'y') { 
              subGrid.col = curID 
              subGrid.row = i
            } else { 
              subGrid.row = curID 
              subGrid.col = i
            }

            eptTile.push(subGrid)
          } 
        } else {
          for (var i = start; i > end; i--) { 
            let subGrid = {
              row: undefined,
              col: undefined,
            }

            if (dir === 'y') {
              subGrid.col = curID
              subGrid.row = i - 1
            } else {
              subGrid.row = curID
              subGrid.col = i - 1
            }

            eptTile.push(subGrid)
          }
        }
      }
    } else {
      let ntNumb = parseFloat(nt[0]['tile'].textContent)
      let ldNumb = parseFloat(lead['tile'].textContent)

      if (ldNumb !== ntNumb) {
        // If Not the same
        // Change Lead
        doc['lead'] = nt[0]

        // Re-call Function
        action(doc, arr, curID)
      } else {
        if (lead['add'] === 0 && nt[0]['add'] === 0) {
          // Increment Movement
          nt[0][dir] += doc['pace']

          // Check Borders
          if (nt[0][dir] > pos4) { nt[0][dir] = pos4 }
          if (nt[0][dir] < pos1) { nt[0][dir] = pos1 }

          // Move
          store.outside(dir, nt[0])

          // Add Up
          lead['tile'].textContent = ldNumb + ntNumb

          // Add Colour
          lead['tile'].style.background = `${store.colorB(ldNumb + ntNumb)}`;

          // Remove From Array
          arr = arr.filter(each => each !== nt[0])

          // Remove NT
          nt[0]['tile'].remove()

          // Increment Add
          lead['add'] += 1

          // Increase Movement
          movement += 1

          // Re-call Function
          action(doc, arr, curID)
        } else if (nt[0]['add'] === 0) {
          // Change Lead
          doc['lead'] = nt[0]

          // Re-call Function
          action(doc, arr, curID)
        }
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

    // Empty Free Array
    eptTile = [];

    // Empty movement
    movement = 0

    //  Get objs tiles 
    let getTiles = tiles.map(tile => {
      // Get x & y of tile
      let cord = store.locale(tile)

      // New box
      let box = new Cajas(cord[0], cord[1], 0, tile)

      // Add to main Board
      return box
    })

    //  Fill rows & cols
    curTiles = store.green(getTiles, e.keyCode)

    // Movements
    curTiles.forEach((tile, ind) => {
      if (tile.length > 0) {
        // Get files
        let files = store.details(tile, e.keyCode)
  
        // Move The Boxes
        action(files, tile, ind)
      } else {
        let arrNom = 4
        for (var i = 0; i < arrNom; i++) {
          let subGrid = {
            row: undefined,
            col: undefined
          }
          let dir = store.checkKey(e.keyCode)

          if (dir === 'y') {
            subGrid.col = ind
            subGrid.row = i
          } else {
            subGrid.row = ind
            subGrid.col = i
          }

          eptTile.push(subGrid)
          eptTile.push(subGrid)
        }
      }
    })

    // Create New Boxes
    if (movement !== 0) {
      setTimeout(() => {
        store.createBox(eptTile)
      }, 500);
    }
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

    // Add Colour
    div.style.background = `${store.colorB(div.textContent)}`

    // Arrange Element
    store.locale(div)

    // Filter Parent
    gHead = gHead.filter((cur, ind) => ind !== rand)
  }
}


function rdm(lgth) {
  return Math.floor(Math.random() * lgth)
}


// Begin Game
start(2)