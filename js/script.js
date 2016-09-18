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

var sourcePole,
    destinationPole,
    sourceMin,
    desinationMin,
    sourceArray,
    destinationArray;


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
  moveDisk : function(sourceArray, destinationArray) {
    console.log("initiate");
    destinationArray.unshift(sourceArray.shift());
    $(sourcePole).html('');
    $(destinationPole).html('');
    this.generateDisks(destinationArray);
    this.generateDisks(sourceArray);
  },
  generateDisks : function(array) {
    console.log("generate");
    console.log(array);
    for (i = 0; i < array.length; i++) {
      var newDisk;
      newDisk = $('<div></div>').addClass('disk');
      switch (array[i]) {
        case 1 :
          newDisk.addClass('size-one');
          break;
        case 2 :
          newDisk.addClass('size-two');
          break;
        case 3 :
          newDisk.addClass('size-three');
          break;
        case 4 :
          newDisk.addClass('size-four');
          break;
        case 5 :
          newDisk.addClass('size-five');
          break;
      };
      switch(i) {
        case 0 :
          newDisk.addClass('level-five');
          break;
        case 1 :
          newDisk.addClass('level-four');
          break;
        case 2 :
          newDisk.addClass('level-three');
          break;
        case 3 :
          newDisk.addClass('level-two');
          break;
        case 4 :
          newDisk.addClass('level-one');
          break;
      };
      console.log(newDisk);
      if (array == sourceArray) {
        console.log('source array');
        $(sourcePole).prepend(newDisk);
      } else {
        console.log('destination array');
        $(destinationPole).prepend(newDisk);
      }
    };
  },
  checkForWin : function() {

  }
};

poles.on('click', function() {
  var pole = this;
  if (poleIsSelected == true) {
    towers.setDestinationPole(pole);
  } else {
    towers.setSourcePole(pole);
  }
  poleIsSelected = !poleIsSelected;
});
