const Game = (function() { //Singleton
  let gameBoard = document.getElementById('gameBoard');
  let gameWindow = document.getElementById('gameWindow');
  let gameWrapper = document.getElementById('gameWrapper');
  let gameArt = document.getElementById('gameArt');
  let gameFrame = document.getElementById('game');

  let instance;

  function changePosition(type, char, wDebt, hDebt, ladder) {
    switch(type) {
      case 0: //Left
        if ((gameBoard.offsetLeft >= 0) || (char.A[0]-wDebt > gameWindow.clientWidth/2)) return;

        gameBoard.style.left = gameBoard.offsetLeft + 5;
      break;
      case 1: //Right
        if ((gameBoard.offsetLeft <= wDebt*-1) || (char.B[0] < gameWindow.clientWidth/2)) return;

        gameBoard.style.left = gameBoard.offsetLeft - 5;
      break;
      case 2: //up
        if ((gameBoard.offsetTop >= 0) || (char.D[1] > gameWindow.clientHeight/1)) return;

        gameBoard.style.top = gameBoard.offsetTop + 2;
      break;
      case 3: //down
        if ((gameBoard.offsetTop <= hDebt*-1) || (char.A[1] < gameWindow.clientHeight/2)) return;

        gameBoard.style.top = gameBoard.offsetTop - 2;
      break;
      case 4: //jump
        if ((gameBoard.offsetTop <= hDebt*-1) || (char.A[1] < gameWindow.clientHeight/2)) return;

        gameBoard.style.top = gameBoard.offsetTop - 2;
      break;
    }
  };

  function isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  };

  function detectMobileDevice() {
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)){
      return true;
    }
    else {
      return false;
    }
  };

  return class {
    constructor() {
      if (instance) return instance;
      instance = this;

      this.start = false;

      this.multiGame;
      this.currentLvl = 0;
      this.currentBoard;
      this.collisionsSystem = new Collisions();

      this.player;
      this.playerControl;

      this.player2;
      this.player2Control;

      this.stop = false;
    };

    runGame(multiGame=false) {
      this.multiGame = multiGame;

      this.player = new Player('player player--style player--first');
      this.playerControl = new PlayerControl();

      if (this.multiGame) {
        this.player2 = new Player('player player--style player--second')
        this.player2Control = new PlayerControl();
      }
      else if (!this.multiGame && this.player2) {
        this.player2 = undefined;
        this.player2Control = undefined;
      }

      this.run();
    };

    run() {
      this.start = true;

      this.currentBoard = new Board(this.currentLvl);
      this.currentBoard.createBoard();

      gameBoard.style.top = 0;
      gameBoard.style.left = 0;

      this.player.canMove = true;
      this.player.timer();

      if (this.multiGame) {
        this.player2.canMove = true;
        this.player2.timer();
      }
    };

    setStats(stats, char, value) {
      if (game.stop) return;
    //  console.log(char)
      let charContainsClass = char.struct.classList.contains('player--first');
      let id = charContainsClass ? 0 : 1;

      switch(stats) {
        case 0: //Points
          document.getElementById('pointsPlayer'+id).innerHTML = value;
        break;
        case 1: //Time
          document.getElementById('timePlayer'+id).innerHTML = value;
        break;
      }
    };

    endBoard() {
      if (!this.start) return;

      document.getElementsByClassName('barrier').remove();
      document.getElementsByClassName('endPoint').remove();
      document.getElementsByClassName('gainPoint').remove();
      document.getElementsByClassName('ladder').remove();
      if (this.multiGame) {
        this.player2.clearGainedPoints();
        this.player2.gp = 0;
      }
      this.player.clearGainedPoints();
      this.player.gp = 0;

      this.currentLvl++;
      if (this.currentLvl >= this.currentBoard.quantityOfLvls) {
        this.endGame();
      }
      else this.run();
    };

    endGame() {
      alert('The end!')
      this.start = false;

      if (this.multiGame) {
        this.player2.canMove = false;
        this.player2.timer(true);
        this.player2.score = 0;
      }

      this.player.canMove = false;
      this.player.timer(true);
      this.player.score = 0;
      this.currentLvl = 0;
      document.getElementsByClassName('player').remove();
    };

    moveBoard(type, char) {
      let charContainsClass = char.struct.classList.contains('player--first');
      if (!charContainsClass) return; //Prevent move board by two players

      let widthDebt = gameBoard.clientWidth-gameWindow.offsetWidth;
      let heightDebt = gameBoard.clientHeight-gameWindow.clientHeight;

      if (isInt(widthDebt) && isInt(heightDebt)) changePosition(type, char, widthDebt, heightDebt)
      else throw new Error('Debet cannot has different type than integer.');

    };

    setWindow() {
      let width = Board.prototype.theSmallestSize(0);
      let height = Board.prototype.theSmallestSize(1);
      let windowHeight = window.visualViewport.height;
      let titleHeight = document.getElementById('title').offsetHeight;

      gameArt.style.maxWidth = width;
      gameWrapper.style.maxWidth = width;
      gameWindow.style.width = gameArt.clientWidth - 6;

      if (windowHeight < height) {
        gameFrame.style.height = windowHeight - titleHeight;
        gameWindow.style.height = windowHeight - titleHeight - 6;
      }

      if(detectMobileDevice()) {
        let twoBtn = document.getElementById('startTwo');
        let controlMobile = document.getElementById('controlMobile');
        twoBtn.remove();

        controlMobile.classList.toggle('controlMobile--hidden');
      }
    };

  } //The end off class
}());
