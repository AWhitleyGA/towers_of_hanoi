//variables to link html to javascript variable for use later
var poles = $('div.pole'),
    poleOneDisplay = $('#pole-one'),
    poleTwoDisplay = $('#pole-two'),
    poleThreeDisplay = $('#pole-three'),
    disks = $('div.disk'),
    startButton = $('button.play'),
    starterPoleDisplay = '';
    timerDisplay = $('div.timer p');

//arrays to track which poles have which disks throughout the game
var poleOne = [],
    poleTwo = [1, 2, 3, 4, 5],
    poleThree = [];

//variables to manipulate during game execution to be tested conditionally in later parts
var poleIsSelected = false,
    timerOn = false,
    time = 0,
    moves = 0,
    timeInMinutes,
    timerId;

//globally declared variables to allow for easy identification by all functions (makes scope easy)
var sourcePole,
    destinationPole,
    sourceMin,
    desinationMin,
    starterArray,
    sourceArray,
    destinationArray;

//towers object containing all core functionality
var towers = {
  //function that resets the poles and tracker variables to default start state
  beginGame : function() {
    $('div.notification').fadeOut(600);
    poleOne = [];
    poleTwo = [1, 2, 3, 4, 5];
    poleThree = [];
    starterArray = poleTwo;
    starterPoleDisplay = $('#pole-two');
    $('div.pole').html('<div class="stem"></div>');
    $('canvas').hide();
    moves = 0;
    towers.generateDisks(starterArray);
  },
  //triggered on pole clicks, sets which pole to move disk FROM
  setSourcePole : function(pole) {
    sourcePole = pole;
  },
  //triggered on pole clicks, sets which pole to deliver disk TO
  setDestinationPole : function(pole) {
    destinationPole = pole;
    this.checkRules(destinationPole); //initiate next stage
  },
  //triggered by click on destination pole; checks if move is allowed and initiates move if allowed
  checkRules : function(destinationPole) {
    //what pole is disk being removed from
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
    //what pole is disk being added to
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
    // RULES - is the move from source pole to destination pole allowed
    destinationMin = Math.min.apply(Math,destinationArray);
    sourceMin = Math.min.apply(Math,sourceArray);
    if (sourceMin < destinationMin) {
      this.moveDisk(sourceArray, destinationArray); //if so, initiate the move
    } else {  //otherwise do nothing but reset the UI disk selectors
      $(sourcePole).children('.disk').find('div.pointer').hide();
      $(sourcePole).children('.disk').last().removeClass('selected');
      $(destinationPole).find('#ghost').remove();
    };
  },
  //controls where to place the ghost(preview) disks when hovering over potential destination poles
  placeGhostDisk : function(ghostPole) {
    var ghostDisk = $(sourcePole).children('.disk').last().clone();
    $(ghostDisk).attr('id', 'ghost');
    var ghostLevel = $(ghostPole).children().length;
    switch (ghostLevel) {   //determines ghostDisk position (where the disk would potentially be placed)
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
    $(ghostDisk).html(''); //deactivates selector icons for ghostDisks
    $(ghostDisk).css('opacity', '0.3');
    $(ghostPole).prepend(ghostDisk);
  },
  //Function to handle internal logic of moving a disks (between the ARRAYS for each pole) and to trigger regeneration of arrays after moves AND check for win conditions
  moveDisk : function(sourceArray, destinationArray) {
    destinationArray.unshift(sourceArray.shift());
    $(sourcePole).html('').append('<div class="stem"></div>');
    $(destinationPole).html('').append('<div class="stem"></div>');
    moves += 1; //increments global move counter
    $('.moves p').text('Moves: '+moves);
    this.generateDisks(destinationArray); //regenerate destination pole with new disks
    this.generateDisks(sourceArray); //regenerate source pole with new disks
    this.checkForWin(); //check to see if user has won the game (all disks on new pole)
  },
  //Function to generate and display the disks for a given pole based on the array passed in
  generateDisks : function(array) {
    var disksGenerated;
    for (i = array.length-1; i >= 0 ; i--) {
      var newDisk;  //creates a new html element representing a disk
      newDisk = $('<div><div class="pointer"><img class="selector-left" src="images/selector-icon.svg"><img class="selector-right" src="images/selector-icon.svg"></div></div>').addClass('disk');
      switch(i) {   //checks to see what level (height from base) the disk should be based on the array value's INDEX
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
      switch (array[i]) { //checks to see how wide a disk should be based on the array value VALUE (number value)
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
      //conditional to test where the newly generated disk should go (tests what array was passed into the function)
      if (array == starterArray) {
        $(starterPoleDisplay).append(newDisk);
      } else if (array == sourceArray) {
        $(sourcePole).append(newDisk);
      } else {
        $(destinationPole).append(newDisk);
      };
    };
  },
  //Function to keep track of time in the game and display time to the UI; is triggered by the START button, deactivated when game is won
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
  //Fuction to check if user has successfully moved all disks to a new pole, is triggered by moveDisk
  checkForWin : function() {
    if (poleOne.length == 5 || poleThree.length == 5) {
      //Upon win, present the following html using the 'notification' div that was faded out at start of game
      $('div.notification').find('div.notification-message').remove();
      $('div.notification').find('div.instructions').remove();
      $('div.notification').fadeIn(600);
      $('div.notification-text').html('Finished!');
      $('button.play').text('Play Again');
      var medal; //creates new variable to determine if user qualified for a 'medal' based on their times
      if(time <= 60) {
        medal = "gold";
        message = $('<div class="notification-message"><img src="images/'+medal+'-medal.png"></div>');
      } else if (time <= 120) {
        medal = "silver";
        message = $('<div class="notification-message"><img src="images/'+medal+'-medal.png"></div>');
      } else if (time <= 180) {
        medal = "bronze";
        message = $('<div class="notification-message"><img src="images/'+medal+'-medal.png"></div>');
      } else {
        message = $('<div class="notification-message"></div>');
      };
      $('div.notification').append(message);
      if (time <= 180) { //if user got medal, queue the confetti!!!
        $('canvas').show();
      };
      towers.timer();
      time = 0;
    }
  }
};
//event listener for any clicks on poles that triggers pole selection functions and sets UI selector icon
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

//event listener for mousing over poles that indicates which disk would be selected (triggers placeGhostDisk)
poles.mouseenter(function() {
  if (poleIsSelected == false) {
    $(this).children('.disk').last().find('div.pointer').show();
  } else if (this != sourcePole) {
    towers.placeGhostDisk(this);
  }
})

//event listener for mousing out of poles that removes previously placed ghost disks
poles.mouseleave(function() {
  if ($(this).children('.disk').last().hasClass('selected') == false) {
    $(this).children('.disk').last().find('div.pointer').hide();
  };
    $(this).find('#ghost').remove();
});

//event listener linked to start button that resets the timer and triggers the beginGame sequence
startButton.on('click', function() {
  towers.timer();
  towers.beginGame();
});




//CODE BORROWED FROM CODEPEN THAT ANIMATES THE CONFETTI WHEN USER EARNS MEDAL
//CREATED BY HEMN CHOWRAKA
//SOURCE : https://iprodev.com/confetti-animation-javascript/

(function() {
  var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, i, range, resizeWindow, xpos;

  var confettiColors = {
    gold : [255, 225, 0],
    silver : [192, 192, 192],
    bronze : [205, 127, 50]
  };

  NUM_CONFETTI = 250;

  COLORS = [[255, 225, 0], [150, 150, 150], [255, 225, 0], [218, 165, 32], [218, 165, 32]];

  PI_2 = 2 * Math.PI;

  canvas = document.getElementById("world");

  context = canvas.getContext("2d");

  window.w = 0;

  window.h = 0;

  resizeWindow = function() {
    window.w = canvas.width = window.innerWidth;
    return window.h = canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeWindow, false);

  window.onload = function() {
    return setTimeout(resizeWindow, 0);
  };

  range = function(a, b) {
    return (b - a) * Math.random() + a;
  };

  drawCircle = function(x, y, r, style) {
    context.beginPath();
    context.arc(x, y, r, 0, PI_2, false);
    context.fillStyle = style;
    return context.fill();
  };

  xpos = 0.5;

  document.onmousemove = function(e) {
    return xpos = e.pageX / w;
  };

  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  Confetti = (function() {
    function Confetti() {
      this.style = COLORS[~~range(0, 5)];
      this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
      this.r = ~~range(2, 6);
      this.r2 = 2 * this.r;
      this.replace();
    }

    Confetti.prototype.replace = function() {
      this.opacity = 0;
      this.dop = 0.03 * range(1, 4);
      this.x = range(-this.r2, w - this.r2);
      this.y = range(-20, h - this.r2);
      this.xmax = w - this.r;
      this.ymax = h - this.r;
      this.vx = range(0, 2) + 8 * xpos - 5;
      return this.vy = 0.7 * this.r + range(-1, 1);
    };

    Confetti.prototype.draw = function() {
      var ref;
      this.x += this.vx;
      this.y += this.vy;
      this.opacity += this.dop;
      if (this.opacity > 1) {
        this.opacity = 1;
        this.dop *= -1;
      }
      if (this.opacity < 0 || this.y > this.ymax) {
        this.replace();
      }
      if (!((0 < (ref = this.x) && ref < this.xmax))) {
        this.x = (this.x + this.xmax) % this.xmax;
      }
      return drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
    };

    return Confetti;

  })();

  confetti = (function() {
    var j, ref, results;
    results = [];
    for (i = j = 1, ref = NUM_CONFETTI; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      results.push(new Confetti);
    }
    return results;
  })();

  window.step = function() {
    var c, j, len, results;
    requestAnimationFrame(step);
    context.clearRect(0, 0, w, h);
    results = [];
    for (j = 0, len = confetti.length; j < len; j++) {
      c = confetti[j];
      results.push(c.draw());
    }
    return results;
  };

  step();

}).call(this);
