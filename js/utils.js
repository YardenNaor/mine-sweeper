'use strict'




// function renderCell(location, value) {
//     const cellSelector = '.' + getClassName(location) // cell-i-j
//     const elCell = document.querySelector(cellSelector)
//     elCell.innerHTML = value

// }


// function getClassName(location) {
//     const cellClass = 'cell-' + location.i + '-' + location.j
//     return cellClass
// }




function startTimer() {
    gStartTime = Date.now()
    gInterval = setInterval(() => {
        const seconds = (Date.now() - gStartTime) / 1000
        var elH2 = document.querySelector('.time')
        elH2.innerText = seconds.toFixed(3)
    }, 1);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawNum(nums) {
    var randIdx = getRandomInt(0, nums.length)
    var num = nums[randIdx]
    nums.splice(randIdx, 1)
    return num
}
