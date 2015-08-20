
var Hex = function Hex (x,y,z) {
  var x = x || null;
  var y = y || null;
  var z = z || null;

  return {x: x, y: y, z: z}
};

var Map = function Map (maxCols, maxRows) {
  var numHexes = 1;
  var mapArray = [];

  for (var i = 0; i < maxRows; i++) {
    var newRow = [];

    for (var j = 0; j < maxCols; j++) {
      
    }
    mapArray.push(newRow);
  }

  return mapArray;
}
