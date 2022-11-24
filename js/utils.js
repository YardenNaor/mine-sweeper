'use strict'








function startTimer() {
    const startTime = Date.now()
    gIntervalId = setInterval(() => {
        const seconds = (Date.now() - startTime) / 1000
        gGame.secsPassed=seconds
        var elH2 = document.querySelector('.time')
        elH2.innerText = seconds.toFixed(2)
    }, 1);
}

function renderTimeZero(){
    var elH2 = document.querySelector('.time')
    elH2.innerText = '00:00'
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
