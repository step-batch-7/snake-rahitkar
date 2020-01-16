class Game {
  constructor(snake, ghostSnake, food) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.previousFood = new Food(0, 0);
    this.score = 0;
  }

  hasFoodEaten() {
    const snakeHeadPosition = this.snake.getHeadPosition();
    const foodPosition = this.food.position;
    return areCellsEqual(snakeHeadPosition, foodPosition);
  }

  updateGame() {
    
    if(this.isSnakeOnWall() || this.snake.isTouchedItself() || this.isTouchedGhostSnake()) {
      return 'game Over';
    }

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
    if(this.updateGame()) {
      return {snake: '', previousFood: '', 
        food: '',  ghostSnake: '', score: '', gameStatus: 'over'};
    }

    return {snake: this.snake, previousFood: this.previousFood, 
      food: this.food,  ghostSnake: this.ghostSnake, score: this.score, gameStatus: 'not Over'};

  }

  isSnakeOnWall() {
    const [snakeColId, snakeRowId] = [...this.snake.getHeadPosition()];
    const snakeInColRange = snakeColId >= 99 || snakeColId <= 0;
    const snakeInRowRange = snakeRowId >= 59 || snakeRowId <= 0;

    return  snakeInColRange || snakeInRowRange;
  }

  isTouchedGhostSnake() {
    const SnakeHeadPosition = this.snake.getHeadPosition();
    const ghostSnakeHeadPosition =this.ghostSnake.getHeadPosition();

    const isSnakeTouched = this.ghostSnake.positions.some((element) => {
      return areCellsEqual(element, SnakeHeadPosition);
    }) 

    const isGhostTouched = this.snake.positions.some((element) => {
      return areCellsEqual(element, ghostSnakeHeadPosition);
    }) 
    return isSnakeTouched || isGhostTouched;
   }  
}
