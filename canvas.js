// -------- Playing around with hexagons --------


var draw = function draw() {

  console.log("Script loaded");
  var canvas = document.getElementById('hexies');
  var ctx = canvas.getContext('2d');

  redrawBoard(null, ctx);

  var formThing = document.getElementById('dat-form');
  formThing.addEventListener('input', function(e) {
    redrawBoard(e, ctx);
  });

  var resetButton = document.getElementById('reset-btn');
  resetButton.addEventListener('click', function(e) {
    resetForm(e, ctx);
  })

  document.addEventListener('keydown', function(event) {
    switch(event.which) {
      case 37:
      console.log('left');
      // change 
        board = new Board(maxWidth, maxHeight, hexSize, top, left, ctx)
        board.render();

    }
  });


};

// -------- Funkshunnnsss --------

var clearCanvas = function clearCanvas (ctx) {
  ctx.clearRect(0,0,600,600);
}

var resetForm = function resetForm (e, ctx) {
  
  if (e) {
    e.preventDefault();
  }

  document.getElementById('width').value = "3";
  document.getElementById('height').value = "6";
  document.getElementById('hex-size').value = "100";
  document.getElementById('top').value = "75";
  document.getElementById('left').value = "75";
  
  redrawBoard(e, ctx);
}

var redrawBoard = function redrawBoard (e, ctx) {
  
  if (e) {
    e.preventDefault();
  }
  
  clearCanvas(ctx);
  
  var maxWidth = parseInt(document.getElementById('width').value);
  var maxHeight = parseInt(document.getElementById('height').value);
  var hexSize = parseInt(document.getElementById('hex-size').value);
  var top = parseInt(document.getElementById('top').value);
  var left = parseInt(document.getElementById('left').value);

  board = new Board(maxWidth, maxHeight, hexSize, top, left, ctx)
  board.render();

}

// TO DO - figure out better positioning & fix wonkiness w/ num of rows.
// Maybe do this in SVG instead of canvas.
// or maybe just calculate by rows & columns ya doof

var Board = function Board(maxWidth, maxHeight, hexSize, top, left, ctx) {
  // both max width & height measured in hexes
  this.maxWidth = maxWidth;
  this.maxHeight = maxHeight / (2 / 3);
  console.log(this.maxHeight)

  this.hexSize = {
    height: Math.sqrt(3) / 2 * hexSize,
    width: hexSize,
    hzDist: hexSize * (3 / 4),
    radius: hexSize / 2
  };
  // Point at which the hexagon begins tapering down 
  this.taperThreshold = Math.max((this.maxHeight - this.maxWidth), (this.maxWidth / 2));

  this.startingCenterPoint = {
    // find width of each hex, multiply by maxWidth, then add dist between hexes * maxWidth-1, THEN divide in half
    x: left + (((this.hexSize.width * maxWidth) + (this.hexSize.hzDist * (maxWidth - 1))) / 2),
    y: top + this.hexSize.radius
  };
  this.render = function render() {

    // start at the top with one.
    // increment every time until you reach maxWidth
    // then return one less than max width
    // then go back up
    // until you need to start decrementing - how many steps will it take to get to 1 tile? maxWidth akshually
    // bug to feex - if the width is much larger than the height, it causes only one hex to render -- need to figure out what the actual maximum width for a particular width/height is.

    var numHexes = 1;
    for (var j = 1; j <= this.maxHeight; j++) {

      // if we're < stepsToMax steps away from maxHeight
      if (j > this.taperThreshold) {
        // keep making board smaller
        console.log(numHexes + " hexes wide, tapering off");
        drawRow(this.startingCenterPoint, numHexes, this.hexSize.radius, ctx);
        this.startingCenterPoint.x = this.startingCenterPoint.x + ((this.hexSize.radius * 2) * .75);
        numHexes--;

        // else if not at max width
      } else if (numHexes < this.maxWidth) {
        // keep making board larger
        console.log(numHexes + " hexes wide, making wider");
        drawRow(this.startingCenterPoint, numHexes, this.hexSize.radius, ctx);
        this.startingCenterPoint.x = this.startingCenterPoint.x - ((this.hexSize.radius * 2) * .75);
        numHexes++;
        
        // } else if we're at max width
      } else {
        // go one smaller
        console.log(numHexes + " hexes wide, going smaller");
        drawRow(this.startingCenterPoint, numHexes, this.hexSize.radius, ctx);
        numHexes--;
        this.startingCenterPoint.x = this.startingCenterPoint.x + ((this.hexSize.radius * 2) * .75);
      }
      this.startingCenterPoint.y = this.startingCenterPoint.y + (Math.sqrt(3) / 2 * (this.hexSize.radius * 2) / 2);
    }
  }

  // This function based off the 'http://www.redblobgames.com' hexagon guide. SUPER COOL GUIDE 12/10
  var getHexCorner = function getHexCorner(center, size, i) {
    var angleDegree = 60 * i;
    var angleRadius = Math.PI / 180 * angleDegree;
    return {
      x: center.x + size * Math.cos(angleRadius),
      y: center.y + size * Math.sin(angleRadius)
    }
  }

  var drawHex = function drawHex(hexCenter, size, ctx) {
    var hex = new Path2D();
    // get the coordinates of the first hex corner
    var initCoords = getHexCorner(hexCenter, size, 0)
      // Define where our path starts
    hex.moveTo(initCoords.x, initCoords.y);

    // 
    for (var i = 0; i < 7; i++) {
      var coords = getHexCorner(hexCenter, size, i);
      hex.lineTo(coords.x, coords.y);
    }
    ctx.fill(hex);
  }

  var drawRow = function drawRow(startingCenterPoint, numHexes, size, ctx) {
    var originalStartingX = startingCenterPoint.x;
    // draw out requested number o' hexagons
    for (var i = 0; i < numHexes; i++) {
      ctx.fillStyle = randColor();
      drawHex(startingCenterPoint, size, ctx);
      // moving center point to where our next hex should be drawn
      startingCenterPoint.x += (size * 3);
    }
    startingCenterPoint.x = originalStartingX;
  }
};

var randColor = (function randColor() {

  var demColors = [
    "rgb(186,14,29)",
    "rgb(40,70,75)",
    "rgb(50,103,113)",
    "rgb(44,140,153)",
    "rgb(47,147,160)",
    "rgb(51,163,178)",
    "rgb(66,217,200)",
    "rgb(117,249,234)",
  ]
  return function() {
    index = Math.floor(Math.random() * demColors.length)
    return demColors[index];
  };
}());

document.onload = draw();