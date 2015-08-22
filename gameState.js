var gameState = new Kiwi.State('gameState');

gameState.preload = function() {
	Kiwi.State.prototype.preload.call(this);
	this.addSpriteSheet('hero_spritesheet', 'assets/hero/hero_spritesheet.png', 232, 200);
	
	this.addImage('sun1', 'assets/suns/sun_red2_242.png')
	this.addImage('sparkParticle', 'assets/sparks/spark_particle_1.png')
}

gameState.create = function() {
	Kiwi.State.prototype.create.call(this);
	
	this.random = this.game.rnd;
	
	
	this.sun = new Sun(this, 200, 200, 1, 'sun1');
	this.hero = new Hero(this, 100, 100);
	
	this.sparkParticles = new Kiwi.Group(this);
	for (var i = 0; i < 100; i++){
		this.sparkParticles.addChild(new SparkParticle(this));
	}
	
	this.pauseKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.P);
	this.debugKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.I);
	
	this.game.input.keyboard.onKeyDown.add(this.onKeyDownCallback, this);
	
	this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
	this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);	

	this.particle = new SparkParticle(this);
	this.addChild(this.sparkParticles);
	this.addChild(this.particle);
	this.addChild(this.sun);
	this.addChild(this.hero);	
}


gameState.update = function() {
	Kiwi.State.prototype.update.call(this);
}

gameState.onKeyDownCallback = function(keyCode){
	if(keyCode == this.debugKey.keyCode){
		this.hero.animation.play('death');
	}
}