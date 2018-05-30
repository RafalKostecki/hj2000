const GainPoint = (function() {
  let priv = new WeakMap();
  let _ = function(instance) {return priv.get(instance)};
  let gameBoard = document.getElementById('gameBoard');
  let idCounter = 0;


  function destroy(point) {
    let id = 'gainPoint' + point.id;
    document.getElementById(id).remove()
    let array = game.currentBoard.gainPoints;
    let index = array.indexOf(point)
    array.splice(index, 1)
  }

  function setStyle(point, style='gainPoint gainPoint--style') {
    point.gainPoint.className = style;

    if ((game.multiGame && _(point).gained===2) || (!game.multiGame && _(point).gained===1)) destroy(point);
  }


  return class {
    constructor() {
      let privOptions = {
				gained: 0
			};
      priv.set(this, privOptions);

      this.gainPoint = document.createElement('div');
      this.id = idCounter;
      this.gainPoint.id = 'gainPoint' + this.id;
      idCounter++;
    };

    gained(char) {
      let charContainsClass = char.struct.classList.contains('player--first');
      let id = charContainsClass ? 0 : 1;
      let style;
      _(this).gained++;

      if (id === 0) {
        style = 'gainPoint gainPoint--style gainPoint--second';
      }
      else if (id === 1) {
        style = 'gainPoint gainPoint--style gainPoint--first';
      }
      else throw new Error('Indicated invalid char.id!')

      if (style) setStyle(this, style);
    };

    create(x, y) {
      setStyle(this);
      this.gainPoint.style.left = x;
      this.gainPoint.style.top = y;
      gameBoard.appendChild(this.gainPoint);
    };

  }
}());
