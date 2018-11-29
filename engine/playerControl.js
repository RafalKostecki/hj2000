const PlayerControl = (function() { //Singleton
  let priv = new WeakMap();
  let _ = function(instance) {return priv.get(instance)};

  function addMobileControl() {
    const mobileMoveL = document.getElementById('mobileMoveL');
    const mobileMoveR = document.getElementById('mobileMoveR');
    const mobileMoveJ = document.getElementById('mobileMoveJ');
    const mobileMoveU = document.getElementById('mobileMoveU');
    const mobileMoveD = document.getElementById('mobileMoveD');

    mobileMoveL.addEventListener('touchstart', () =>
      game.playerControl.keyDown(game.player, 65));
    mobileMoveL.addEventListener('touchend', () =>
      game.playerControl.keyUp());
    mobileMoveR.addEventListener('touchstart', () =>
      game.playerControl.keyDown(game.player, 68));
    mobileMoveR.addEventListener('touchend', () =>
      game.playerControl.keyUp());
    mobileMoveJ.addEventListener('touchstart', () =>
      game.player.jump(game.player));
    mobileMoveU.addEventListener('touchstart', () =>
      game.player.climbingLadder());
    mobileMoveD.addEventListener('touchstart', () =>
      game.player.crouch(true));
    mobileMoveD.addEventListener('touchend', () =>
      game.player.crouch(false));
  };

  function operator(instance, char, type) {
    if (_(instance).ableToMove) { //Decrease invoked playerMove function
      if (game.collisionsSystem.movement(char, false)) _(instance).ableToMove = false;
    }

    _(instance).loopOperator = true;
    move(instance, char, type);
  };

  function move(instance, char, type) {
    if(!char.canMove || char.isJumping) return; //Disable move if player is jumping in this moment

    if (_(instance).currentType !== type && !_(instance).ableToMove) _(instance).ableToMove = true;
    else _(instance).currentType = type;

    if (_(instance).loopOperator && _(instance).startKey && type != undefined && game.start) {
      _(instance).loopOperator = false;

      if (_(instance).ableToMove) {
        char.move(type, char, 5);//Do step
        game.moveBoard(type, char);
      }

      setTimeout(() => operator(instance, char, type), 25); //Do next step after 0.025 sec
    }
  };


  return class {
    constructor() {
      let privOptions = {
				typeKey: null,
        loopOperator: true,
        startKey: null,
        ableToMove: true,
        currentType: null,
			};
      priv.set(this, privOptions);
    };

    addGameControl() {
      const startOneBtn = document.getElementById('startOne');
      const startTwoBtn = document.getElementById('startTwo');
      const giveUpBtn = document.getElementById('giveUpBoard');

      startOneBtn.addEventListener('click', () => {
        if (game.start) return;
        game.runGame(false);
      });
      if(startTwoBtn) {
        startTwoBtn.addEventListener('click', ()=> {
          if (game.start) return;
          game.runGame(true);
        });
      }
      giveUpBtn.addEventListener('click', ()=> {
        if (!game.endBoard) return;
        game.endBoard();
      });

      addMobileControl();
    };

    keyDown(char, eventCode) {
      _(this).startKey = true;

      switch(eventCode) {
        case 65:
        case 37:
          move(this, char, 0);
        break;
        case 68:
        case 39:
          move(this, char, 1);
        break;
      }

      _(this).typeKey = eventCode;
    };

    //If player pressed key of wasd or arrows on keyboard, the movement will be stopped
    keyUp(event) {
      _(this).startKey = false;
    };

  }
})();
