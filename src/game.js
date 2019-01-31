const Stage = require('./stage');
const Block = require('./block');

class Game {
  constructor() {
    this.STATES = {
      LOADING: 'loading',
      PLAYING: 'playing',
      PAUSED: 'paused',
      READY: 'ready',
      ENDED: 'ended',
      RESETTING: 'resetting'
    }

    this.sound = true;

    this.blocks = [];
    this.state = this.STATES.LOADING;

    this.stage = new Stage();

    this.mainContainer = document.getElementById('container');
    this.scoreContainer = document.getElementById('score');
    this.startButton = document.getElementById('start-button');
    this.instructions = document.getElementById('instructions');
    this.bgSound = document.getElementById('game-background-score');
    this.scoreContainer.innerHTML = '0';

    this.addBlock();
    this.tick();

    this.clearState();

    this.setState(this.STATES.READY);

    document.addEventListener('keydown', e => {
      if (e.keyCode === 32) { // Space
        this.playGame();
      } else if (e.keyCode === 27) { // Esc
        this.setState(this.STATES.PAUSED);
        this.bgSound.pause();
      }
    });

    document.addEventListener('click', e => {
      this.playGame();
    });

    document.addEventListener('touchend', e => {
      this.playGame();
    });
  }

  playGame() {
    switch (this.state) {
      case this.STATES.PAUSED:
        this.setState(this.STATES.PLAYING);
        if (this.sound) {
          this.bgSound.play();
        }
        break;
      case this.STATES.READY:
        this.setState(this.STATES.PLAYING);
        this.blocks[0].resetBlock();
        setTimeout(() => {
          this.addBlock();
        }, 100)
        if (this.sound) {
          this.bgSound.play();
        }
        break;
      case this.STATES.PLAYING:
        this.addBlock();
        break;
	  case this.STATES.ENDED:
		
      default:
        console.log("I have lost track");
    }
  }
  addBlock() {
    let lastBlock = this.blocks[this.blocks.length - 1];

    if (lastBlock && this.blocks.length > 1) {

      if (lastBlock["AXIS"] === "x") {
        lastBlock.dimension.width -= Math.abs(lastBlock["position"].x);
      } else {
        lastBlock.dimension.depth -= Math.abs(lastBlock["position"].z);
      }

      if (lastBlock.dimension.width < 0 || lastBlock.dimension.depth < 0) {
        //lastBlock.dimension.width = 0;
        //lastBlock.dimension.depth = 0;
        //lastBlock.resetBlock();
        this.setState(this.STATES.ENDED)
        this.resetGame();
        return;
      }

    }

    this.scoreContainer.innerHTML = String(this.blocks.length - 1);

    const newBlock = new Block(lastBlock);
    this.stage.add(newBlock.mesh);
    this.blocks.push(newBlock);

    this.stage.setCamera(this.blocks.length * 2);
  }

  tick() {
    if (this.state !== this.STATES.PAUSED && this.state !== this.STATES.ENDED) {
      this.blocks[this.blocks.length - 1].tick();
      this.stage.render();
    }
    requestAnimationFrame(() => {
      this.tick()
    });
  }

  setState(state) {
    this.clearState();
    this.mainContainer.classList.add(state);
    this.state = state;
  }

  clearState() {
    //Reset all state
    for (let key in this.STATES) {
      this.mainContainer.classList.remove(this.STATES[key]);
    }
  }

  resetGame() {
	var delay = 0.5;
    this.blocks.map(b => {
	  b.hideBlock(delay);
	  delay += 0.5;
	  this.stage.render();
	});	

	setInterval(()=>{
		this.stage.render();
	}, 10);

	this.stage.setCamera(0);
	
  }
}


module.exports = Game;
