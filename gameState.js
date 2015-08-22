var gameState = new Kiwi.State('gameState');

gameState.preload = function() {
	Kiwi.State.prototype.preload.call(this);
	this.addSpriteSheet('hero_spritesheet', 'hero_spritesheet.png', 232, 200);
}

gameState.create = function() {
	Kiwi.State.prototype.create.call(this);
	
	this.pauseKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.P);

	this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
	this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);	

}


gameState.update = function() {

}

