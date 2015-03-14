// start slingin' some d3 here.

var Enemy = function(x, y){
  this.x = x;
  this.y = y;
  this.radius = 5;
  this.color = "black";
}

var Player = function(x, y){
  this.x = x;
  this.y = y;
  this.radius = 7;
  this.color = "red";
}

var populateEnemies = function(numEnemies){
  var x;//random x
  var y;//random y

  for (var i = 0; i < numEnemies; i++){
    x = Math.floor(Math.random() * (300 - 50) + 50);
    y = Math.floor(Math.random() * (300 - 50) + 50);
    var newEnemy = new Enemy(x, y);
    enemies.push(newEnemy);
    // newEnemy.drawEnemy();
  }

  svg.selectAll('circle').data(enemies).enter()
      .append('circle')
      .attr('class', 'enemy')
      .attr("r", function(d, i){ return d.radius; })
      .attr("cx", function(d, i){ return d.x; })
      .attr("cy", function(d, i){ return d.y; });

}

var populatePlayer = function(player){
  svg.selectAll('.player').data(playerData).enter()
     .append('circle')
     .attr('class', 'player')
     .attr("r", function(d, i){ return d.radius; })
     .attr("cx", function(d, i){ return d.x; })
     .attr("cy", function(d, i){ return d.y; })
     .attr('fill', function(d, i){ return d.color; });
}

var moveEnemies = function() {
  var collided = false;

  svg.selectAll('.enemy').data(enemies)
     .transition().duration(500)
     .attr('cx', function(d, i){ 
        d.x = Math.floor(Math.random() * (300 - 50) + 50); 
        return d.x;
      })
     .attr('cy', function(d, i){ 
        d.y = Math.floor(Math.random() * (300 - 50) + 50); 
        return d.y;
      })
     .tween('Collision Check', function(d, i){
       return function(t) {
        if (checkCollision(d.x * t, d.y * t) === true && collided === false){
          collided = true;
          score = 0;
          collisions++;
       }
     }
     });
}

var checkCollision = function(targetX, targetY){
  var player = playerData[0];
  var playerX = player.x,
      playerY = player.y;
  var enemyRadius = enemies[0].radius;

    if ((targetX - enemyRadius < player.x + player.radius) && (targetX + enemyRadius > player.x - player.radius)){
      if ((targetY - enemyRadius < player.y + player.radius) && (targetY + enemyRadius > player.y - player.radius)){ 
      //collision
      return true;
    }
  }
  return false;
  
}

var updateScore = function() {
  score++;
  if (score > highScore){
    highScore = score;
  }
  d3.select('.scoreboard').selectAll('div').data(["High Score: " + highScore, "Score: " + score, "Collisions: " + collisions])
    .text(function(d){ return d });
}


//----GLOBAL VARIABLES----
  d3.select('.gameSpace').append("svg");
  var svg = d3.select('svg').attr("height", 500).attr("width", 500);
  var enemies = [];
  var playerData = [];  //d3 accepts arrays as data arguments so push the player object into an array even though there is only one of them
  var score = 0;
  var highScore = 0;
  var collisions = 0;


//----MAIN GAME FUNCTION----
var game = function() {
  //add event listener for clicking and dragging the player
  
  var player = new Player(330, 100);
  var mouseCoordinates = [0, 0];  //d3 coordinates are stored in an array, [x, y]
  
  playerData.push(player);
  populatePlayer(player);
  populateEnemies(15);

  setInterval(function(){ moveEnemies() }, 1000);
  setInterval(function(){
    var collided = false;
    for (var i = 0; i < enemies.length; i++){
      if (checkCollision(enemies[i].x, enemies[i].y) === true && collided === false){
        collided = true;
      }
    }
    if (collided === true){
      score = 0;
      collisions++;    
    }
    updateScore();
  }, 50);


  d3.select('.gameSpace').data(playerData).on('mousemove', function(d) {

    mouseCoordinates = d3.mouse(this);
    player.x = mouseCoordinates[0];
    player.y = mouseCoordinates[1];
    d3.selectAll('.player').attr('cx', player.x).attr('cy', player.y);

  });  
  
}




game();

