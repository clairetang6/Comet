var SparkParticle = function( state ){	
	Kiwi.GameObjects.Sprite.call( this, state, state.textures['sparkParticle'], state.game.stage.width + 100, 0, false);
	
	this.state = state;
	this.x = this.state.random.integerInRange(0, state.game.stage.width + 100);
	this.y = this.state.random.integerInRange(0, state.game.stage.height);
	this.scale = this.state.random.integerInRange(0, 10) / 10;
	this.speed = this.scaleX * 2;
	
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

}

var Hero = function( state, x, y){
	Kiwi.GameObjects.Sprite.call( this, state, state.textures['hero_spritesheet'], x, y, false);
	
	this.vx = 0;
	this.vy = 0;
	this.state = state;
	
	this.animation.add('chill', [0], 0.1);
	this.animation.add('death', [0,1,2,3,4,5,6,7], 0.05);
}
Kiwi.extend( Hero, Kiwi.GameObjects.Sprite );

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
