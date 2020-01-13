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
