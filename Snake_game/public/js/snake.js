export class Snake {
    constructor(initial = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }]) {
        this.segments = [...initial];
        this.direction = { x: 1, y: 0 };
        this.growPending = 0;
    }

    setDirection(dir) {
        // Prevent reversing directly
        const last = this.direction;
        if (dir.x === -last.x && dir.y === -last.y) return;
        this.direction = dir;
    }

    head() {
        return this.segments[0];
    }

    move() {
        const head = this.head();
        const newHead = { x: head.x + this.direction.x, y: head.y + this.direction.y };
        this.segments.unshift(newHead);
        if (this.growPending > 0) {
            this.growPending -= 1;
        } else {
            this.segments.pop();
        }
    }

    grow(amount = 1) {
        this.growPending += amount;
    }

    collidesWithPoint(pt) {
        return this.segments.some(s => s.x === pt.x && s.y === pt.y);
    }

    collidesWithSelf() {
        const [head, ...rest] = this.segments;
        return rest.some(s => s.x === head.x && s.y === head.y);
    }

    reset() {
        this.segments = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
        this.direction = { x: 1, y: 0 };
        this.growPending = 0;
    }
}
