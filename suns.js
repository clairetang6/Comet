var SparkParticle = function( state , forBackground){	
	Kiwi.GameObjects.Sprite.call( this, state, state.textures['sparkParticle'], state.game.stage.width + 100, 0, false);
	
	this.state = state;
	this.x = this.state.random.integerInRange(0, state.game.stage.width + 100);
	this.y = this.state.random.integerInRange(-100, state.game.stage.height);
	
	if(forBackground){
		this.scale = this.state.random.integerInRange(0, 50) / 100;
		this.speed = this.scaleX * 3;
	}else{
		this.scale = this.state.random.integerInRange(20, 50) / 80;
		this.speed = this.scaleX * 10;
	}

	
}
Kiwi.extend( SparkParticle, Kiwi.GameObjects.Sprite );

SparkParticle.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	
	this.x -= this.speed;

	if(this.x < -100){
		this.x = this.state.game.stage.width + 200;
		this.y = this.state.random.integerInRange(0, this.state.game.stage.height);	
	}
}

var Meteor = function( state ){
	Kiwi.Group.call(this, state);
	
	this.x = state.game.stage.width+100;
	var numberOfShadows = 40;
	for (var i = 0; i < numberOfShadows; i++){		
		var meteorShadow = new Kiwi.GameObjects.Sprite(state, state.textures['meteorite'], 0 + 2*i, 0, false);
		meteorShadow.scale = (1 - i/numberOfShadows) * 0.8; 
		meteorShadow.alpha = 1 - i/numberOfShadows;
		this.addChild(meteorShadow);
	}

	this.y = this.state.random.integerInRange(-100, state.game.stage.height);
	this.speed = 10;
}
Kiwi.extend( Meteor, Kiwi.Group );

Meteor.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	
	this.x -= this.speed;

	if(this.x < -100){
		this.x = this.state.game.stage.width + 200;
		this.y = this.state.random.integerInRange(0, this.state.game.stage.height);	
	}
}

var Planet = function( state, sun){
	var planetTypes = ['rock85', 'rock118', 'gas', 'ring']
	var numbersOfPlanets = [10, 54 ,20, 18];
	var randomPlanet = state.random.integerInRange(0, 3);
	var planetType = planetTypes[randomPlanet];
	var numberOfPlanets = numbersOfPlanets[randomPlanet];
	Kiwi.GameObjects.Sprite.call( this, state, state.textures[planetType], 0, 0, false);
	var planetNumber = state.random.integerInRange(0, numberOfPlanets-1);
	this.animation.switchTo(planetNumber);
	
	this.state = state;
	this.sun = sun;
	this.rotPointX = this.width * 0.5;
	this.rotPointY = this.height * 0.5;	
	
	this.center = new Kiwi.Geom.Point(0,0);
	this.center.x = this.width * 0.5;
	this.center.y = this.height * 0.5;
	
	//this.radius = 300;	
	//this.theta = 0; 
	var params = {owner: this, name: 'Orbiter', radius: 300, orbitee: sun, speed: -1};
	this.components.add(new OrbiterComponent(params));
	this.components.add(new CircleColliderComponent({owner: this, diameter: 100}));
	
}
Kiwi.extend( Planet, Kiwi.GameObjects.Sprite );

Planet.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.rotation += 0.02;
}

Planet.prototype.objType = function(){
	return 'Planet';
}

var Moon = function( state, planet){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['moon'], 0, 0, false);
	var moonNumber = state.random.integerInRange(0, 24);
	this.animation.switchTo(moonNumber);
	
	var params = {owner: this, name: 'Orbiter', radius: 120, orbitee: planet, speed: 4};
	this.components.add(new OrbiterComponent(params));	
	this.components.add(new CircleColliderComponent({owner: this, diameter: 100}));
}
Kiwi.extend( Moon, Kiwi.GameObjects.Sprite);

Moon.prototype.objType = function(){
	return 'Moon'
}

var Sun = function( state, x, y, scale){
	Kiwi.GameObjects.Sprite.call( this, state, state.textures['sun'], x, y, false);
	var sunNumber = state.random.integerInRange(0, 24);
	console.log(sunNumber);
	this.animation.switchTo(sunNumber);
	this.state = state;
	this.hero = this.state.hero;
	this.rotPointX = this.width * 0.5;
	this.rotPointY = this.height * 0.5;

	this.scaleX = scale;
	this.scaleY = scale;

	var params = {owner: this, diameter: 210};
	this.components.add(new CircleColliderComponent(params));
}
Kiwi.extend( Sun, Kiwi.GameObjects.Sprite );

Sun.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.rotation += 0.02;
}

Sun.prototype.objType = function(){
	return 'Sun'
}

var SolarSystem = function( state, x, y ){
	Kiwi.Group.call(this, state);
	this.state;
	this.x = x;
	this.y = y;
	
	this.sun = new Sun(state, 0, 0, 1);
	this.planet = new Planet(state, this.sun);
	this.moon = new Moon(state, this.planet);
	
	this.addChild(this.sun);
	this.addChild(this.planet);
	this.addChild(this.moon);
	
	this.moving = false;
	this.movingOffscreen = false;
}
Kiwi.extend(SolarSystem, Kiwi.Group);

SolarSystem.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	
	if(this.moving || this.movingOffscreen){
		this.x -= 10;
	}
	
	if(this.x < 0){
		this.moving = false;
	}
	
	if(this.x < -2000){
		this.movingOffscreen = false;
		this.x = this.state.game.stage.width + 1000;
	}
}



