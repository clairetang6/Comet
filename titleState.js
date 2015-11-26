var titleState = new Kiwi.State('titleState');

titleState.preload = function() {
	Kiwi.State.prototype.preload.call(this);

	this.addImage('sparkParticle', 'assets/sparks/spark_particle_1.png')

	this.addImage('nebula1', 'assets/nebula/nebulous_gas_1.png');
	this.addImage('nebula2', 'assets/nebula/nebulous_gas_2.png');
	this.addImage('nebula3', 'assets/nebula/nebulous_gas_3.png');
		
	this.addImage('cover', 'assets/galactic_mac_cover.png');
}

titleState.create = function() {
	Kiwi.State.prototype.create.call(this);
	
	this.random = this.game.rnd;

	this.nebulaGroup = new Kiwi.Group(this);
	this.nebulaGroup.lastNebulaY = 0;
	this.nebulaGroup.lastNebulaChange = 'up';
	for(var i = 1; i <=6; i++){
		var index = i%3+1
		var nebula = new Nebula(this, 'nebula' + index, (i-1) * this.game.stage.width/3);
		this.nebulaGroup.addChild(nebula);
	}
	for(var i = 0; i < this.nebulaGroup.members.length; i++){
		this.nebulaGroup.members[i].setYPosition();
		this.nebulaGroup.members[i].alpha = 0.8;
	}

	this.backgroundSparkParticles = new Kiwi.Group(this);
	for (var i = 0; i < 100; i++){
		this.backgroundSparkParticles.addChild(new SparkParticle(this, true));
	}

	this.foregroundSparkParticles = new Kiwi.Group(this);
	for (var i = 0; i < 7; i++){
		this.foregroundSparkParticles.addChild(new SparkParticle(this, false));
	}
	
	this.addChild(this.nebulaGroup);
	this.addChild(this.backgroundSparkParticles);
	this.addChild(this.foregroundSparkParticles);
	var cover = new Kiwi.GameObjects.StaticImage(this, 'cover', 0, 0);
	var rectHeight =  (this.game.stage.height-cover.height)/2;
	cover.y =  (this.game.stage.height-cover.height)/2;
	this.addChild(cover);

	var rectParams =  {
		state: this,
		width: 800,
		height: rectHeight + 2,
		centerOnTransform: false,
		x: 0,
		y: 0,
		color: [ 1, 1, 1 ],
		drawStroke: false
	} ;
	
	var rectangle = new Kiwi.Plugins.Primitives.Rectangle(rectParams);
	var rectangle2 = new Kiwi.Plugins.Primitives.Rectangle(rectParams);
	rectangle2.y += cover.height + rectangle2.height - 2;
	
	this.addChild(rectangle);
	this.addChild(rectangle2);
	
	this.game.input.keyboard.onKeyDown.add(this.onKeyDownCallback, this);
	this.game.input.onDown.add(this.onKeyDownCallback, this);
}

titleState.onKeyDownCallback = function(keyCode){
	this.game.states.switchState('gameState');	
}