var gameState = new Kiwi.State('gameState');

gameState.preload = function() {
	Kiwi.State.prototype.preload.call(this);
	this.addSpriteSheet('hero_spritesheet', 'assets/hero/hero_spritesheet.png', 232, 220);
	
	this.addImage('sparkParticle', 'assets/sparks/spark_particle_1.png')
	this.addImage('meteorite', 'assets/sparks/met_1.png');
	this.addImage('redSpark', 'assets/sparks/red_fire_spark.png');
	
	this.addTextureAtlas('sun', 'assets/sun_spritesheet.png', 'sunJSON', 'assets/sun_spritesheet.json');
	this.addTextureAtlas('ring', 'assets/ring_spritesheet.png', 'ringJSON', 'assets/ring_spritesheet.json');
	this.addTextureAtlas('rock85', 'assets/rock85_spritesheet.png', 'rock85JSON', 'assets/rock85_spritesheet.json');
	this.addTextureAtlas('rock118', 'assets/rock118_spritesheet.png', 'rock118JSON', 'assets/rock118_spritesheet.json');
	this.addTextureAtlas('gas', 'assets/gas_spritesheet.png', 'gasJSON', 'assets/gas_spritesheet.json');
	this.addTextureAtlas('moon', 'assets/moon_spritesheet.png', 'moonJSON', 'assets/moon_spritesheet.json');
		
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
	
	this.meteor = new Meteor(this);
	
	this.score = 0;
	this.scoreCounter = new Kiwi.GameObjects.TextField(this, this.score, 0, 0, "#ffffff");
	
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


	this.addChild(this.backgroundSparkParticles);
	this.addChild(this.meteor);
	for(var i = 0; i < this.solarSystems.length; i++){
		this.addChild(this.solarSystems[i]);
		this.solarSystems[i].addDebugCircles();
	}
	this.addChild(this.hero);
	this.debugGroup.addChild(this.hero.comet.components.getComponent('CircleCollider').debugCircle);
	this.addChild(this.foregroundSparkParticles);
	
	this.addChild(this.debugGroup);
	this.addChild(this.scoreCounter);
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
		this.scoreCounter.text = this.score;
		this.score += 1;
		
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
		gameState.updateHacked();
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