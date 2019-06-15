let player;
let cells = [];
let xoff = 0;
let yoff = 10000;
let count = 0;

function setup() {
  createCanvas(858, 480);
  player = new Cell(width / 2, height / 2, 1000, true);
  for (let i = 0; i < 10; i++) {
    cells.push(new Cell(Math.random() * width, Math.random() * height, Math.random() * 5000, false));
  }
}

function draw() {
  background(127);
  player.update();
  cells.forEach(cell => cell.update());
  cells.push(new Cell(Math.random() * width, Math.random() * height, Math.random() * 100, false));
  count += 0.1;
}

function Cell(x, y, mass, isPlayer) {
  // Variables
  this.x = x;
  this.y = y;
  this.mass = mass;
  this.speed = 5;
  this.size = Math.sqrt(this.mass / PI);
  this.isPlayer = isPlayer;
  this.ownOff = Math.random() * 1000000;

  // Functions
  this.update = function() {
    this.size = Math.sqrt(this.mass / PI);
    cells.forEach(cell => {
      this.eat(cell);
    });
    this.move();
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
    this.show();
  }
  this.show = function() {
    noStroke();
    if (this.isPlayer) {
      fill(0, 255, 0);
    } else {
      fill(255, 0, 0);
    }
    ellipse(this.x, this.y, this.size * 2, this.size * 2);
  };
  this.move = function() {
    if (this.isPlayer) {
      if (keyIsDown(65)) {
        this.x -= this.speed;
      }
      if (keyIsDown(68)) {
        this.x += this.speed;
      }
      if (keyIsDown(87)) {
        this.y -= this.speed;
      }
      if (keyIsDown(83)) {
        this.y += this.speed;
      }
    } else {
      this.x += map(noise(this.ownOff + xoff + count), 0, 1, -2, 2);
      this.y += map(noise(this.ownOff + yoff + count), 0, 1, -2, 2);
    }
  };
  this.eat = function(other) {
    let distance = Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2);
    if (distance <= this.size + other.size) { // Touching
      if(this.mass > other.mass) { // Bigger than enemy
        // Gain mass
        this.mass += other.mass;
        other.mass = 0;
        // Recalculate sizes
        this.size = Math.sqrt(this.mass / PI);
        other.size = Math.sqrt(other.mass / PI);
      }
    }
  };
}
