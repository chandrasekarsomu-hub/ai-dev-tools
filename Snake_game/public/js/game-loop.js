import { Snake } from './snake.js';
import { FoodManager } from './food.js';
import { initControls } from './controls.js';
import { updateScore, setStatus, flashMessage } from './ui.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreBadge');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const speedSelect = document.getElementById('speedSelect');

const COLS = 30;
const ROWS = 30;
const CELL = Math.floor(canvas.width / COLS);

const SPEED_LEVELS = {
    1: 160,
    2: 120,
    3: 90,
    4: 60,
    5: 40
};

class Game {
    constructor() {
        this.snake = new Snake();
        this.food = new FoodManager(COLS, ROWS);
        this.score = 0;
        this.running = false;
        this.interval = null;
        this.speedLevel = Number(speedSelect.value || 3);
        this.paused = false;

        initControls((dir) => this.snake.setDirection(dir), () => this.togglePause());

        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.togglePause());
        restartBtn.addEventListener('click', () => this.restart());
        speedSelect.addEventListener('change', (e) => this.changeSpeed(Number(e.target.value)));
    }

    changeSpeed(level) {
        this.speedLevel = level;
        if (this.running) {
            this._resetInterval();
        }
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.paused = false;
        this.score = 0;
        this.snake.reset();
        this.food.spawn(this.snake.segments);
        setStatus(statusEl, 'Playing');
        updateScore(scoreEl, this.score);
        this._resetInterval();
        this._render();
    }

    restart() {
        this.stop();
        this.start();
    }

    stop() {
        this.running = false;
        this.paused = false;
        this._clearInterval();
        setStatus(statusEl, 'Stopped');
    }

    togglePause() {
        if (!this.running) return;
        this.paused = !this.paused;
        setStatus(statusEl, this.paused ? 'Paused' : 'Playing');
    }

    _resetInterval() {
        this._clearInterval();
        const ms = SPEED_LEVELS[this.speedLevel] || 90;
        this.interval = setInterval(() => this._tick(), ms);
    }

    _clearInterval() {
        if (this.interval) clearInterval(this.interval);
        this.interval = null;
    }

    _tick() {
        if (!this.running || this.paused) return;
        this.snake.move();
        const head = this.snake.head();

        // Wall collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            this.gameOver('Hit the wall');
            return;
        }

        // Self collision
        if (this.snake.collidesWithSelf()) {
            this.gameOver('Hit yourself');
            return;
        }

        // Bonus food
        if (this.food.bonus && head.x === this.food.bonus.x && head.y === this.food.bonus.y) {
            this.score += 5;
            this.food.eatBonus();
            flashMessage(statusEl, 'Bonus +5!');
            updateScore(scoreEl, this.score);
        }

        // Regular food
        if (this.food.regular && head.x === this.food.regular.x && head.y === this.food.regular.y) {
            this.score += 1;
            this.snake.grow(1);
            this.food.eatRegular();
            this.food.spawn(this.snake.segments);
            updateScore(scoreEl, this.score);
        }

        this._render();
    }

    gameOver(reason) {
        this.stop();
        setStatus(statusEl, `Game Over: ${reason}`);
        flashMessage(statusEl, `Game Over — ${this.score} pts`, 3000);
    }

    _render() {
        // clear
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw grid optional
        // draw snake
        for (let i = 0; i < this.snake.segments.length; i++) {
            const s = this.snake.segments[i];
            ctx.fillStyle = i === 0 ? '#00ff66' : '#00994d';
            ctx.fillRect(s.x * CELL, s.y * CELL, CELL - 1, CELL - 1);
        }

        // draw regular food
        if (this.food.regular) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.food.regular.x * CELL, this.food.regular.y * CELL, CELL - 1, CELL - 1);
        }

        // draw bonus food
        if (this.food.bonus) {
            ctx.fillStyle = 'gold';
            ctx.fillRect(this.food.bonus.x * CELL, this.food.bonus.y * CELL, CELL - 1, CELL - 1);
        }
    }
}

// Initialize
const game = new Game();
setStatus(statusEl, 'Ready');
