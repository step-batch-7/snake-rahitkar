const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }

  // turnRight() {
  //   this.heading = (this.heading +3) % 4;
  // }
}

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  getHeadPosition() {
    return this.positions[this.positions.length -1];
  }

  // turnRight() {
  //   this.direction.turnRight();
  // }

  move() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    this.previousTail = this.positions.shift();

    const [deltaX, deltaY] = this.direction.delta;

    this.positions.push([headX + deltaX, headY + deltaY]);
  }

  grow() {
    this.positions.unshift(this.previousTail);
  }

}

class Food {
  constructor(colId, rowId) {
    this.colId = colId;
    this.rowId = rowId;
  }

  get position() {
    return [this.colId, this.rowId];
  }
}

class Game {
  constructor(snake, ghostSnake, food) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.previousFood = new Food(0, 0);
    this.score = 0;
  }

  hasFoodEaten() {
    const [snakeColId, snakeRowId] = [...this.snake.getHeadPosition()];
    const [foodColId, foodRowId] = this.food.position;
    
    return snakeColId === foodColId && snakeRowId === foodRowId;
  }

  updateGame() {
    if(this.hasFoodEaten()) {
      this.previousFood = this.food;
      this.food = generateFood();
      this.snake.grow();
      this.score++;
    }
    this.snake.move();
    this.ghostSnake.move();
  }

  getStatus() {
    this.updateGame();
    return {snake: this.snake, previousFood: this.previousFood, 
      food: this.food,  ghostSnake: this.ghostSnake, score: this.score};
  }
}


const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => `${colId}_${rowId}`;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const handleKeyPress = snake => {
  snake.turnLeft();
};

const attachEventListeners = snake => {
  document.body.onkeydown = handleKeyPress.bind(null, snake);
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), 'snake');
};

const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(SOUTH), 'ghost');
};

const setup = function(game) {
  attachEventListeners(game.snake);
  createGrids();

  drawSnake(game.snake);
  drawSnake(game.ghostSnake);
};

const  drawFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const generateFood = function() {
  const posX = Math.round(Math.random() * 99);
  const posY = Math.round(Math.random() * 59);
  
  return new Food(posX,posY);
};

const eraseFood = function(previousFood) {
  
  let [colId, rowId] = previousFood.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove('food')
};

const drawScore = function(score) {
  const scoreBoard = document.getElementById('scoreBoard');
  scoreBoard.innerText = `score: ${score}`;
};

const draw = function(gameStatus) {
  const {snake, previousFood, food, ghostSnake, score} = {...gameStatus} 
  eraseTail(snake);
  drawSnake(snake);

  eraseFood(previousFood);
  drawFood(food);

  eraseTail(ghostSnake);
  drawSnake(ghostSnake);

  drawScore(score);
}

const updateGame = function(game) {
  const gameStatus = game.getStatus();
  draw(gameStatus);
}

const main = function() {

  const snake = initSnake();
  
  const ghostSnake = initGhostSnake();

  const food = new Food(55,24);
  
  const game = new Game(snake, ghostSnake, food);
  
  setup(game);
  drawFood(food);
  
  setInterval(() => {
    updateGame(game);
  }, 200);

  setInterval(() => {
    let x = Math.random() * 100;
    if (x > 50) {
      ghostSnake.turnLeft();
    }
  }, 500);
};
