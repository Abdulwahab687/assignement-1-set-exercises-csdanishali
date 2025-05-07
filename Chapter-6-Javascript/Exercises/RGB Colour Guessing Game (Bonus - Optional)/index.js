/**
 * RGB Color Guessing Game
 * 
 * A fun interactive game to test your RGB color recognition skills.
 * The player needs to guess which color matches the given RGB value.
 */

// Game configuration
const config = {
    maxLives: 3,           // Number of lives the player starts with
    numberOfOptions: 4,    // Number of color options to display
    newColorDelay: 1000,   // Delay in ms before showing new colors after guess
    correctPoints: 10      // Points awarded for a correct answer
};

// Game state
let gameState = {
    lives: config.maxLives,
    score: 0,
    currentRgb: null,
    options: [],
    correctIndex: null
};

// DOM elements
const elements = {
    rgbDisplay: document.getElementById('rgb-display'),
    colorOptions: document.getElementById('color-options'),
    livesDisplay: document.getElementById('lives-display'),
    scoreDisplay: document.getElementById('score'),
    feedback: document.getElementById('feedback'),
    gameOver: document.getElementById('game-over'),
    finalScore: document.getElementById('final-score'),
    playAgainBtn: document.getElementById('play-again')
};

/**
 * Initialize the game
 */
function initGame() {
    // Reset game state
    gameState.lives = config.maxLives;
    gameState.score = 0;
    
    // Update UI
    updateLivesDisplay();
    updateScoreDisplay();
    
    // Hide game over screen if visible
    elements.gameOver.classList.remove('show');
    
    // Clear feedback
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    
    // Generate first round of colors
    generateNewRound();
}

/**
 * Generate a new round with new colors
 */
function generateNewRound() {
    // Clear existing options
    elements.colorOptions.innerHTML = '';
    
    // Generate random colors
    gameState.options = [];
    for (let i = 0; i < config.numberOfOptions; i++) {
        gameState.options.push(generateRandomColor());
    }
    
    // Randomly choose one color as the correct answer
    gameState.correctIndex = Math.floor(Math.random() * config.numberOfOptions);
    gameState.currentRgb = gameState.options[gameState.correctIndex];
    
    // Update RGB display
    elements.rgbDisplay.textContent = `RGB(${gameState.currentRgb.r}, ${gameState.currentRgb.g}, ${gameState.currentRgb.b})`;
    
    // Create color option elements
    gameState.options.forEach((color, index) => {
        const colorElement = document.createElement('div');
        colorElement.className = 'color-option';
        colorElement.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        
        // Add click event
        colorElement.addEventListener('click', () => handleGuess(index));
        
        elements.colorOptions.appendChild(colorElement);
    });
}

/**
 * Generate a random RGB color
 * @returns {Object} Color object with r, g, b properties
 */
function generateRandomColor() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };
}

/**
 * Handle player's guess
 * @param {number} guessIndex - Index of the color option chosen
 */
function handleGuess(guessIndex) {
    const isCorrect = guessIndex === gameState.correctIndex;
    
    if (isCorrect) {
        // Correct guess
        gameState.score += config.correctPoints;
        updateScoreDisplay();
        showFeedback(true);
    } else {
        // Incorrect guess
        gameState.lives--;
        updateLivesDisplay();
        showFeedback(false);
        
        // Check if game over
        if (gameState.lives <= 0) {
            endGame();
            return;
        }
    }
    
    // Set timeout for next round
    setTimeout(generateNewRound, config.newColorDelay);
}

/**
 * Update the lives display
 */
function updateLivesDisplay() {
    elements.livesDisplay.innerHTML = '';
    
    // Create heart icons for remaining lives
    for (let i = 0; i < gameState.lives; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤';
        elements.livesDisplay.appendChild(heart);
    }
    
    // Create empty heart icons for lost lives
    for (let i = 0; i < config.maxLives - gameState.lives; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '♡';
        heart.style.opacity = '0.5';
        elements.livesDisplay.appendChild(heart);
    }
}

/**
 * Update the score display
 */
function updateScoreDisplay() {
    elements.scoreDisplay.textContent = gameState.score;
}

/**
 * Show feedback to the player about their guess
 * @param {boolean} isCorrect - Whether the guess was correct
 */
function showFeedback(isCorrect) {
    elements.feedback.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
    elements.feedback.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
}

/**
 * End the game and show game over screen
 */
function endGame() {
    elements.finalScore.textContent = gameState.score;
    elements.gameOver.classList.add('show');
}

/**
 * Event listeners
 */
elements.playAgainBtn.addEventListener('click', initGame);

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);