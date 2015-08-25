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
	
	this.radius = 300;	
	this.theta = 0; 
	
}
Kiwi.extend( Planet, Kiwi.GameObjects.Sprite );

Planet.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.x = this.sun.center.x + Math.cos(this.theta) * this.radius - this.width/2;
	this.y = this.sun.center.y + Math.sin(this.theta) * this.radius - this.height/2;
	
	this.theta += 0.005; 
	if(this.theta > 2*Math.PI){
		this.theta -= 2*Math.PI;
	}	
	
	this.rotation += 0.02;
}

var Sun = function( state, x, y, scale, textureKey ){
	Kiwi.GameObjects.Sprite.call( this, state, state.textures[textureKey], x, y, false);
	this.state = state;
	this.hero = this.state.hero;
	this.rotPointX = this.width * 0.5;
	this.rotPointY = this.height * 0.5;

	this.scaleX = scale;
	this.scaleY = scale;

	this.center = new Kiwi.Geom.Point(0,0);


}
Kiwi.extend( Sun, Kiwi.GameObjects.Sprite );

Sun.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.center.x = this.x + this.width * 0.5;
	this.center.y = this.y + this.height * 0.5;
	this.rotation += 0.02;
}

var Hero = function( state, x, y, name){
	Kiwi.Group.call( this, state);
	this.x = x; 
	this.y = y;
	
	this.comet = new Kiwi.GameObjects.Sprite( state, state.textures['hero_spritesheet'], 0, 0, false);
	this.comet.animation.add('blue', [0], 0.1);
	this.comet.animation.add('bluedeath', [0,1,2,3,4,5,6,7], 0.05);
	
	this.comet.animation.add('fire', [8], 0.1);
	this.comet.animation.add('firedeath', [8,9,10,11,12,13,14,15], 0.05);
	this.comet.animation.add('apple', [16], 0.1);
	this.comet.animation.add('appledeath', [16,17,18,19,20,21,22,23], 0.05)
	this.comet.name = name;
	this.comet.animation.play(this.comet.name);
	
	this.tailGroup = new Kiwi.Group(state);

	this.shadowScales = [0, 1];
	this.shadowAlphas = [0, 1];
	this.shadowOffsets = [0, 300];
	this.numberOfShadows = 60;
	for (var i = 0; i < this.numberOfShadows; i++){
		var cometShadow = new CometShadow( state, this, i);
		cometShadow.scale = (1 - i/this.numberOfShadows);
		cometShadow.alpha = (1 - i/this.numberOfShadows); 
		cometShadow.x = (0 - (6*i));
		console.log(cometShadow.x);
		this.tailGroup.addChild(cometShadow);
	}
	
	this.sparkGroup = new Kiwi.Group(state);
	
	this.numberOfSparks = 10;
	for (var i = 0; i < this.numberOfSparks; i++){
		var spark = new Spark(state, this, i);
		this.sparkGroup.addChild(spark);
	}
	
	this.addChild(this.tailGroup);	
	this.addChild(this.sparkGroup);
	this.addChild(this.comet);
	
	this.vx = 0;
	this.vy = 0;
	this.state = state;
}
Kiwi.extend( Hero, Kiwi.Group );

var CometShadow = function( state , hero, index ){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['hero_spritesheet'], 0, 3, false);	
	
	this.hero = hero; 
	this.index = index;
	
	this.animation.add('bluetail', [7], 0.1, false);
	this.animation.add('firetail', [15], 0.1, false);
	this.animation.add('appletail', [23], 0.1, false);
	this.animation.play(this.hero.comet.name + 'tail');
}
Kiwi.extend( CometShadow, Kiwi.GameObjects.Sprite);

CometShadow.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	
	this.index = this.index + 1; 
	if(this.index >= this.hero.numberOfShadows -1){
		this.index = 0;
	}
		
	this.y = this.hero.vy * this.index * 0.04;
	this.y -= this.hero.vy * Math.pow(this.index * 0.08, 2);

	this.alpha = 1 - this.index/this.hero.numberOfShadows;
	this.scaleX = 1 - this.index/this.hero.numberOfShadows;
	this.scaleY = 1 - this.index/this.hero.numberOfShadows;

	this.x = 0 - (6*this.index);
	this.x -= this.hero.vx * Math.pow(this.index * 0.08, 2);
	
}

var Spark = function(state, hero, index){
	Kiwi.GameObjects.StaticImage.call(this, state, 'redSpark');
	this.state = state;
	this.hero = hero;
	this.index = index;
	this.startingX = this.hero.comet.width/2 - 20;
	this.startingY = this.hero.comet.height/2 - 4; 
	this.angle = Math.PI;
}
Kiwi.extend(Spark, Kiwi.GameObjects.StaticImage);

Spark.prototype.update = function(){
	Kiwi.GameObjects.StaticImage.prototype.update.call(this);
	
	this.index = this.index + 0.1; 
	if(this.index >= this.hero.numberOfSparks -1){
		this.index = 0;
		this.x = this.startingX;
		this.y = this.startingY;
		this.setRandomAngle();
	}
	
	this.x = this.index * 10 * Math.cos(this.angle) + this.startingX;
	this.y = this.index * 10 * Math.sin(this.angle) + this.startingY;
	this.x -= this.hero.vx * Math.pow(this.index * 0.12, 2);
	this.y -= this.hero.vy * Math.pow(this.index * 0.12, 2);	

	this.scaleX = 1 - this.index/this.hero.numberOfSparks;
	this.scaleY = 1 - this.index/this.hero.numberOfSparks;
		
}

Spark.prototype.setRandomAngle = function(){
	var randomFrac = this.state.random.frac() / 3;
	this.angle = (5 * Math.PI)/6 + (randomFrac * Math.PI);
};


Hero.prototype.die = function(){
	this.comet.animation.play(this.comet.name + 'death');
	//do something with his tail. 
}

Hero.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	
	if(this.state.upKey.isDown){
		if(this.vy > -50){
			this.vy -= 1;
		}
	}
	if(this.state.downKey.isDown){
		if(this.vy < 50){
			this.vy += 1;
		}
	}
	if(this.state.rightKey.isDown){
		if(this.vx < 50){
			this.vx += 1;
		}
	}
	if(this.state.leftKey.isDown){
		if(this.vx > -50){
			this.vx -= 1;
		}
	}

	if(Math.abs(this.vy) > 0.0001){
		this.vy = this.vy * 0.9
	}else{
		this.vy = 0;
	}

	if(Math.abs(this.vx) > 0.0001){
		this.vx = this.vx * 0.9;
	}else{
		this.vx = 0;
	}
	
	
	this.y += this.vy; 
	if(this.y < -100){
		this.y = this.state.game.stage.height - this.height;
	}else if(this.y > this.state.game.stage.height){
		this.y = -100;
	}
	
	if(this.x + this.vx > 0 && this.x + this.vx < this.state.game.stage.width){
		this.x += this.vx;
	}

}
