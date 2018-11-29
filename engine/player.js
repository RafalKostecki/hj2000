const Player = (function() {
  let priv = new WeakMap();
  let _ = function(instance) {return priv.get(instance)};


  function checkGainedPoints(char, point) {
    let gp = _(char).gainedPoints;

    for (let i=0; i<gp.length; i++) {
      if (point.id === gp[i]) return true;
    }
  }

  function checkEndPoint(char) {
    let endPoint = game.currentBoard.endPoint;

    if ((endPoint[0]+10 > char.A[0] && endPoint[0]+10 < char.B[0]) && (endPoint[1]-4 > char.D[1] && endPoint[1]-4 < char.A[1])) {
      char.canMove = false;

      if(!game.multiGame) game.endBoard();
    }

    if (game.multiGame && (!game.player.canMove && !game.player2.canMove)) game.endBoard();
  }

  return class extends Structure {
    constructor(style, width, height, x, y) {
      super(style, width, height, x, y)
      let privOptions = {
        gainedPoints: [],
        time: '-:--',
        min: 0,
        sec: 0,
        ms: 0,
		  };
      priv.set(this, privOptions);

      this.score = 0;
      this.gp = 0;
      this.isCrouching = false;
      this.canMove = true;
    };

    crouch(run) {
      if ((this.isCrouching && run) || this.isJumping) return;

      switch(run) {
        case true: //Player wants to crouch
          this.changeShape(25, 30)
          this.changePosition(0, 10)
          this.isCrouching = true;
        break;
        case false: //Player wants to stand up
          this.changeShape(25, 40)
          this.changePosition(0, -10)
          this.isCrouching = false;
        break;
      }
    };

    climbingLadder(type) { //0-up, 1-down
      let ladders = game.currentBoard.ladders;

      for (let i=0; i<ladders.length; i++) {
        if ((this.B[0] + 6 >= ladders[i].left && this.A[0] -11 <= ladders[i].left) && (this.A[1]-1 <= ladders[i].bottom && this.D[1] >= ladders[i].top)) {
          this.collisionStruct = 0;
          this.onStruct = false;

          let xDebt = ladders[i].left - this.D[0] - 10;
          let yDebt = ladders[i].top - this.D[1];
          this.changePosition(xDebt, yDebt);

          for (let i=0; i<(yDebt*-1) /2.7; i++) {
            game.moveBoard(2, this);
          }
        }
      }
    };

    gainPoints() {
      if (this.gp===game.currentBoard.requiredPoints) {
        checkEndPoint(this);
        return;
      }
      let gainPoints = game.currentBoard.gainPoints;

      for (let i=0; i<gainPoints.length; i++) {
        let gainPointX = parseInt(gainPoints[i].gainPoint.style.left) + 10;
        let gainPointY = parseInt(gainPoints[i].gainPoint.style.top) + 10;

        if ((gainPointX > this.A[0] && gainPointX < this.B[0]) && (gainPointY > this.D[1] && gainPointY < this.A[1])) {
          if(!checkGainedPoints(this, gainPoints[i])) {
            this.score++;
            this.gp++;
            _(this).gainedPoints.push(gainPoints[i].id);
            gainPoints[i].gained(this)
            game.setStats(0, this, this.score);
          }
          else return;
        }
      }
    };

    timer(clear) {
      if (clear) {
        _(this).time = _(this).min + ":" + _(this).sec + ":" + _(this).ms;
        _(this).min = 0;
        _(this).sec = 0;
        _(this).ms = 0;
      }

      if (this.canMove) {
        _(this).ms++;
        if (_(this).ms > 99) {
          _(this).ms = 0;
          _(this).sec++;
        }
        else if(_(this).sec > 60) {
          _(this).sec = 0;
          _(this).min++;
        }
        _(this).time = _(this).min + ":" + _(this).sec + ":" + _(this).ms;
        setTimeout(()=> this.timer(), 100);
      }

      game.setStats(1, this, _(this).time)
    };

    clearGainedPoints() {
      _(this).gainedPoints = [];
    };

  }
})();

Object.assign(Player.prototype, char(10));
