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

}
Kiwi.extend( Hero, Kiwi.GameObjects.Sprite );

Hero.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

}
