'use strict'


// But as a guideline, we suggest having the following functions (it is
//     ok to have more functions as needed).
//    
//    
//   
//     renderBoard(board) Render the board as a <table>
//     to the page
//     cellClicked(elCell, i, j) Called when a cell (td) is
//     clicked
//     cellMarked(elCell) Called on right click to mark a
//     cell (suspected to be a mine)
//     Search the web (and
//     implement) how to hide the
//     context menu on right click
//     checkGameOver() Game ends when all mines are
//     marked, and all the other cells
//     are shown
//     expandShown(board, elCell,
//     i, j)
//     When user clicks a cell with no
//     mines around, we need to open
//     not only that cell, but also its
//     neighbors.
//     NOTE: start with a basic
//     implementation that only opens
//     the non-mine 1st degree
//     neighbors
//     BONUS: if you have the time
//     later, try to work more like the
//     real algorithm (see description
//     at the Bonuses section below)
//     Here are the global variables you might be using:
//     gBoard – A Matrix
//     containing cell objects:
//     Each cell: {
//      minesAroundCount: 4,
//      isShown: false,
//      isMine: false,
//      isMarked: true

//     }
//     The model
//     gLevel = {
//      SIZE: 4,
//      MINES: 2
//     };
//     This is an object by which the
//     board size is set (in this case:
//     4x4 board and how many mines
//     to put)
//     gGame = {
//      isOn: false,
//      shownCount: 0,
//      markedCount: 0,
//      secsPassed: 0
//     }
//     This is an object in which you
//     can keep and update the
//     current game state:
//     isOn: Boolean, when true we
//     let the user play
//     shownCount: How many cells
//     are shown
//     markedCount: How many cells
//     are marked (with a flag)
//     secsPassed: How many seconds
//     passed 


// initGame() This is called when page loads

const MINE = '💣'
const FLAG = '🏴‍☠️'


var gBoard

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 5
}


function onGameInit() {
    gBoard = buildBoard(4, 4)
    // console.log('g:', gBoard)
    setMines()
    renderBoard(gBoard)
}


// buildBoard() Builds the board
//     Set mines at random locations
//     Call setMinesNegsCount()
//     Return the created board

// 1. Create a 4x4 gBoard Matrix containing Objects. Place 2 mines
// manually when each cell’s isShown set to true.
// 2. Present the mines using renderBoard() function.

function buildBoard(ROWS, COLS) {
    const mat = []

    for (var i = 0; i < ROWS; i++) {
        mat[i] = []
        for (var j = 0; j < COLS; j++) {
            const cell = {
                minesAroundCount: 4,
                isShown: true,
                isMine: false,
                isMarked: false
            }

            mat[i].push(cell)
        }
    }
    // setMinesNegsCount()
    // console.log('mat:', mat)
    return mat
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            var img = ''
            if (cell.isShown) {
                if (cell.isMine) img = MINE
            } else {
                if (cell.isMarked) img = FLAG
            }
             strHTML += `<td data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})">${img}</td>`
        }
       
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('tbody')
    elBoard.innerHTML = strHTML

}


function setMines() {
    for (var i = 0; i <= gLevel.MINES; i++) {
        const randomCell = gBoard[getRandomInt(0, gBoard.length)][getRandomInt(0, gBoard[0].length)]
        randomCell.isMine = true
    }
    // gBoard[2][0].isMine = true
    // gBoard[0][1].isMine = true
    // gBoard[2][0].isShown = true
    // gBoard[0][1].isShown = true
    console.log('g:', gBoard)
}



// setMinesNegsCount(board) Count mines around each cell
//     and set the cell's
//     minesAroundCount.


