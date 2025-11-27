let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let gameMode = 'easy';
let wins = 0;
let losses = 0;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function startGame(mode) {
    gameMode = mode;
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('modeDisplay').textContent = mode.toUpperCase();
    resetGame();
}

function goHome() {
    document.getElementById('homeScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
    wins = 0;
    losses = 0;
    updateScores();
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('status').textContent = 'Your turn (X)';
    document.getElementById('modal').style.display = 'none';
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winning');
        cell.onclick = handleCellClick;
    });
}

function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (board[index] !== '' || !gameActive || currentPlayer !== 'X') return;
    
    makeMove(index, 'X');
    
    if (gameActive) {
        setTimeout(botMove, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add('taken', player.toLowerCase());
    
    if (checkWin(player)) {
        endGame(player);
    } else if (board.every(cell => cell !== '')) {
        endGame('draw');
    } else {
        currentPlayer = player === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function updateStatus() {
    const status = document.getElementById('status');
    if (currentPlayer === 'X') {
        status.textContent = 'Your turn (X)';
        status.style.color = '#00ff41';
    } else {
        status.textContent = 'Bot thinking (O)';
        status.style.color = '#ff00ff';
    }
}

function botMove() {
    if (!gameActive) return;
    
    let move;
    
    switch(gameMode) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'normal':
            move = Math.random() < 0.5 ? getBestMove() : getRandomMove();
            break;
        case 'hard':
            move = getBestMove();
            break;
    }
    
    if (move !== -1) {
        makeMove(move, 'O');
    }
}

function getRandomMove() {
    const availableMoves = board.map((cell, idx) => cell === '' ? idx : -1).filter(idx => idx !== -1);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
}

function getBestMove() {
    // Check for winning move
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWin('O')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    
    // Block player's winning move
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWin('X')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    
    // Take center if available
    if (board[4] === '') return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take any available spot
    return getRandomMove();
}

function checkWin(player) {
    return winPatterns.some(pattern => {
        const win = pattern.every(index => board[index] === player);
        if (win) {
            pattern.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning');
            });
        }
        return win;
    });
}

function endGame(result) {
    gameActive = false;
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    if (result === 'X') {
        wins++;
        modalContent.className = 'modal-content win';
        modalTitle.textContent = 'VICTORY!';
        modalTitle.style.color = '#ffd700';
        modalMessage.textContent = '$ sudo apt-get install victory';
    } else if (result === 'O') {
        losses++;
        modalContent.className = 'modal-content lose';
        modalTitle.textContent = 'GAME OVER';
        modalTitle.style.color = '#ff0000';
        modalMessage.textContent = '$ error: kernel panic';
    } else {
        modalContent.className = 'modal-content draw';
        modalTitle.textContent = 'DRAW';
        modalTitle.style.color = '#0ff';
        modalMessage.textContent = '$ connection timeout';
    }
    
    updateScores();
    modal.style.display = 'flex';
}

function updateScores() {
    document.getElementById('winsDisplay').textContent = wins;
    document.getElementById('lossesDisplay').textContent = losses;
}

function playAgain() {
    resetGame();
}

// Initialize cell click handlers
document.querySelectorAll('.cell').forEach(cell => {
    cell.onclick = handleCellClick;
});