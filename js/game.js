'use strict'



const MINE = '💣'
const FLAG = '🏴‍☠️'


var gBoard
var gEmptyCellsIdx

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    livesCount: 3,
    secsPassed: 0,
    steps: []
}

var gLevel = {
    SIZE: 4,
    MINES: 5
}


function onGameInit() {
    gGame.livesCount = 3
    gGame.isOn = true
    gGame.steps = []
    gEmptyCellsIdx = []
    gBoard = buildBoard(4, 4)
    renderLife()
    findEmptyCells(gBoard)
    renderBoard(gBoard)
}


// 1. Create a 4x4 gBoard Matrix containing Objects. Place 2 mines
// manually when each cell’s isShown set to true.
// 2. Present the mines using renderBoard() function.

function buildBoard(ROWS, COLS) {
    const mat = []

    for (var i = 0; i < ROWS; i++) {
        mat[i] = []
        for (var j = 0; j < COLS; j++) {
            const cell = {
                minesAroundCount: null,
                isShown: false,
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
                else if (cell.minesAroundCount) img = cell.minesAroundCount
            } else {
                if (cell.isMarked) img = FLAG
            }
            strHTML += `<td class="cell-${i}-${j}" onclick="onCellClicked(this,${i}, ${j})" onmouseup="cellMarked(this, i, j)">${img}</td>`
        }

        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('tbody')
    elBoard.innerHTML = strHTML

}


function setMines() {
    console.log('empty:', gEmptyCellsIdx)
    for (var i = 0; i < gLevel.MINES; i++) {
        // const randomCell = gBoard[getRandomInt(0, gBoard.length)][getRandomInt(0, gBoard[0].length)]
        const randomCellIdx = drawNum(gEmptyCellsIdx)
        // console.log('cell:', randomCell)
        gBoard[randomCellIdx.i][randomCellIdx.j].isMine = true
    }
    console.log('after drawing:', gEmptyCellsIdx)
    // gBoard[2][0].isMine = true
    // gBoard[0][1].isMine = true
    // gBoard[2][0].isShown = true
    // gBoard[0][1].isShown = true
    // console.log('g:', gBoard)

}



// setMinesNegsCount(board) Count mines around each cell
//     and set the cell's
//     minesAroundCount.


function findEmptyCells(board) {
    // console.log('g:',gBoard)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown) gEmptyCellsIdx.push({ i, j })
            // console.log('empty:', gEmptyCellsIdx)

        }
    }
    // console.log('empty at find:',emptyCellsIdx)
}

// Step2 – counting neighbors:
// 1. Create setMinesNegsCount() and store the numbers
// (isShown is still true)
// 2. Present the board with the neighbor count and the mines
// using renderBoard() function.
// 3. Have a console.log presenting the board content – to help
// you with debugging

function setMinesNegsCount() {
    // console.log('empty:', gEmptyCells)
    for (var i = 0; i < gEmptyCellsIdx.length; i++) {
        const cellPosI = gEmptyCellsIdx[i].i
        const cellPosJ = gEmptyCellsIdx[i].j
        gBoard[cellPosI][cellPosJ].minesAroundCount = countMinedNeighbors(cellPosI, cellPosJ, gBoard)
        // console.log('g:', gBoard)
    }
}

function countMinedNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue

            if (mat[i][j].isMine) neighborsCount++

        }
    }
    return neighborsCount
}

// Step3 – click to reveal:
// 1. When clicking a cell, call the cellClicked() function.
// 2. Make the default “isShown” to be “false”
// 3. Implement that clicking a cell with “number” reveals the
// // number of this cell
// Make sure the first clicked cell is never a mine (like in the real
//     game)
//     HINT: place the mines and count the neighbors only on first
//     click.

function onCellClicked(elCell, i, j) {
    var img = ''
    const cell = gBoard[i][j]
    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (!cell.isShown) {
        gGame.steps.push({ i, j })
        cell.isShown = true
        gGame.shownCount++
        // console.log('shown:', gGame.shownCount)
    }
    if (gGame.steps.length === 1) {
        setMines()
        setMinesNegsCount()
    }

    if (cell.isMine) {
        img = MINE
        takeLife()
    }
    else if (cell.minesAroundCount) img = cell.minesAroundCount
    elCell.innerText = img

}

// Add support for “LIVES” -
// The user has 3 LIVES:
// When a MINE is clicked, there is an indication to the user that
// he clicked a mine. The LIVES counter decreases. The user can
// continue playing .

function takeLife() {
    gGame.livesCount--
    if (!gGame.livesCount) gameOver()
    renderLife()
}

function renderLife() {
    const elLife = document.querySelector('.life')
    // console.log('div:', elLife)
    elLife.innerHTML = `You have ${gGame.livesCount} lifes`
}


function gameOver() {
    gGame.isOn = false
    const elbtn = document.querySelector('.smily')
    elbtn.innerHTML = '🙊'
}


// Add smiley (feel free to switch icons \ images):
// ● Normal 😃
// ● Sad & Dead – LOSE 🤯 (stepped on a mine)
// ● Sunglasses – WIN 😎
// ● Clicking the smiley should reset the game

function cellMarked(elCell, i, j) {

   elCell.addEventListener('contextmenu', (event) => {
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
        elCell.innerHTML = FLAG
    })
}