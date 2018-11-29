const Ladder = (function() {
  const gameBoard = document.getElementById('gameBoard');

  return class {
    constructor() {
      this.div = document.createElement('div');
      this.div.className = 'ladder ladder--style';
    };

    createLadder(left, top, height) {
      this.div.style.left = left;
      this.div.style.top = top;
      this.div.style.height = height;
      gameBoard.appendChild(this.div);
    };

    get top() { //point A[x,y]
        return parseInt(this.div.style.top);
    };

    get bottom() { //point A[x,y]
        return (parseInt(this.div.style.top) + parseInt(this.div.style.height));
    };

    get left() { //point A[x,y]
        return parseInt(this.div.style.left);
    };

  }
})();
