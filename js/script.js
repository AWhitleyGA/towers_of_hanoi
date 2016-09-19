var poles = $('div.pole');
    poleOneDisplay = $('#pole-one'),
    poleTwoDisplay = $('#pole-two'),
    poleThreeDisplay = $('#pole-three'),
    disks = $('div.disk'),
    startButton = $('button.play'),
    starterPoleDisplay = '';


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
    starterArray,
    sourceArray,
    destinationArray;


var towers = {
  beginGame : function() {
    $('div.notification').fadeOut(600);
    poleOne = [];
    poleTwo = [1, 2, 3, 4, 5];
    poleThree = [];
    starterArray = poleTwo;
    starterPoleDisplay = $('#pole-two');
    $('div.pole').html('<div class="stem"></div>');
    towers.generateDisks(starterArray);
  },
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
    $(sourcePole).html('').append('<div class="stem"></div>');
    $(destinationPole).html('').append('<div class="stem"></div>');
    this.generateDisks(destinationArray);
    this.generateDisks(sourceArray);
  },
  generateDisks : function(array) {
    console.log("generate");
    console.log(array);
    var disksGenerated;
    for (i = array.length-1; i >= 0 ; i--) {
      var newDisk;
      newDisk = $('<div><div class="pointer"></div></div>').addClass('disk');
      switch(i) {
        case (array.length-1) :
          newDisk.addClass('level-five');
          break;
        case (array.length-2) :
          newDisk.addClass('level-four');
          break;
        case (array.length-3) :
          newDisk.addClass('level-three');
          break;
        case (array.length-4) :
          newDisk.addClass('level-two');
          break;
        case (array.length-5) :
          newDisk.addClass('level-one');
          break;
      };
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
      console.log(newDisk);
      if (array == starterArray) {
        console.log('starter array');
        $(starterPoleDisplay).append(newDisk);
      } else if (array == sourceArray) {
        console.log('source array');
        $(sourcePole).append(newDisk);
        this.checkForWin();
      } else {
        console.log('destination array');
        $(destinationPole).append(newDisk);
        this.checkForWin();
      };
    };

  },
  checkForWin : function() {
    if (poleOne.length == 5 || poleThree.length == 5) {
      $('div.notification').fadeIn(600);
      $('div.notification-text').html('Finished!');
      $('button.play').text('Play Again');
    }
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
startButton.on('click', towers.beginGame);
