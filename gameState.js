var gameState = new Kiwi.State('gameState');

gameState.preload = function() {
	Kiwi.State.prototype.preload.call(this);
	this.addSpriteSheet('hero_spritesheet', 'assets/hero/hero_spritesheet.png', 232, 220);
	
	this.addSpriteSheet('plasma_spritesheet', 'assets/plasma_spritesheet.png', 75, 75);
	this.addSpriteSheet('digits_white_spritesheet', 'assets/digits_white.png', 41, 59);
	
	this.addImage('meteorite', 'assets/sparks/met_1.png');
	this.addImage('redSpark', 'assets/sparks/red_fire_spark.png');
	
	this.addTextureAtlas('sun', 'assets/sun_spritesheet.png', 'sunJSON', 'assets/sun_spritesheet.json');
	this.addTextureAtlas('ring', 'assets/ring_spritesheet.png', 'ringJSON', 'assets/ring_spritesheet.json');
	this.addTextureAtlas('rock85', 'assets/rock85_spritesheet.png', 'rock85JSON', 'assets/rock85_spritesheet.json');
	this.addTextureAtlas('rock118', 'assets/rock118_spritesheet.png', 'rock118JSON', 'assets/rock118_spritesheet.json');
	this.addTextureAtlas('gas', 'assets/gas_spritesheet.png', 'gasJSON', 'assets/gas_spritesheet.json');
	this.addTextureAtlas('moon', 'assets/moon_spritesheet.png', 'moonJSON', 'assets/moon_spritesheet.json');

	this.addAudio('song1', ['assets/sounds/galactic_2.ogg', 'assets/sounds/galactic_2.mp3']);

}

gameState.create = function() {
	Kiwi.State.prototype.create.call(this);
	
	this.random = this.game.rnd;
	this.heros = ['blue', 'fire', 'apple']
	this.heroIndex = 0;
	
	this.hero = new Hero(this, 100, 100, 'fire');
	
	this.solarSystems = [];
	for(var i = 0; i < 5; i++){
		console.log(this.game.stage.width);
		this.solarSystems.push(new SolarSystem(this, this.game.stage.width + 2000, 100))
	}
	this.solarIndex = 0;
	
	
	this.backgroundSparkParticles = new Kiwi.Group(this);
	for (var i = 0; i < 100; i++){
		this.backgroundSparkParticles.addChild(new SparkParticle(this, true));
	}
	
	this.foregroundSparkParticles = new Kiwi.Group(this);
	for (var i = 0; i < 7; i++){
		this.foregroundSparkParticles.addChild(new SparkParticle(this, false));
	}
	
	this.nebulaGroup = new Kiwi.Group(this);
	this.nebulaGroup.lastNebulaY = 0;
	this.nebulaGroup.lastNebulaChange = 'up';
	for(var i = 1; i <=6; i++){
		var index = i%3+1
		var nebula = new Nebula(this, 'nebula' + index, this.game.stage.width + (i-1) * this.game.stage.width/3);
		this.nebulaGroup.addChild(nebula);
	}
	for(var i = 0; i < this.nebulaGroup.members.length; i++){
		this.nebulaGroup.members[i].setYPosition();
	}
		
	this.meteor = new Meteor(this);
	
	this.plasmaGroup = new Kiwi.Group(this);
	this.plasmaGroup.addChild(new Plasma(this, 'red'));
	
	this.score = 0;
	this.scoreCounter = new ScoreCounter(this);
	
	this.debugGroup = new Kiwi.Group(this);
	
	
	this.pauseKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.P);
	this.debugKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.I);
	this.dieKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	
	this.aKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.zKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.Z);
	this.hKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.H);
	this.debugSpeedIndex = 0;
	this.debugSpeed = 1; 
	
	this.isPaused = false;
		
	this.game.input.keyboard.onKeyDown.add(this.onKeyDownCallback, this);
	
	this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
	this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
	this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
	this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);	

	this.addChild(this.nebulaGroup);
	this.addChild(this.backgroundSparkParticles);
	this.addChild(this.meteor);
	for(var i = 0; i < this.solarSystems.length; i++){
		this.addChild(this.solarSystems[i]);
		this.solarSystems[i].addDebugCircles();
	}
	this.addChild(this.hero);
	this.debugGroup.addChild(this.hero.comet.components.getComponent('CircleCollider').debugCircle);

	this.addChild(this.foregroundSparkParticles);
	
	this.addChild(this.plasmaGroup);
	
	this.debugGroup.visible = false;
	this.addChild(this.debugGroup);
	this.addChild(this.scoreCounter);
	
	this.backgroundMusic = new Kiwi.Sound.Audio( this.game, 'song1', 0.3, true );
	this.backgroundMusic.play();
}


gameState.update = function() {
	if(this.isPaused){
		this.debugSpeedIndex = 1;
	}
	
	if(this.debugSpeedIndex == 0){	
		Kiwi.State.prototype.update.call(this);
		
		if(!this.hero.isAlive){
			this.score = 0;
		}
		this.scoreCounter.setValue(this.score);
		
		var solarSystemMoving = false;
		for(var i = 0; i < this.solarSystems.length; i++){
			if ( this.solarSystems[i].moving){
				solarSystemMoving = true;
			}
		}
		
		if(!solarSystemMoving){
			this.solarSystems[this.solarIndex].moving = true;
			this.solarSystems[this.solarIndex].movingOffscreen = true;
			this.solarIndex = this.solarIndex + 1;
			if(this.solarIndex >= this.solarSystems.length){
				this.solarIndex = 0;
			}
		}

	}
	this.debugSpeedIndex = this.debugSpeedIndex + 1;				
	if(this.debugSpeedIndex > this.debugSpeed - 1){
		this.debugSpeedIndex = 0;
	}
}

gameState.updateHacked = function() {
	Kiwi.State.prototype.update.call(this);
	
	var solarSystemMoving = false;
	for(var i = 0; i < this.solarSystems.length; i++){
		if ( this.solarSystems[i].moving){
			solarSystemMoving = true;
		}
	}
	
	if(!solarSystemMoving){
		this.solarSystems[this.solarIndex].moving = true;
		this.solarSystems[this.solarIndex].movingOffscreen = true;
		this.solarIndex = this.solarIndex + 1;
		if(this.solarIndex >= this.solarSystems.length){
			this.solarIndex = 0;
		}
	}	
}

gameState.onKeyDownCallback = function(keyCode){
	if(keyCode == this.debugKey.keyCode){
		var bufferHalf = this.hero.buffer.slice(this.hero.bufferIndex + 1, this.hero.buffer.length);
		var bufferHalf2 = this.hero.buffer.slice(0, this.hero.bufferIndex);
		
		console.log(bufferHalf.concat(bufferHalf2));
	}
	
	if(keyCode == this.dieKey.keyCode){
		this.hero.die();
	}
	
	if(keyCode == this.aKey.keyCode){
		this.debugSpeed++; 
	}
	
	if(keyCode == this.zKey.keyCode){
		
		if(this.debugSpeed < 30){
			this.debugSpeed--;
		}else{
			this.debugSpeed -= 10;
		}
		if(this.debugSpeed < 1){
			this.debugSpeed = 1;
		}
	}
	
	if(keyCode == this.pauseKey.keyCode){
		this.isPaused = !this.isPaused;
		if(!this.isPaused){
			this.debugSpeed = 180;
		}
	}
	
	if(keyCode == this.hKey.keyCode){
		this.debugGroup.visible = !this.debugGroup.visible;
	}
}