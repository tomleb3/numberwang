'use strict';

var gArray = [];

var gTimerVar = null;
var gTableSize = 16;

var gCurrentTargetNum = 1;
var gGameStarted = false;
var gGameMode = 0;

var gTimerCount = {
    miliSec: 0,
    sec: 0,
};


function init() {
    gArray = [];
    gTimerCount.miliSec = 0;
    gTimerCount.sec = 0;
    gCurrentTargetNum = 1;
    gGameStarted = false;
    clearInterval(gTimerVar);
    gTimerVar = null;
    document.querySelector('h3').innerText = '';
    document.querySelector('.table-background').innerText = '';

    createTable();
}

function createTable() {
    document.querySelector('.table-background').innerText = '';

    for (var i = 1; i <= gTableSize; i++) {
        gArray.push(i);
    }
    shuffleTable();
    renderTable();
    initHighScores();
}

function tableSize(tableSize = 16) {
    gTableSize = tableSize;
    var tableBackground = document.querySelector('.table-background').style;
    switch (gTableSize) {
        case 16:
            tableBackground.height = '400px';
            tableBackground.width = '350px';
            gGameMode = 0;
            break;
        case 25:
            tableBackground.height = '500px';
            tableBackground.width = '430px';
            gGameMode = 1;
            break;
        case 36:
            tableBackground.height = '580px';
            tableBackground.width = '500px';
            gGameMode = 2;
            break;
        case 64:
            tableBackground.height = '680px';
            tableBackground.width = '650px';
            gGameMode = 3;
            break;
    }
    playClickSound();
    init();
}

function shuffleTable() {
    for (var i = gArray.length - 1; i > 0; i--) {
        var randNum = Math.floor(Math.random() * i);
        var currNum = gArray[i];
        gArray[i] = gArray[randNum];
        gArray[randNum] = currNum;
    }
}

function renderTable() {
    var strHtml = '';
    var count = 0;
    for (var i = 0; i < Math.sqrt(gTableSize); i++) {
        strHtml += '<tr>';
        for (var j = 0; j < Math.sqrt(gTableSize); j++) {
            var currNum = gArray[count];
            strHtml += '<td class="table-square" onclick="cellClicked(this)">' + currNum + '</td>';
            count++;
        }
        strHtml += '</tr>';
    }
    document.querySelector('.table').innerHTML = strHtml;
}

function cellClicked(clickedNum) {
    if (+clickedNum.innerText === gCurrentTargetNum) {
        clickedNum.style.backgroundColor = 'lightgreen';
        gCurrentTargetNum++;
        document.querySelector('.table-background').innerText = 'Next: ' + gCurrentTargetNum;
        timerStart();
        checkGameOver();
    }
}

function timerStart() {
    if (!gGameStarted) {
        gGameStarted = true;
        gTimerVar = setInterval(function () {
            if (gTimerCount.miliSec === 99) {
                gTimerCount.sec++;
                gTimerCount.miliSec = 0;
            } else gTimerCount.miliSec++;
            document.querySelector('h3').innerText = 'Your Time - ' + gTimerCount.sec + '.' + gTimerCount.miliSec + 's';
        }, 10);
    }
}

function checkGameOver() {
    if (gCurrentTargetNum === gTableSize + 1) {
        clearInterval(gTimerVar);
        gTimerVar = null;
        checkHighScores();
        document.querySelector('.table-background').innerHTML = '<p onclick="init()">Restart ?</p>';
    }
}

function initHighScores() {
    for (var i = 0; i < 4; i++) {
        if (isNaN(localStorage[i + 'miliSec']) || isNaN(localStorage[i + 'sec'])) {
            localStorage[i + 'sec'] = 0;
            localStorage[i + 'miliSec'] = 0;
        }
    }

    var scoreLabels = document.querySelectorAll('.the-score');
    for (var i = 0; i < 4; i++) {
        scoreLabels[i].innerText = localStorage[i + 'sec'] + '.' + localStorage[i + 'miliSec'] + 's';
    }

    document.querySelector('.highest-score-value').innerText = localStorage[gGameMode + 'sec'] + '.' + localStorage[gGameMode + 'miliSec'] + 's';

    console.log(localStorage.sec, localStorage.miliSec);   //// for testing
}

function checkHighScores() {
    if (localStorage[gGameMode + 'sec'] > gTimerCount.sec || localStorage[gGameMode + 'sec'] === '0') {
        localStorage[gGameMode + 'sec'] = gTimerCount.sec;
        localStorage[gGameMode + 'miliSec'] = gTimerCount.miliSec;
    }
    else if (+localStorage[gGameMode + 'sec'] === gTimerCount.sec)
        if (localStorage[gGameMode + 'miliSec'] > gTimerCount.miliSec)
            localStorage[gGameMode + 'miliSec'] = gTimerCount.miliSec;

    initHighScores();
}

function clearHighscores() {
    localStorage.clear();
    initHighScores();
    playClickSound();
    init();
}

function playClickSound() {
    var clickSound = new Audio('res/click.mp3');
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play();
}

function openNav() {
    document.querySelector(".sidenav").style.width = '250px';
}

function closeNav() {
    document.querySelector(".sidenav").style.width = '0';
}