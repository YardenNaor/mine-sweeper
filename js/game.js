'use strict'



const MINE = '💣'
const FLAG = '🏴‍☠️'


var gBoard
var gEmptyCellsIdx
var gMinedCellsIdx
var gShownMines
var gIntervalId

var gLevel = {
    SIZE: 4,
    MINES: 2
}


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    flagsCount: 0,
    livesCount: 3,
    secsPassed: 0,
    steps: [],
    firstClick: false
}



function onGameInit() {
    if (gIntervalId) clearInterval(gIntervalId)
    gIntervalId = null
    gGame.markedCount = 0
    gGame.livesCount = 3
    gGame.shownCount = 0
    gShownMines = 0
    gGame.steps = []
    gEmptyCellsIdx = []
    gMinedCellsIdx = []
    gGame.firstClick = false
    gGame.isOn = true
    gGame.flagsCount = gLevel.MINES,
        gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE)
    findEmptyCells(gBoard)
    renderLife()
    renderTimeZero()
    renderBoard(gBoard)
    renderSmily('normal')
    renderFlagsCount()
}

function createDifficultyLevel(level) {
    switch (level) {
        case 1:
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break;
        case 2:
            gLevel.SIZE = 8
            gLevel.MINES = 14

            break;
        case 3:
            gLevel.SIZE = 12
            gLevel.MINES = 32

    }
    // console.log('g:', gBoard)
    clearInterval(gIntervalId)
    onGameInit()
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
    return mat
}

function findEmptyCells(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown) gEmptyCellsIdx.push({ i, j })
        }
    }
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            var img = ''
            // if (cell.isShown) {
            //     if (cell.isMine) img = MINE
            //     else if (cell.minesAroundCount) img = cell.minesAroundCount
            // } else {
            //     if (cell.isMarked) img = FLAG
            // }
            strHTML += `<td class="cell-${i}-${j}" onclick="onCellClicked(this,${i}, ${j})" oncontextmenu= "cellMarked(this,${i},${j})">${img}</td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('tbody')
    elBoard.innerHTML = strHTML
}

function renderSmily(value) {
    const elSmily = document.querySelector('.smily')
    switch (value) {
        case 'normal':
            elSmily.innerText = '🐵'
            break
        case 'lose':
            elSmily.innerText = '🙊'
            break
        case 'win':
            elSmily.innerText = '🤩'
    }

}

function renderFlagsCount() {

    const elCount = document.querySelector('.flags-count')
    console.log('flags:', elCount)
    elCount.innerText = `🏴‍☠️${gGame.flagsCount}`
}

function onCellClicked(elCell, i, j) {

    const cell = gBoard[i][j]
    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (!cell.isShown) {
        gGame.steps.push({ i, j })
        cell.isShown = true
        if (!gMinedCellsIdx.length) {
            setMines(i, j)
            setMinesNegsCount()
            if (!gIntervalId) startTimer()
        }
        if (cell.isMine) {
            gShownMines++
            elCell.style.backgroundColor = '#d95151'
            elCell.innerText = MINE
            takeLife()
        } else if (cell.minesAroundCount) {
            gGame.shownCount++
            elCell.innerText = cell.minesAroundCount
            elCell.style.backgroundColor = 'white'
        } else {
            gGame.shownCount++
            expandShown(gBoard, i, j)
        }
    }
    checkGameOver()
}


function setMines(excludedI, excludedJ) {
    var excludedCellIdx
    for (var i = 0; i < gEmptyCellsIdx.length; i++) {
        if (gEmptyCellsIdx[i].i === excludedI && gEmptyCellsIdx[i].j === excludedJ) {
            excludedCellIdx = gEmptyCellsIdx[i]
            gEmptyCellsIdx.splice(i, 1)
        }
    }
    console.log(' gLevel.MINES:', gLevel.MINES)
    for (var i = 0; i < gLevel.MINES; i++) {
        const randomCellIdx = drawNum(gEmptyCellsIdx)
        gBoard[randomCellIdx.i][randomCellIdx.j].isMine = true
        gMinedCellsIdx.push(randomCellIdx)

    }
    console.log('mined:', gMinedCellsIdx)
    if (excludedCellIdx) gEmptyCellsIdx.push(excludedCellIdx)
}

function setMinesNegsCount() {
    for (var i = 0; i < gEmptyCellsIdx.length; i++) {
        const cellPosI = gEmptyCellsIdx[i].i
        const cellPosJ = gEmptyCellsIdx[i].j
        gBoard[cellPosI][cellPosJ].minesAroundCount = countMinedNeighbors(cellPosI, cellPosJ, gBoard)
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

function takeLife() {
    gGame.livesCount--

    checkGameOver()
    renderLife()
}

function renderLife() {
    const elLife = document.querySelector('.life')
    // console.log('div:', elLife)
    elLife.innerHTML = `You have ${gGame.livesCount} lifes`
}

function checkGameOver() {
    if (!gGame.livesCount) lose()
    if (gGame.shownCount === gEmptyCellsIdx.length && (gGame.markedCount + gShownMines) === gMinedCellsIdx.length) victory()
}

function lose() {
    gGame.isOn = false
    clearInterval(gIntervalId)
    for (var i = 0; i < gMinedCellsIdx.length; i++) {
        const cellI = gMinedCellsIdx[i].i
        const cellJ = gMinedCellsIdx[i].j
        // if ((cellI !== clickedCellI) && (cellJ !== clickedCellJ)) {
        gBoard[cellI][cellJ].isShown = true
        const elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
        elCell.innerText = MINE
        elCell.style.backgroundColor = 'gray'
        // }
    }
    renderSmily('lose')
}

function victory() {
    gGame.isOn = false
    renderSmily('win')
    clearInterval(gIntervalId)
}


function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return
    gGame.steps.push({ i, j })
    if (gGame.steps.length === 1) {
        if (!gIntervalId) startTimer()
    }
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked

    if (gBoard[i][j].isMarked) {
        if (gGame.flagsCount) {
            gGame.markedCount++
            gGame.flagsCount--
        }
    } else if (gGame.flagsCount <= gLevel.MINES) {
        gGame.markedCount--
        gGame.flagsCount++
    }
    renderFlagsCount()
    elCell.innerText = (gBoard[i][j].isMarked && gGame.flagsCount) ? FLAG : null
    checkGameOver()
}


function expandShown(board, clickedCellI, clickedCellJ) {

    for (var i = 0; i < gEmptyCellsIdx.length; i++) {
        const emptyCellI = gEmptyCellsIdx[i].i
        const emptyCellJ = gEmptyCellsIdx[i].j

        if ((emptyCellI >= clickedCellI - 1 && emptyCellI <= clickedCellI + 1) && (emptyCellJ >= clickedCellJ - 1 && emptyCellJ <= clickedCellJ + 1)) {
            const cell = board[emptyCellI][emptyCellJ]
            if (!cell.isMarked) {
                if (!cell.isShown) gGame.shownCount++
                cell.isShown = true
                const elCell = document.querySelector(`.cell-${emptyCellI}-${emptyCellJ}`)
                if (cell.minesAroundCount) elCell.innerText = cell.minesAroundCount

                elCell.style.backgroundColor = 'white'

            }

        }
    }
}

