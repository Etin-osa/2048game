//  Get Parent Element
const gameHead = Array.from(document.querySelectorAll('.gameTile'))

// Get Dom for Moves
const moves = document.querySelector('#move')

// Get end Game
const final = document.querySelector('.end-game')

// Main Board
let curTiles = []

// Free Board
let eptTile = []

// Touch Dir
let touchDir = []

// selection box
let numbs = [2, 2, 2, 2, 2, 2, 4, 2, 2, 2]

// Notice Movement
let movement = 0

// Notice count
let count = 0

// Return Val
let retCount = 0

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
  this.add = add,
  this.tile = tile
}


// Create Empty Boxes
function eptLoop() {
  for (var i = 0; i < 4; i++) {
    let eptGrid = {
      row: count,
      col: i,
    }

    eptTile.push(eptGrid)
  }

  if (count < 3) {
    count++
    eptLoop()
  }
}


// Get Empty Boxes
eptLoop()


//  Function store
const store = {
  eachObj: function (tiles) {
    let evry = []

    for (var each of tiles) {
      // Get x & y of tile
      let cord = this.locale(each)

      // New box
      let box = new Cajas(cord[0], cord[1], 0, each)

      // Add to evry
      evry.push(box)
    }

    return evry
  },

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
    let colors = [
      { value: '2', color: '#9538ec' }, { value: '4', color: '#fb5607' },
      { value: '8', color: '#ef233c' }, { value: '16', color: '#023e8a' },
      { value: '32', color: '#ffba08' }, { value: '64', color: '#1b4332' },
      { value: '128', color: '#fdca40' }, { value: '256', color: '#1b263b' },
      { value: '512', color: '#bf0603' }, { value: '1024', color: '#3a0ca3' },
      { value: '2048', color: '#20bf55' }, { value: '4096', color: '#f17300' },
      { value: '8192', color: '#822faf' }, { value: '16384', color: '#2d3142' },
    ]

    for (var i = 0; i < colors.length; i++) {
      if (val == colors[i].value) { return colors[i].color }
    }
  },

  remAnime: function() {
    let gameJr = Array.from(document.querySelectorAll('.gameTile-jr'))

    // Remove all Anime
    gameJr.forEach(game => game.classList.remove('addAnime'))
  },

  moveT: function (dir, fir) {
    // Add transition to movement
    fir['tile'].style.transitionDuration = '.2s'

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

  checkEnd: function (post, dir) {
    let end = 0

    for (var each of post) {
      let arr = each.map(obj => obj['tile'].textContent)
      let piece = each.map(obj => obj)
      let actual = 0;

      for (var i = 0; i < arr.length; i++) {
        let cur = arr[actual]

        if (i !== actual) {
          if (cur === arr[i]) {
            let curDir = piece[actual][dir]
            let ntDir = piece[i][dir]

            // Get Difference in position
            let diff = curDir - ntDir

            if (diff === 106 || diff === -106) {
              break;
            }
          }
        }

        // Check for reLoop
        if (i === 3 && actual < 3) { i = 0; actual += 1 }

        // Check for endGame 
        if (i === 3 && actual === 3) {
          end += 1
        }
      }
    }

    return end
  },

  countMoves: function () {
    let dir = parseFloat(moves.textContent)
    moves.textContent = dir + 1
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
    store.moveT(dir, lead)

    // Reduce Length
    doc['length'] -= 1

    // Increase Movement
    movement += 1

    // Re-call Function
    action(doc, arr, curID)
  } else {
    for (let each of arr) {
      if (each !== lead) {
        
        // If any block is right next to the lead
        if (each[dir] === (lead[dir] - doc['pace'])) { nt.push(each) }

        // Blocks behind the lead
        if (doc['end'] === 11) {
          if (each[dir] > (lead[dir] - doc['pace'])) {
            backArr.push(each)
          }
        } else {
          if (each[dir] < (lead[dir] + doc['pace'])) {
            backArr.push(each)
          }
        }
      }
    }

    // If the box behind is empty
    if (nt.length === 0) {
      // If they are boxes behind
      if (backArr.length > 0) {
        backArr.forEach(tile => {
          // Increment Movement
          tile[dir] += doc['pace']

          // Check Borders
          if (tile[dir] > pos4) { tile[dir] = pos4 }
          if (tile[dir] < pos1) { tile[dir] = pos1 }

          // Move 
          store.moveT(dir, tile)
        })

        // Increase Movement
        movement += 1

        // Re-call Function
        action(doc, arr, curID)
      } else {
        // Getting the empty boxes

        let arrNom = 4
        let start = doc['end'] === 11 ? arr.length : arrNom - arr.length
        let end = doc['end'] === 11 ? 4 : 0

        if (doc['end'] === 11) {
          for (var i = start; i < end; i++) {
            let eptGrid = { row: undefined, col: undefined, }

            if (dir === 'y') { eptGrid.col = curID; eptGrid.row = i } 
              else { eptGrid.row = curID; eptGrid.col = i }

            eptTile.push(eptGrid)
          }
        } else {
          for (var i = start; i > end; i--) {
            let eptGrid = { row: undefined, col: undefined, }

            if (dir === 'y') { eptGrid.col = curID; eptGrid.row = i - 1 } 
              else { eptGrid.row = curID; eptGrid.col = i - 1 }

            eptTile.push(eptGrid)
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
          store.moveT(dir, nt[0])

          // Add Up
          lead['tile'].textContent = ldNumb + ntNumb

          // Reduce size of element if equal or greater than 16384
          let tileCount = parseFloat(lead['tile'].textContent)

          if (tileCount >= 16384) { 
            lead['tile'].style.fontSize = '25px'
          }

          // Add Colour
          lead['tile'].style.background = `${store.colorB(ldNumb + ntNumb)}`;

          // Add Animation
          lead['tile'].classList.add('addAnime')

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


//  Listen for Keypress Eevent
document.addEventListener('keydown', (e) => {
  // Prevent Multiple keypress
  retCount += 1
  
  if (keys.indexOf(e.keyCode) !== -1) {
    if (retCount > 1) { return }

    // Main Action
    mainAction(e.keyCode)    
  }
})

// Listen for Touch Start
document.addEventListener('touchstart', e => {
  var srte = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent
  
  var srtouch = srte.touches[0] || srte.changedTouches[0]
  touchDir.push({ dirX: srtouch.pageX, dirY: srtouch.pageY })
})

// Listen for Touch End
document.addEventListener('touchend', e => {
  var endE = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent

  var entouch = endE.touches[0] || endE.changedTouches[0]
  touchDir.push({ dirX: entouch.pageX, dirY: entouch.pageY })

  let x = parseInt(touchDir[1].dirX) - parseInt(touchDir[0].dirX)
  let y = parseInt(touchDir[1].dirY) - parseInt(touchDir[0].dirY)


  if (x > 0 && y > 0) {
    x > y ? mainAction(keys[2]) : mainAction(keys[3])

  } else if (x < 0 && y < 0) {
    x = parseInt(touchDir[0].dirX) - parseInt(touchDir[1].dirX)
    y = parseInt(touchDir[0].dirY) - parseInt(touchDir[1].dirY)

    x > y ? mainAction(keys[0]) : mainAction(keys[1])
  } else {
    if (x < 0) {
      x = parseInt(touchDir[0].dirX) - parseInt(touchDir[1].dirX)
      x > y ? mainAction(keys[0]) : mainAction(keys[3])
    }

    if (y < 0) {
      y = parseInt(touchDir[0].dirY) - parseInt(touchDir[1].dirY)
      x > y ? mainAction(keys[2]) : mainAction(keys[1])
    }
  }

  touchDir = []
})

// Main Action Function
function mainAction(e) {
  //  Game Tiles
  let tiles = Array.from(document.querySelectorAll('.gameTile-jr'))

  // Empty movement
  movement = 0

  // Empty Free Array
  eptTile = [];

  //Get objs tiles 
  let getTiles = store.eachObj(tiles)

  //  Fill rows & cols
  curTiles = store.green(getTiles, e)

  // Movements
  curTiles.forEach((tile, ind) => {
    if (tile.length > 0) {
      // Get files
      let files = store.details(tile, e)

      // Move The Boxes
      action(files, tile, ind)

      // Remove Animation Class
      setTimeout(() => {
        store.remAnime()
      }, 500);
    } else {
      let arrNom = 4
      for (var i = 0; i < arrNom; i++) {
        let eptGrid = {
          row: undefined,
          col: undefined
        }
        let dir = store.checkKey(e)

        if (dir === 'y') {
          eptGrid.col = ind
          eptGrid.row = i
        } else {
          eptGrid.row = ind
          eptGrid.col = i
        }

        eptTile.push(eptGrid)
        eptTile.push(eptGrid)
      }
    }
  })

  // Create New Boxes
  if (movement !== 0) {
    setTimeout(() => {
      createBox(eptTile, 1, (divs) => {
        for (let each of divs) {
          each.style.transform = 'scale(1)'
        }
      })

      // Rect
      retCount = 0

      // Check if there can't be any Move
      endGame()
    }, 500);

    // Count Moves
    store.countMoves()
  } else { retCount = 0 }
}


//  Function to begin Game
function createBox (arr, num, callback) {
  let divList = []

  for ( var i = 0; i < num; i++) {
    let obj = arr[rdm(arr.length)]
    let { row, col } = obj;
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
    div.style.background = `${store.colorB(div.textContent)}`

    // Arrange Element
    store.locale(div)

    // Add to array
    divList.push(div)

    // Remove the obj from the eptTile
    arr = arr.filter(each => each !== obj)
  }

  callback(divList)
}


// Function to Check for EndGame
function endGame() {
  const tiles = Array.from(document.querySelectorAll('.gameTile-jr'))

  // Check if all boxes are filled
  if (tiles.length === 16) {
    let getTiles = store.eachObj(tiles)

    // Get vertical & horizontal positions
    let vert = store.green(getTiles, keys[1])
    let hont = store.green(getTiles, keys[0])

    // Loop Vertically & Horizontally 
    let endV = store.checkEnd(vert, 'y')
    let endH = store.checkEnd(hont, 'x')

    // Check end 
    if (endV === 4 && endH === 4) { 
      final.style.transition = 'opacity .3s'
      final.style.opacity = '1'
    }
  }
}

// Random Numb Function
function rdm(lgth) {
  return Math.floor(Math.random() * lgth)
}


// Start Game
createBox(eptTile, 2, (divs) => {
  for (let each of divs) {
    each.style.transform = 'scale(1)'
  }
})