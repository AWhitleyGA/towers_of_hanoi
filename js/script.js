var poles = $('div.pole');
    poleOneDisplay = $('#pole-one'),
    poleTwoDisplay = $('#pole-two'),
    poleThreeDisplay = $('#pole-three');
    disks = $('div.disk');


var poleOne = [],
    poleTwo = [1, 2, 3, 4, 5],
    poleThree = [],
    diskOne = 1,
    diskTwo = 2,
    diskThree = 3,
    diskFour = 4,
    diskFive = 5;

var poleIsSelected = false;

var sourcePole;
var destinationPole;
var sourceMin;
var desinationMin;
var sourceArray;
var destinationArray;


var towers = {
  setSourcePole : function(pole) {
    sourcePole = pole;
  },
  setDestinationPole : function(pole) {
    destinationPole = pole;
    this.checkRules(destinationPole);
  },
  checkRules : function(destinationPole) {
    switch ($(sourcePole).attr('id')) {
      case 'pole-one' :
        sourceArray = poleOne;
        break;
      case 'pole-two' :
        sourceArray = poleTwo;
        break;
      case 'pole-three' :
        sourceArray = poleThree;
        break;
    };
    switch ($(destinationPole).attr('id')) {
      case 'pole-one' :
      destinationArray = poleOne;
        break;
      case 'pole-two' :
      destinationArray = poleTwo;
        break;
      case 'pole-three' :
      destinationArray = poleThree;
        break;
    };
    destinationMin = Math.min.apply(Math,destinationArray);
    sourceMin = Math.min.apply(Math,sourceArray);
    if (sourceMin < destinationMin) {
      console.log("move disk");
      this.moveDisk(sourceArray, destinationArray);
    } else {
      console.log("against rules");
    };
  },
  moveDisk : function() {
    console.log("initiate");
  },
  checkForWin : function() {

  }
};

poles.on('click', function() {
  var pole = this;
  if (poleIsSelected == true) {
    towers.checkRules(pole);
  } else {
    towers.setSourcePole(pole);
  }
  poleIsSelected = !poleIsSelected;
});
