var SparkParticle = function( state , forBackground){	
	Kiwi.GameObjects.Sprite.call( this, state, state.textures['sparkParticle'], state.game.stage.width + 100, 0, false);
	
	this.state = state;
	this.x = this.state.random.integerInRange(0, state.game.stage.width + 100);
	this.y = this.state.random.integerInRange(-100, state.game.stage.height);
	
	if(forBackground){
		this.scale = this.state.random.integerInRange(0, 50) / 80;
		this.speed = this.scaleX * 3;
	}else{
		this.scale = this.state.random.integerInRange(20, 50) / 50;
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
	this.rotation += 0.01;
}

var Hero = function( state, x, y, name){
	Kiwi.GameObjects.Sprite.call( this, state, state.textures['hero_spritesheet'], x, y, false);
	
	this.vx = 0;
	this.vy = 0;
	this.state = state;
	this.name = name;
	
	this.animation.add('blue', [0], 0.1);
	this.animation.add('bluedeath', [0,1,2,3,4,5,6,7], 0.05);
	
	this.animation.add('fire', [8], 0.1);
	this.animation.add('firedeath', [8,9,10,11,12,13,14,15], 0.05);
	this.animation.add('apple', [16], 0.1);
	this.animation.add('appledeath', [16,17,18,19,20,21,22,23], 0.05)
	
}
Kiwi.extend( Hero, Kiwi.GameObjects.Sprite );

Hero.prototype.die = function(){
	this.animation.play(this.name + 'death');
}

Hero.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	
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
