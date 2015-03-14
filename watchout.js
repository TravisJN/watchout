// start slingin' some d3 here.

var Enemy = function(x, y){
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.color = "black";
}

var Player = function(x, y){
  this.x = x;
  this.y = y;
  this.radius = 7;
  this.color = "red";
}

//Loop through number of enemies and populate a new enemy at a random x and y coordinate
var populateEnemies = function(numEnemies){
  var x;//random x
  var y;//enemies start off the screen then drop in
  for (var i = 0; i < numEnemies; i++){
    x = 0 - (Math.floor(Math.random() * (1000)));
    y = 0 - (Math.floor(Math.random() * (1000)));
    x *= (Math.round(Math.random()) * 2 - 1);
    y *= (Math.round(Math.random()) * 2 - 1);
    console.log(x, ",", y);
    if (x > 0 && x < 500){
      x *= -1;
      console.log("x:",x);
    }
    if (y > 0 && y < 500){
      y *= -1;
      console.log("y:",y);
    }
    var newEnemy = new Enemy(x, y);
    enemies.push(newEnemy);  //push new enemies into array in order to easily access their data in D3
  }

  //Paint all enemies on screen as SVG circles
  svg.selectAll('circle').data(enemies).enter()
      .append('circle')
      .attr('class', 'enemy')
      .attr("r", function(d, i){ return d.radius; })
      .attr("cx", function(d, i){ return d.x; })
      .attr("cy", function(d, i){ return d.y; });

  //Drop enemies onto play area
  svg.selectAll('.enemy').data(enemies)
      .transition().ease('elastic').duration(1500)
      .attr("cy", function(d, i){ 
        d.y = Math.floor(Math.random() * (300 - 50) + 50);
        return d.y;
      })
      .attr("cx", function(d, i){ 
        d.x = Math.floor(Math.random() * (300 - 50) + 50);
        return d.x;
   });
}

//Create the player
var populatePlayer = function(){
  var player = new Player(330, 100);  //Create the player
  playerArray.push(player);  //Push the player into a global array to easily access with D3

  //Print to screen
  svg.selectAll('.player').data(playerArray).enter()
     .append('circle')
     .attr('class', 'player')
     .attr("r", function(d, i){ return d.radius; })
     .attr("cx", function(d, i){ return d.x; })
     .attr("cy", function(d, i){ return d.y; })
     .attr('fill', function(d, i){ return d.color; });
}

//Function called at an interval from main game loop
//Moves all enemies to a new random position on the screen
var moveEnemies = function() {
  var collided = false;  //Store the state to only log one collision per transition
  var enemyMovementSpeed = 1000;  //Time in ms for enemies to move to new location, increase to slow enemies
  var startX, startY;

  //Transition all enemies to a new random location
  svg.selectAll('.enemy').data(enemies)
     .transition().duration(enemyMovementSpeed)
     .attr('cx', function(d, i){ 
        startX = d.x;
        d.x = Math.floor(Math.random() * (300 - 50) + 50); 
        return d.x;
      })
     .attr('cy', function(d, i){ 
        startY = d.y;
        d.y = Math.floor(Math.random() * (300 - 50) + 50); 
        return d.y;
      })
     .tween('Collision Check', function(d, i){  //Run checkCollision at each step in the transition to register collisions while transitioning
       return function(t) {  //t is the percentage of the way through the transition
        d.x = d3.select(this).attr('cx');
        d.y = d3.select(this).attr('cy');
        if (checkCollision(d.x, d.y) === true && collided === false){  
          collided = true;
          score = 0;
          collisions++;
       }
          updateScore(collided);
     }
     });
}

//Compare the hitboxes of the player and an enemy to check for a collision
var checkCollision = function(targetX, targetY){
  var player = playerArray[0];
  var playerX = player.x,
      playerY = player.y;
  var enemyRadius = enemies[0].radius;

  //get distances between objects
  var dx = targetX - player.x;
  var dy = targetY - player.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  //check if the objects are close enough to be touching
  if (distance <= player.radius + enemyRadius){
    return true;
  } else {
    return false;
  }
  
}

//Called at an interval, updates the scores displayed
var updateScore = function(collided) {
  if (collided === true && score > 1){
    score = 0;
    collisions++;    
  } else if (collided === false){
    score++;  //Increase the score at each interval
  }
  if (score > highScore){  //Set high score if needed
    highScore = score;
  }
  //Print the scores to the screen
  d3.select('.scoreboard').selectAll('div').data(["High Score: " + highScore, "Score: " + score, "Collisions: " + collisions])
    .text(function(d){ return d });
}


//----GLOBAL VARIABLES----
  var gameWidth = 500;
  var gameHeight = 300;
  d3.select('.gameSpace').append("svg");
  var svg = d3.select('svg').attr("height", 500).attr("width", 500);
  var enemies = [];
  var playerArray = [];  //d3 accepts arrays as data arguments so push the player object into an array even though there is only one of them
  var score = 0;
  var highScore = 0;
  var collisions = 0;


//----MAIN GAME FUNCTION----
var startGame = function() {
  //add event listener for clicking and dragging the player
  
  var mouseCoordinates = [0, 0];     //d3 coordinates are stored in an array, [x, y]
  var numEnemies = 10;               //Number of enemies
  var timeBetweenEnemyMoves = 1000;  //Time between each time the enemies move to a new location in ms
  populateEnemies(numEnemies);  
  populatePlayer();                  //Create the player and paint to screen
  var player = playerArray[0];

  setInterval(function(){ moveEnemies(); }, timeBetweenEnemyMoves);
 
  //Event listener that locks the player to the mouse position
  d3.select('.gameSpace').data(playerArray).on('mousemove', function(d) {
    mouseCoordinates = d3.mouse(this);
    player.x = mouseCoordinates[0];
    player.y = mouseCoordinates[1];
    d3.selectAll('.player').attr('cx', player.x).attr('cy', player.y);
  });  
}

startGame();

