function randInt(max) {
    return Math.floor(Math.random() * max);
}

export class FoodManager {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.regular = null;
        this.bonus = null;
        this.eatenCount = 0;
        this.bonusTimer = null;
    }

    _randomPoint() {
        return { x: randInt(this.cols), y: randInt(this.rows) };
    }

    spawn(snakeSegments) {
        // spawn regular food avoiding snake
        let p;
        do { p = this._randomPoint(); } while (snakeSegments.some(s => s.x === p.x && s.y === p.y));
        this.regular = p;

        // every 5th spawn -> spawn bonus with some chance
        if ((this.eatenCount + 1) % 5 === 0 && Math.random() < 0.9) {
            this.spawnBonus(snakeSegments);
        }
    }

    spawnBonus(snakeSegments, duration = 6000) {
        let p;
        do { p = this._randomPoint(); } while (snakeSegments.some(s => s.x === p.x && s.y === p.y) || (this.regular && p.x === this.regular.x && p.y === this.regular.y));
        this.bonus = p;
        if (this.bonusTimer) clearTimeout(this.bonusTimer);
        this.bonusTimer = setTimeout(() => { this.bonus = null; this.bonusTimer = null; }, duration);
    }

    eatRegular() {
        this.regular = null;
        this.eatenCount += 1;
        if (this.bonusTimer) { /* keep bonus if existing */ }
    }

    eatBonus() {
        this.bonus = null;
        if (this.bonusTimer) { clearTimeout(this.bonusTimer); this.bonusTimer = null; }
    }
}
