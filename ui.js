var Digit = function( state, x, y ){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['digits_white_spritesheet'], x, y, false);
	
	this.animation.add('0', [0], 0.1, false);
	this.animation.add('1', [1], 0.1, false);
	this.animation.add('2', [2], 0.1, false);
	this.animation.add('3', [3], 0.1, false);
	this.animation.add('4', [4], 0.1, false);
	this.animation.add('5', [5], 0.1, false);
	this.animation.add('6', [6], 0.1, false);
	this.animation.add('7', [7], 0.1, false);
	this.animation.add('8', [8], 0.1, false);
	this.animation.add('9', [9], 0.1, false);

	this.animation.play('0');
		
}
Kiwi.extend( Digit, Kiwi.GameObjects.Sprite);

var ScoreCounter = function ( state ){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.x = 0;
	this.y = 0;
	
	this.digitScale = 0.5;
	this.numberOfPlaces = 7;
	this.digits = [];
	
	for (var i = 0; i < this.numberOfPlaces; i++){
		var digit = new Digit(this.state, 0, 0);
		digit.scaleX = this.digitScale;
		digit.scaleY = this.digitScale;
		this.digits.push(digit);
	}
	
	this.digitWidth = this.digits[0].width * this.digitScale
	
	for (var i = 0; i < this.numberOfPlaces; i++){
		this.digits[i].x = i * this.digitWidth;
		this.addChild(this.digits[i]);
	}
	
}
Kiwi.extend( ScoreCounter, Kiwi.Group );

ScoreCounter.prototype.setValue = function(value){
	if( value < Math.pow( 10, this.numberOfPlaces) ){
		var stringValue = value.toString();
		while (stringValue.length < this.numberOfPlaces){
			stringValue = "0".concat(stringValue)
		}
		for (var i = 0; i < this.numberOfPlaces; i++){
			this.digits[i].animation.play(stringValue[i])
		}
	}
}
