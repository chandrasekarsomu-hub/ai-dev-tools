export function initControls(onDir, onPause) {
    const dirMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 }
    };

    function handler(e) {
        const k = e.key;
        if (k === 'p' || k === 'P') {
            onPause && onPause();
            return;
        }
        if (dirMap[k]) {
            onDir && onDir(dirMap[k]);
        }
    }

    window.addEventListener('keydown', handler);

    // Basic touch (swipe) support
    let touchStart = null;
    window.addEventListener('touchstart', (e) => { const t = e.touches[0]; touchStart = { x: t.clientX, y: t.clientY }; });
    window.addEventListener('touchend', (e) => {
        if (!touchStart) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - touchStart.x; const dy = t.clientY - touchStart.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) onDir && onDir({ x: 1, y: 0 });
            else if (dx < -30) onDir && onDir({ x: -1, y: 0 });
        } else {
            if (dy > 30) onDir && onDir({ x: 0, y: 1 });
            else if (dy < -30) onDir && onDir({ x: 0, y: -1 });
        }
        touchStart = null;
    });

    return () => { window.removeEventListener('keydown', handler); };
}
