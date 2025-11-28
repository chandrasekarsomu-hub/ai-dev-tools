export function updateScore(el, score) {
    el.textContent = String(score);
}

export function setStatus(el, text) {
    el.textContent = text;
}

export function flashMessage(el, text, timeout = 1200) {
    const prev = el.textContent;
    el.textContent = text;
    setTimeout(() => { el.textContent = prev; }, timeout);
}
