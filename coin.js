/* globals
  DivSugar
*/
var overlay = document.getElementById('overlay');

function showMoney() {
  document.getElementById('overlay').style.display = 'block';
  showCoins();
  setTimeout(() => {
    hideMoney();
  }, 6000);
  // same time as sound
}

function hideMoney() {
  document.getElementById('overlay').style.display = 'none';
}

function showCoins() {
  var scn = new DivSugar.Scene().setSize(1200, 600).setImage('').setOpacity(1).appendTo(overlay);

  // maximize the scene size
  function resize() {
    scn.adjustLayout(window.innerWidth, window.innerHeight, 'cover');
  }
  window.addEventListener('resize', resize, true);
  resize();

  // define an animation class which inherits the task class
  function Coin() {
    // call the base class's constructor
    this.constructor.uber.constructor();

    this.vec = new DivSugar.Vector();
    this.pos = new DivSugar.Vector(Math.random() * 800, 900, Math.random() * 800 - 1000);
    this.vel = new DivSugar.Vector(
      Math.random() * 6 - 3,
      Math.random() * 8 - 20,
      Math.random() * 6 - 3
    );
    this.rot = new DivSugar.Vector(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1);

    this.center = new DivSugar.Node()
      .setPosition(this.pos)
      .rotate(Math.random() * 360, Math.random() * 360, Math.random() * 360)
      .appendTo(scn);

    this.front = new DivSugar.Node()
      .setSize(200, 200)
      .setPosition(-100, -100, 0)
      .setBackface(false)
      .setImage('https://github.com/kitao/divsugar/raw/master/examples/assets/coin.png')
      .setImageClip(0, 0, 0.5, 1)
      .appendTo(this.center);

    this.back = new DivSugar.Node()
      .setSize(200, 200)
      .setPosition(100, -100, 0)
      .setBackface(false)
      .setImage('https://github.com/kitao/divsugar/raw/master/examples/assets/coin.png')
      .setImageClip(0.5, 0, 1, 1)
      .rotate(0, 180, 0)
      .appendTo(this.center);
  }

  DivSugar.inherit(Coin, DivSugar.Task);

  Coin.prototype.onUpdate = function () {
    this.vel.y += this.deltaTime * 0.01;
    this.pos.add(this.vec.set(this.vel).mul(this.deltaTime * 0.06));
    this.center
      .setPosition(this.pos)
      .rotate(
        this.deltaTime * this.rot.x,
        this.deltaTime * this.rot.y,
        this.deltaTime * this.rot.z
      );

    // when fall enough, destroy this task and create an another task
    if (this.pos.y > 1000) {
      this.destroy();
      new Coin().appendTo(DivSugar.rootTask);
    }
  };

  Coin.prototype.onDestroy = function () {
    scn.remove(this.center);
  };

  // create and register instances of the animation class
  for (var i = 0; i < 30; i++) {
    new Coin().appendTo(DivSugar.rootTask);
  }
}
