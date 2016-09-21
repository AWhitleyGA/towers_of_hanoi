var poles = $('div.pole'),
    poleOneDisplay = $('#pole-one'),
    poleTwoDisplay = $('#pole-two'),
    poleThreeDisplay = $('#pole-three'),
    disks = $('div.disk'),
    startButton = $('button.play'),
    starterPoleDisplay = '';
    timerDisplay = $('div.timer p');


var poleOne = [],
    poleTwo = [1, 2, 3, 4, 5],
    poleThree = [],
    diskOne = 1,
    diskTwo = 2,
    diskThree = 3,
    diskFour = 4,
    diskFive = 5;

var poleIsSelected = false,
    timerOn = false,
    time = 0,
    moves = 0,
    timeInMinutes,
    timerId;

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
    moves = 0;
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
      this.moveDisk(sourceArray, destinationArray);
    } else {
      console.log('against rules');
      $(sourcePole).children('.disk').find('div.pointer').hide();
      $(sourcePole).children('.disk').last().removeClass('selected');
      $(destinationPole).find('#ghost').remove();
    };
  },
  placeGhostDisk : function(ghostPole) {
    var ghostDisk = $(sourcePole).children('.disk').last().clone();
    $(ghostDisk).attr('id', 'ghost');
    var ghostLevel = $(ghostPole).children().length;
    switch (ghostLevel) {
      case 1 :
        $(ghostDisk).css('bottom', '0%');
        break;
      case 2 :
        $(ghostDisk).css('bottom', '15%');
        break;
      case 3 :
        $(ghostDisk).css('bottom', '30%');
        break;
      case 4 :
        $(ghostDisk).css('bottom', '45%');
        break;
      case 5 :
        $(ghostDisk).css('bottom', '60%');
        break;
    };
    $(ghostDisk).html('');
    $(ghostDisk).css('opacity', '0.3');
    $(ghostPole).prepend(ghostDisk);
  },
  moveDisk : function(sourceArray, destinationArray) {
    destinationArray.unshift(sourceArray.shift());
    $(sourcePole).html('').append('<div class="stem"></div>');
    $(destinationPole).html('').append('<div class="stem"></div>');
    moves += 1;
    $('.moves p').text('Moves: '+moves);
    this.generateDisks(destinationArray);
    this.generateDisks(sourceArray);
    this.checkForWin();
  },
  generateDisks : function(array) {
    var disksGenerated;
    for (i = array.length-1; i >= 0 ; i--) {
      var newDisk;
      newDisk = $('<div><div class="pointer"><img class="selector-left" src="images/selector-icon.svg"><img class="selector-right" src="images/selector-icon.svg"></div></div>').addClass('disk');
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
      if (array == starterArray) {
        $(starterPoleDisplay).append(newDisk);
      } else if (array == sourceArray) {
        $(sourcePole).append(newDisk);
      } else {
        $(destinationPole).append(newDisk);
      };
    };
  },
  timer : function() {
    timerOn = !timerOn;
    if (timerOn == true) {
        timerId = setInterval(function() {
        time += 1;
        var h = Math.floor(time / 3600);
        var m = Math.floor(time % 3600 / 60);
        var s = Math.floor(time % 3600 % 60);
        timeInMinutes = ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
        timerDisplay.text(timeInMinutes);
        console.log('timerlog');
      }, 1000);
    } else {
      clearInterval(timerId);
    }
  },
  checkForWin : function() {
    if (poleOne.length == 5 || poleThree.length == 5) {
      $('div.notification').find('div.notification-message').remove();
      $('div.notification').find('div.instructions').remove();
      $('div.notification').fadeIn(600);
      $('div.notification-text').html('Finished!');
      $('button.play').text('Play Again');
      var medal;
      if(time <= 60) {
        medal = "gold";
      } else if (time <= 120) {
        medal = "silver";
      } else if (time <= 180) {
        medal = "bronze";
      } else {
        medal = "none";
      };
      message = $('<div class="notification-message"><img src="images/'+medal+'-medal.png"></div>');
      $('div.notification').append(message);
      towers.timer();
      time = 0;
    }
  }
};
poles.on('click', function() {
  var pole = this;
  if (poleIsSelected == true) {
    towers.setDestinationPole(pole);
  } else {
    towers.setSourcePole(pole);
    $(this).children('.disk').last().addClass('selected');
    $(this).children('.disk').last().find('div.pointer').show();
  }
  poleIsSelected = !poleIsSelected;
});
poles.mouseenter(function() {
  if (poleIsSelected == false) {
    $(this).children('.disk').last().find('div.pointer').show();
  } else if (this != sourcePole) {
    towers.placeGhostDisk(this);
  }
})

poles.mouseleave(function() {
  if ($(this).children('.disk').last().hasClass('selected') == false) {
    $(this).children('.disk').last().find('div.pointer').hide();
  };
    $(this).find('#ghost').remove();
});

startButton.on('click', function() {
  towers.timer();
  towers.beginGame();
});
