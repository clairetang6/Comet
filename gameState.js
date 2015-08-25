var gameState = new Kiwi.State('gameState');

gameState.preload = function() {
	Kiwi.State.prototype.preload.call(this);
	this.addSpriteSheet('hero_spritesheet', 'assets/hero/hero_spritesheet.png', 232, 220);
	
	this.addImage('sun1', 'assets/suns/sun_red2_242.png')
	this.addImage('sparkParticle', 'assets/sparks/spark_particle_1.png')
	this.addImage('planet1', 'assets/planets/rock_13_118.png');
	this.addImage('meteorite', 'assets/sparks/met_1.png');
	this.addImage('redSpark', 'assets/sparks/red_fire_spark.png');
}

gameState.create = function() {
	Kiwi.State.prototype.create.call(this);
	
	this.random = this.game.rnd;
	this.heros = ['blue', 'fire', 'apple']
	this.heroIndex = 0;
	
	
	this.sun = new Sun(this, 200, 200, 1, 'sun1');
	this.hero = new Hero(this, 100, 100, 'fire');
	this.planet = new Planet(this, this.sun, 'planet1');
	
	this.backgroundSparkParticles = new Kiwi.Group(this);
	for (var i = 0; i < 100; i++){
		this.backgroundSparkParticles.addChild(new SparkParticle(this, true));
	}
	
	this.foregroundSparkParticles = new Kiwi.Group(this);
	for (var i = 0; i < 7; i++){
		this.foregroundSparkParticles.addChild(new SparkParticle(this, false));
	}	
	
	this.meteor = new Meteor(this);
	
	
	this.pauseKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.P);
	this.debugKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.I);
	this.dieKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.game.input.keyboard.onKeyDown.add(this.onKeyDownCallback, this);
	
	this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
	this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
	this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
	this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);	


	this.addChild(this.backgroundSparkParticles);
	this.addChild(this.meteor);

	this.addChild(this.sun);
	this.addChild(this.planet);
	this.addChild(this.hero);	
	this.addChild(this.foregroundSparkParticles);
}


gameState.update = function() {
	Kiwi.State.prototype.update.call(this);
}

gameState.updateHacked = function() {
	Kiwi.State.prototype.update.call(this);
}
gameState.onKeyDownCallback = function(keyCode){
	if(keyCode == this.debugKey.keyCode){
		gameState.updateHacked();
	}
	
	if(keyCode == this.dieKey.keyCode){
		this.hero.die();
	}
}