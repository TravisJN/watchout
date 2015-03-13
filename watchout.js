// start slingin' some d3 here.
var enemies = [];
d3.select('.gameSpace').append("svg");
var svg = d3.select('svg').attr("height", 500).attr("width", 500);

var Enemy = function(x, y){
  this.x = x;
  this.y = y;
  this.radius = 5;
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
      .attr("r", function(d, i){ return d.radius; })
      .attr("cx", function(d, i){ return d.x; })
      .attr("cy", function(d, i){ return d.y; });

}

populateEnemies(15);