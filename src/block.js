const THREE = require('three');
const { TweenLite } = require('../lib/TweenLite');

const config = require('./config');

class Block {
  constructor(lastBlock) {
    console.log(lastBlock);

    this.AXIS = (Math.round(Math.random())) ? "x" : "z";

    this.MOVE_AMOUNT = Math.round(Math.random() * 10) + 20;

    this.dimension = {};

    this.position = {};

    const blockConfig = config.block;

    // set the dimensions from the target block, or defaults.
    this.dimension.width = (lastBlock) ? lastBlock.dimension.width : blockConfig.initWidth;
    this.dimension.height = (lastBlock) ? lastBlock.dimension.height : blockConfig.initHeight;
    this.dimension.depth = (lastBlock) ? lastBlock.dimension.depth :  blockConfig.initDepth;

    this.position.x = (this.AXIS === "x") ? this.MOVE_AMOUNT : (lastBlock) ? lastBlock.position.x : 0;
    this.position.y = (lastBlock) ? lastBlock.position.y + this.dimension.height : this.dimension.height;
    this.position.z = (this.AXIS === "z") ? this.MOVE_AMOUNT : (lastBlock) ? lastBlock.position.z : 0;

    this.colorOffset = Math.round(Math.random() * 100);

    // set color
    this.color = new THREE.Color(Math.random() * 0xffffff);

    // set direction
    let speed = blockConfig.initSpeed + blockConfig.acceleration;
    speed = Math.min(speed, blockConfig.maxSpeed);
    this.speed = -speed;
    this.direction = this.speed;

    // create block
    let geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2,
      this.dimension.height / 2, this.dimension.depth / 2));
    this.material = new THREE.MeshToonMaterial({
      color: this.color,
      shading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(this.position.x,
      this.position.y, this.position.z);
  }

  reverseDirection() {
    this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
  }

  resetBlock(){
    var Block = this;
    TweenLite.to(Block.position, .2, {
      x : 0,
      z : 0
    });

    TweenLite.to(Block.mesh.position, .2, {
      x : 0,
      z : 0,
      onComplete: ()=>{
        Block.MOVE_AMOUNT = 0;
      }
    })
  }

  hideBlock(delay){
    var Block = this; 
    //Block.mesh.scale.set(0,0,0);
    TweenLite.to(Block.mesh.scale, delay, { x: 0, y: 0, z: 0 });
    TweenLite.to(Block, delay, { opacity: 0});
  }

  tick() {
    let value = (this.AXIS === "x") ? this.position.x : this.position.z;

    if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT) {
      this.reverseDirection();
    }

    if(this.AXIS === "x"){
      this.position.x += this.direction;
      this.mesh.position.x = this.position.x;
    }else{
      this.position.z += this.direction;
      this.mesh.position.z = this.position.z;
    }    
  }
}

module.exports = Block;
