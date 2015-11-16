var Hero = function( state, x, y, name){
	Kiwi.Group.call( this, state);
	this.x = x; 
	this.y = y;
	
	this.buffer = [];
	for (var i = 0; i < 120; i++){
		this.buffer.push(0);
	}
	this.bufferIndex = 0;
	
	this.comet = new Kiwi.GameObjects.Sprite( state, state.textures['hero_spritesheet'], 0, 0, false);
	this.comet.animation.add('blue', [0], 0.1);
	this.comet.animation.add('bluedeath', [0,1,2,3,4,5,6,7], 0.05);
	
	this.comet.animation.add('fire', [8], 0.1);
	this.comet.animation.add('firedeath', [8,9,10,11,12,13,14,15], 0.05);
	this.comet.animation.add('apple', [16], 0.1);
	this.comet.animation.add('appledeath', [16,17,18,19,20,21,22,23], 0.05)
	this.comet.name = name;
	this.comet.animation.play(this.comet.name);
	this.comet.objType = function(){
		return 'Comet';
	}
	this.comet.parent = this;
	this.cometCollider = this.comet.components.add(new CircleColliderComponent({owner: this.comet, diameter: 40, offsetX: 4}));
	this.cometCollider.active = false; //have hero call postUpdate so that position is correct
	this.hitCircle = this.cometCollider.circle;
		
	this.tailGroup = new Kiwi.Group(state);

	this.tailScales = [0, 1];
	this.tailAlphas = [0, 1];

	this.numberOfTailPieces = 60;
	for (var i = 0; i < this.numberOfTailPieces; i++){
		var tailPiece = new TailPiece( state, this, i);
		tailPiece.scale = (1 - i/this.numberOfTailPieces);
		tailPiece.alpha = (1 - i/this.numberOfTailPieces); 
		tailPiece.x = (0 - (6*i));
		this.tailGroup.addChild(tailPiece);
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
	

	this.isAlive = true;
}
Kiwi.extend( Hero, Kiwi.Group );

var TailPiece = function( state , hero, index ){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['hero_spritesheet'], 0, 3, false);	
	
	this.hero = hero; 
	this.index = index;
	
	this.animation.add('bluetail', [7], 0.1, false);
	this.animation.add('firetail', [15], 0.1, false);
	this.animation.add('appletail', [23], 0.1, false);
	this.animation.play(this.hero.comet.name + 'tail');
				
	this.alpha = 1 - this.index/this.hero.numberOfTailPieces;
	this.scaleX = 1 - this.index/this.hero.numberOfTailPieces;
	this.scaleY = 1 - this.index/this.hero.numberOfTailPieces;	
}
Kiwi.extend( TailPiece, Kiwi.GameObjects.Sprite);

TailPiece.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	
	this.y = this.hero.vy * this.index * 0.04;
	//this.y -= this.hero.vy * Math.pow(this.index * 0.08, 2);
	
	var bufferIndex = this.hero.bufferIndex - this.index; 
	if(bufferIndex < 0){
		bufferIndex += this.hero.buffer.length;
	}
	
	this.x = this.hero.buffer[bufferIndex][0] - this.hero.x;
	this.y = this.hero.buffer[bufferIndex][1] - this.hero.y;
	
	this.x -= 30 + (6 * this.index);
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
	this.isAlive = false;
	//do something with his tail.
	this.tailGroup.visible = false;
}

Hero.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	
	this.bufferIndex += 1;
	if(this.bufferIndex > this.buffer.length - 1){
		this.bufferIndex = 0;
	}	
		
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
	
	this.comet.rotation += this.vy/100;
	
	if(Math.abs(this.comet.rotation) > 0.0001){
		this.comet.rotation *= 0.9;
	}else{
		this.comet.rotation = 0;
	}
	if(Math.abs(this.comet.rotation) > 0.5){
		this.cometCollider.offsetX = 2;
	}else{
		this.cometCollider.offsetX = 4;
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
	if(this.y < -180){
		this.y = this.state.game.stage.height;
	}else if(this.y > this.state.game.stage.height){
		this.y = -100;
	}
	
	if(this.x + this.vx > 0 && this.x + this.vx < this.state.game.stage.width){
		this.x += this.vx;
	}
	
	this.cometCollider.postUpdate();

	this.buffer[this.bufferIndex] = [this.x, this.y - Math.sin(this.comet.rotation) * this.comet.height/2];
	
	this.checkCollisions();
	this.checkCollisionsPlasma();
}

Hero.prototype.objType = function(){
	return 'Hero'
}

Hero.prototype.checkCollisions = function(){
	var nebulasMatter = [];
	for(var i = 0; i < this.state.solarSystems.length; i++){
		if(this.state.solarSystems[i].moving || this.state.solarSystems[i].movingOffscreen){
			nebulasMatter = nebulasMatter.concat(this.state.solarSystems[i].members);
		}
	}
	
	var shouldDie = false;
	for(var i = 0; i < nebulasMatter.length; i++){
		if(this.hitCircle.distanceTo(nebulasMatter[i].hitCircle) < (nebulasMatter[i].hitCircle.radius + this.hitCircle.radius)){
			shouldDie = true;
			break;
		}	
	}
	
	if(this.isAlive && shouldDie){
		this.die();
	}
	
	if(!this.isAlive && !shouldDie){
		this.comet.animation.play('fire');	

		this.isAlive = true;
		this.tailGroup.visible = true;	

	}
}

Hero.prototype.checkCollisionsPlasma = function(){
	var plasmas = this.state.plasmaGroup.members;
	
	for (var i = 0; i < plasmas.length; i++){
		if(this.hitCircle.distanceTo(plasmas[i].hitCircle) <  (plasmas[i].hitCircle.radius + this.hitCircle.radius)){
			var animationName = plasmas[i].animation.currentAnimation.name;
			if(animationName.substr(animationName.length -7) != 'destroy'){
				plasmas[i].animation.play(plasmas[i].color + 'destroy');
								
			}
		}
	}
}