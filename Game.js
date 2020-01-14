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
      alert('game Over');
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
    this.updateGame();
    return {snake: this.snake, previousFood: this.previousFood, 
      food: this.food,  ghostSnake: this.ghostSnake, score: this.score};
  }

  isSnakeOnWall() {
    const [snakeColId, snakeRowId] = [...this.snake.getHeadPosition()];
    const snakeInColRange = snakeColId >= 99 || snakeColId <= 0;
    const snakeInRowRange = snakeRowId >= 59 || snakeRowId <= 0;
    console.log(snakeColId >= 100 || snakeColId >= 0);

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
