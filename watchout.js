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
  svg.selectAll('.enemy').data(enemies)
     .transition().duration(500)
     .attr('cx', function(d, i){ return Math.floor(Math.random() * (300 - 50) + 50); })
     .attr('cy', function(d, i){ return Math.floor(Math.random() * (300 - 50) + 50); });
}

//add event listener for clicking and dragging the player
d3.select('.gameSpace').append("svg");
var svg = d3.select('svg').attr("height", 500).attr("width", 500);
var enemies = [];
var playerData = [];  //d3 accepts arrays as data arguments so push the player object into an array even though there is only one of them
var player = new Player(330, 100);
playerData.push(player);
populatePlayer(player);
populateEnemies(15);
var mouseCoordinates = [0, 0];  //d3 coordinates are stored in an array, [x, y]
var isDragging = false;

setInterval(function(){ moveEnemies() }, 1000);

d3.select('.gameSpace').selectAll('.player').data(playerData).on('mousedown', function(d) {
  mouseCoordinates = d3.mouse(this);
  isDragging = true;
  console.log(mouseCoordinates);
  d3.selectAll('.player').attr('cx', mouseCoordinates[0]).attr('cy', mouseCoordinates[1]);
});

  d3.select('.gameSpace').selectAll('.player').data(playerData).on('mousemove', function(d) {
if (isDragging === true) {
    mouseCoordinates = d3.mouse(this);
  d3.selectAll('.player').attr('cx', mouseCoordinates[0]).attr('cy', mouseCoordinates[1]);
}
  });  

d3.select('.gameSpace').selectAll('.player').data(playerData).on('mouseup', function(d) {
  isDragging = false;
  // mouseCoordinates = d3.mouse(this);
  // this.attr('cx', mouseCoordinates[0]).attr('cy', mouseCoordinates[1]);
});  





