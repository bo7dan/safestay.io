// Minesweeper with difficulty selector and extreme fullscreen mode
// GPT-5 mini — Duck.ai (date: 2025-09-27)

const boardEl = document.getElementById('board');
const difficultySelect = document.getElementById('difficulty');
const newBtn = document.getElementById('new');
const statusEl = document.getElementById('status');
const themeToggle = document.getElementById('themeToggle');

let rows = 9, cols = 9, mines = 10;
let grid = [];
let started = false;
let gameOver = false;
let cellsLeft = 0;
let extremeMode = false;

const DIFFICULTIES = {
  easy:   {rows: 9,  cols: 9,  mines: 10},
  medium: {rows: 16, cols: 16, mines: 40},
  hard:   {rows: 16, cols: 30, mines: 99},
  extreme:{rows: 30, cols: 50, mines: 300} // large grid; will request fullscreen
};

function applyDifficulty() {
  const d = difficultySelect.value || 'medium';
  const cfg = DIFFICULTIES[d] || DIFFICULTIES.medium;
  rows = cfg.rows; cols = cfg.cols; mines = Math.min(cfg.mines, cfg.rows*cfg.cols-1);
  extremeMode = (d === 'extreme');
}

function init() {
  applyDifficulty();

  boardEl.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;
  boardEl.innerHTML = '';
  grid = [];
  started = false;
  gameOver = false;
  statusEl.textContent = '';
  cellsLeft = rows*cols - mines;

  for (let r=0;r<rows;r++){
    const row = [];
    for (let c=0;c<cols;c++){
      const cell = {mine:false, adj:0, revealed:false, flagged:false, r, c};
      const el = document.createElement('div');
      el.className = 'cell';
      el.dataset.r = r; el.dataset.c = c;
      el.addEventListener('click', onLeft);
      el.addEventListener('contextmenu', onRight);
      el.addEventListener('dblclick', onDouble);
      cell.el = el;
      boardEl.appendChild(el);
      row.push(cell);
    }
    grid.push(row);
  }

  // If extreme mode, request fullscreen and scale cells to fill viewport
  if (extremeMode) enterFullscreenAndFit();
  else exitFullscreenIfNeeded();
}

function placeMines(firstR, firstC) {
  const avoid = new Set();
  for (let dr=-1;dr<=1;dr++){
    for (let dc=-1;dc<=1;dc++){
      const rr = firstR+dr, cc = firstC+dc;
      if (inBounds(rr,cc)) avoid.add(rr+','+cc);
    }
  }
  let placed=0;
  while (placed < mines) {
    const r = Math.floor(Math.random()*rows);
    const c = Math.floor(Math.random()*cols);
    if (avoid.has(r+','+c)) continue;
    if (!grid[r][c].mine) {
      grid[r][c].mine = true; placed++;
    }
  }
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (grid[r][c].mine) { grid[r][c].adj = -1; continue; }
      let count=0;
      for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++){
        if (dr===0 && dc===0) continue;
        const rr=r+dr, cc=c+dc;
        if (inBounds(rr,cc) && grid[rr][cc].mine) count++;
      }
      grid[r][c].adj = count;
    }
  }
}

function reveal(r,c) {
  const cell = grid[r][c];
  if (!cell || cell.revealed || cell.flagged) return;
  cell.revealed = true;
  cell.el.classList.add('revealed');
  if (cell.mine) {
    cell.el.classList.add('mine');
    cell.el.textContent = '💣';
    lose();
    return;
  }
  cellsLeft--;
  if (cell.adj>0) {
    cell.el.textContent = cell.adj;
    cell.el.style.color = numberColor(cell.adj);
  } else {
    for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++){
      const rr=r+dr, cc=c+dc;
      if (inBounds(rr,cc) && !(dr===0 && dc===0)) reveal(rr,cc);
    }
  }
  if (cellsLeft===0) win();
}

function onLeft(e) {
  if (gameOver) return;
  const r = +this.dataset.r, c = +this.dataset.c;
  if (!started) {
    placeMines(r,c);
    started = true;
  }
  reveal(r,c);
}

function onRight(e) {
  e.preventDefault();
  if (gameOver) return;
  const r = +this.dataset.r, c = +this.dataset.c;
  const cell = grid[r][c];
  if (cell.revealed) return;
  cell.flagged = !cell.flagged;
  cell.el.classList.toggle('flagged', cell.flagged);
  cell.el.textContent = cell.flagged ? '🚩' : '';
}

