// start slingin' some d3 here.

var settings = {
  height : 300,
  width : 300,
  enemyR : 7,
  playerR : 7,
  numEnemies : 10,
}

var Enemy = function(x, y){
  this.x = x;
  this.y = y;
  this.color = "red";
}

var Player = function(x, y){
  this.x = x;
  this.y = y;
  this.color = "red";
}

//Loop through number of enemies and populate a new enemy at a random x and y coordinate
var populateEnemies = function(){
  var x;//random x
  var y;//enemies start off the screen then drop in
  for (var i = 0; i < settings.numEnemies; i++){
    x = 0 - (Math.floor(Math.random() * (settings.width * 2)));
    y = 0 - (Math.floor(Math.random() * (settings.height * 2)));
    x *= (Math.round(Math.random()) * 2 - 1);
    y *= (Math.round(Math.random()) * 2 - 1);
    if (x > 0 && x < settings.width){
      x *= -1;
    }
    if (y > 0 && y < settings.height){
      y *= -1;
    }
    var newEnemy = new Enemy(x, y);
    enemies.push(newEnemy);  //push new enemies into array in order to easily access their data in D3
  }

  //Paint all enemies on screen as SVG circles
  svg.selectAll('circle').data(enemies).enter()
      .append('circle')
      .attr('class', 'enemy')
      .attr("r", settings.enemyR + "px")
      .attr("cx", function(d, i){ return d.x; })
      .attr("cy", function(d, i){ return d.y; })
      .attr('fill', 'black');

  //Drop enemies onto play area
  svg.selectAll('.enemy').data(enemies)
      .transition().ease('elastic').duration(1500)
      .attr("cy", function(d, i){
        d.y = Math.floor(Math.random() * (settings.height - 50) + 50);
        return d.y;
      })
      .attr("cx", function(d, i){
        d.x = Math.floor(Math.random() * (settings.width - 50) + 50);
        return d.x;
      });
}

//Create the player
var populatePlayer = function(){
  var player = new Player(settings.width - 25, 25);  //Create the player
  playerArray.push(player);  //Push the player into a global array to easily access with D3

  //Print to screen
  svg.selectAll('.player').data(playerArray).enter()
     .append('circle')
   .attr('class', 'player')
     .attr("r", settings.playerR)
     .attr("cx", function(d, i){ return d.x; })
     .attr("cy", function(d, i){ return d.y; })
     .attr('fill', function(d, i){ return d.color; });
}

//Function called at an interval from main game loop
//Moves all enemies to a new random position on the screen
var moveEnemies = function() {
  var collided = false;  //Store the state to only log one collision per transition
  var enemyMovementSpeed = 1000;  //Time in ms for enemies to move to new location, increase to slow enemies

  //Transition all enemies to a new random location
  svg.selectAll('.enemy').data(enemies)
     .transition().duration(enemyMovementSpeed)
     .attr('cx', function(d, i){
        // startX = d.x;
        d.x = Math.floor(Math.random() * ((settings.width - settings.enemyR) - 50) + 50);
        return d.x;
      })
     .attr('cy', function(d, i){
        // startY = d.y;
        d.y = Math.floor(Math.random() * ((settings.height - settings.enemyR) - 50) + 50);
        return d.y;
      })
     .tween('Collision Check', function(d, i){  //Run checkCollision at each step in the transition to register collisions while transitioning
       return function(t) {  //t is the percentage of the way through the transition
        d.x = d3.select(this).attr('cx');
        d.y = d3.select(this).attr('cy');
        if (collided === false){
        if (checkCollision(d.x, d.y) === true){
          collided = true;
          score = 0;
       }
     }
     }
     });
          updateScore(collided);
}
//Compare the hitboxes of the player and an enemy to check for a collision
var checkCollision = function(targetX, targetY){
  var player = playerArray[0];
  var playerX = player.x,
      playerY = player.y;

  //get distances between objects
  var dx = targetX - player.x;
  var dy = targetY - player.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  //check if the objects are close enough to be touching
  if (distance <= settings.playerR + settings.enemyR){
    if (playerDead === false){
      collisions++;
      screenShake();
      killPlayer();
    }
    return true;
  } else {
    return false;
  }

}

