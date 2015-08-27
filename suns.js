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

var Planet = function( state, sun, textureKey ){
	Kiwi.GameObjects.Sprite.call( this, state, state.textures[textureKey], 0, 0, false);
	
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

var Moon = function( state, planet, textureKey ){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures[textureKey], 0, 0, false);
	
	var params = {owner: this, name: 'Orbiter', radius: 120, orbitee: planet, speed: 4};
	this.components.add(new OrbiterComponent(params));	
	this.components.add(new CircleColliderComponent({owner: this, diameter: 100}));
}
Kiwi.extend( Moon, Kiwi.GameObjects.Sprite);

Moon.prototype.objType = function(){
	return 'Moon'
}

var Sun = function( state, x, y, scale, textureKey ){
	Kiwi.GameObjects.Sprite.call( this, state, state.textures[textureKey], x, y, false);
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