function onDouble(e) {
  if (gameOver) return;
  const r = +this.dataset.r, c = +this.dataset.c;
  const cell = grid[r][c];
  if (!cell.revealed || cell.adj<=0) return;
  let flagged=0;
  for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++){
    const rr=r+dr, cc=c+dc;
    if (inBounds(rr,cc) && grid[rr][cc].flagged) flagged++;
  }
  if (flagged === cell.adj) {
    for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++){
      const rr=r+dr, cc=c+dc;
      if (inBounds(rr,cc) && !grid[rr][cc].flagged && !grid[rr][cc].revealed) reveal(rr,cc);
    }
  }
}

function lose() {
  gameOver = true;
  statusEl.textContent = 'Game over';
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
    const cell = grid[r][c];
    if (cell.mine && !cell.revealed) {
      cell.el.classList.add('revealed','mine');
      cell.el.textContent = '💣';
    }
  }
}

function win() {
  gameOver = true;
  statusEl.textContent = 'You win!';
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
    const cell = grid[r][c];
    if (cell.mine) {
      cell.el.classList.add('flagged');
      cell.el.textContent = '🚩';
    }
  }
}

function inBounds(r,c){ return r>=0 && c>=0 && r<rows && c<cols; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function numberColor(n){
  return ['#0b3b52','#0b6152','#a52a00','#00178b','#3b0060','#4d001a','#222','#222'][n] || '#000';
}

// Theme toggle (same as before)
function applyTheme(dark) {
  document.body.classList.toggle('dark', !!dark);
  themeToggle.textContent = `Тема: ${dark ? 'темна' : 'світла'}`;
}
themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
  try { localStorage.setItem('mines_theme_dark', isDark ? '1' : '0'); } catch(e){}
});
try {
  const stored = localStorage.getItem('mines_theme_dark');
  applyTheme(stored === '1');
} catch(e) { applyTheme(false); }

// Fullscreen helpers for extreme mode
async function enterFullscreenAndFit(){
  // request fullscreen on nearest container
  const wrap = document.getElementById('boardWrap') || document.body;
  if (wrap.requestFullscreen) {
    try { await wrap.requestFullscreen(); }
    catch(e){}
  } else if (wrap.webkitRequestFullscreen) {
    try { wrap.webkitRequestFullscreen(); } catch(e){}
  }
  // scale cell size so grid fills viewport but keeps cells square
  fitBoardToViewport();
}

function exitFullscreenIfNeeded(){
  if (document.fullscreenElement) {
    try { document.exitFullscreen(); } catch(e){}
  }
  // restore default size
  boardEl.style.width = '';
  boardEl.style.height = '';
}

function fitBoardToViewport(){
  // compute max cell size to fit rows x cols into viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 4; // grid gap
  const maxCellW = Math.floor((vw - (cols-1)*gap) / cols);
  const maxCellH = Math.floor((vh - (rows-1)*gap) / rows);
  const cellSize = Math.max(8, Math.min(maxCellW, maxCellH)); // min 8px
  document.documentElement.style.setProperty('--cell-size', cellSize + 'px');
  // also set board dimensions explicitly
  boardEl.style.width = (cellSize*cols + gap*(cols-1)) + 'px';
  boardEl.style.height = (cellSize*rows + gap*(rows-1)) + 'px';
}

// Re-fit on resize when in extreme mode or when fullscreen
window.addEventListener('resize', () => {
  if (extremeMode && (document.fullscreenElement || document.webkitFullscreenElement)) {
    fitBoardToViewport();
  }
});

// When exiting fullscreen, reset cell size to default
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    // reset default cell size
    document.documentElement.style.setProperty('--cell-size', '32px');
    boardEl.style.width = '';
    boardEl.style.height = '';
  } else {
    // if entering fullscreen (maybe user accepted), fit
    if (extremeMode) fitBoardToViewport();
  }
});

// Controls
newBtn.addEventListener('click', init);
difficultySelect.addEventListener('change', () => {
  // if user switches away from extreme while in fullscreen, exit
  applyDifficulty();
  if (!extremeMode && document.fullscreenElement) {
    try { document.exitFullscreen(); } catch(e){}
  }
});
// quick restart key
window.addEventListener('keydown', e => { if (e.key.toLowerCase()==='r') init(); });

// initialize
applyDifficulty();
init();