var screenShake = function() {
  if (playerDead === false){
    gameScreen.transition().duration(50).style({
      'top' : '7px',
      'left' : '7px'
    }).transition().duration(50).style({
      'top' : '0px',
      'left' : '0px'
    }).transition().duration(50).style({
      'top' : '7px',
      'left' : '7px'
    }).transition().duration(50).style({
      'top' : '-7px',
      'left' : '-7px'
    }).transition().duration(50).style({
      'top' : '7px',
      'left' : '7px'
    }).transition().duration(50).style({
  'top' : '-7px',
      'left' : '-7px'
    });
    //Create explosion circle at player coordinates
    var explosionCircle = svg.selectAll('.collisionCircle').data([1]).enter()
      .append('circle').attr('class', '.collisionCircle')
      .attr('cx', playerArray[0].x).attr('cy', playerArray[0].y)
      .attr('r', settings.playerR).attr('fill', 'red');

    explosionCircle.transition().duration(350)
      .style('opacity', 0).attr('r', 75).attr('fill', 'orange').remove();

  }
}

var killPlayer = function(){
  svg.select('.player').data(playerArray)
    .transition().duration(1000).ease('bounce')
  .attr('cy', settings.height - settings.playerR).each('end', function(d){
    d.y = settings.height - settings.playerR;
  });
  playerDead = true;
}

//Called at an interval, updates the scores displayed
var updateScore = function(collided) {

  if (collided === true && playerDead === false){
    score = 0;
    // collisions++;
  } else if (collided === false && playerDead === false){
    score++;  //Increase the score at each interval
  }
  if (score > highScore){  //Set high score if needed
    highScore = score;
  }
}

var printScore = function(){
  //Print the scores to the screen
  d3.select('.scoreboard').selectAll('div').data(["High Score: " + highScore, "Score: " + score, "Collisions: " + collisions])
    .text(function(d){ return d });
}

//----GLOBAL VARIABLES----
  d3.select('.gameSpace').append("svg");
  var svg = d3.select('svg').attr("height", settings.height).attr("width", settings.width);
  var gameScreen = d3.select('.gameSpace').style("height", settings.height + "px").style("width", settings.width + "px");

  //draw background
  // d3.select('.gameSpace').selectAll('defs').data([1]).append('defs');
  // d3.select('defs').selectAll('pattern').data([1]).enter().append('pattern');
  // d3.select('pattern')
  //     .attr('id', 'background')
  //     .attr('patternUnits', 'userSpaceOnUse')
  //     .attr('x', 0).attr('y', 0)
  //     .attr('width', settings.width).attr('height', settings.height);
  // d3.select('pattern').selectAll('image').data(["background.jpg"]).enter()
  //     .attr('href', function(d){ return d; })
  //     .attr('width', settings.width).attr('height', settings.height)
  //     .append('image');
  // d3.select('svg').attr('fill', 'url(#background)');


  var enemies = [];
  var playerArray = [];  //d3 accepts arrays as data arguments so push the player object into an array even though there is only one of them
  var score = 0;
  var highScore = 0;
  var collisions = 0;
  var playerDead = false;


//----MAIN GAME FUNCTION----
var startGame = function() {
  //add event listener for clicking and dragging the player

  var mouseCoordinates = [0, 0];     //d3 coordinates are stored in an array, [x, y]
  var timeBetweenEnemyMoves = 1000;  //Time between each time the enemies move to a new location in ms
  populateEnemies(settings.numEnemies);
  populatePlayer();                  //Create the player and paint to screen
  var player = playerArray[0];

  setInterval(function(){ moveEnemies(); }, timeBetweenEnemyMoves);
  setInterval(function(){ printScore(); }, 100);

  //Event listener that locks the player to the mouse position
  d3.select('.gameSpace').data(playerArray).on('mousemove', function(d) {
    mouseCoordinates = d3.mouse(this);
    if (playerDead === false){
      player.x = mouseCoordinates[0];
      player.y = mouseCoordinates[1];
      d3.selectAll('.player').attr('cx', player.x).attr('cy', player.y);
    }
  });
  d3.selectAll('.player').data(playerArray).on('click', function(d){
      playerDead = false;
  });
}

startGame();

