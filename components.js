var TouchControlComponent = function(params){
	Kiwi.Component.call(this, params.owner, "TouchControlComponent");
	
	this.touchDownX = 0;
	this.touchDownY = 0;
	this.touchTime = 0;
	this.deltaY = 0;
	this.deltaX = 0;
}
Kiwi.extend(TouchControlComponent, Kiwi.Component);

TouchControlComponent.prototype.objType = function(){
	return "TouchControlComponent";
}

TouchControlComponent.prototype.update = function(){
	Kiwi.Component.prototype.update.call(this);	
	
	this.deltaY = 0;
	this.deltaX = 0;
	
	if(this.owner.state.game.input.isDown){
		if(this.touchTime == 0){
			this.touchDownY = this.owner.state.game.input.y;
			this.touchDownX = this.owner.state.game.input.x;
		}
		
		this.touchTime++;
		
		this.deltaY = this.owner.state.game.input.y - this.touchDownY;
		this.deltaX = this.owner.state.game.input.x - this.touchDownX;
		
		this.touchDownY = 0.95 * this.owner.state.game.input.y + 0.05 * this.touchDownY;
		this.touchDownX = 0.95 * this.owner.state.game.input.x + 0.05 * this.touchDownX;
	}else{
		this.touchTime = 0;
	}
}

var OrbiterComponent = function(params){
	Kiwi.Component.call( this, params.owner, params.name );
	this.orbitee = params.orbitee;
	this.radius = params.radius;
	this.speed = params.speed;
	this.theta = 0;
}
Kiwi.extend(OrbiterComponent, Kiwi.Component);
 
OrbiterComponent.prototype.objType = function() {
    return "OrbiterComponent";
};

OrbiterComponent.prototype.update = function() {
	this.theta += 0.005 * this.speed; 
	if(this.speed > 0){
		if(this.theta > 2*Math.PI){
			this.theta -= 2*Math.PI;
		}
	}else{
		if(this.theta < 0){
			this.theta += 2*Math.PI;
		}
	}
	
	this.owner.x = this.orbitee.x + this.orbitee.width/2 + this.radius * Math.cos(this.theta) - this.owner.width/2; 
	this.owner.y = this.orbitee.y + this.orbitee.height/2 + this.radius * Math.sin(this.theta) - this.owner.height/2;
};

var CircleColliderComponent = function(params){
	Kiwi.Component.call( this, params.owner, 'CircleCollider');
	
	this.debugCircle = new Kiwi.Plugins.Primitives.Ellipse( {
		state: params.owner.state,
		radius: params.diameter/2,
		segments: 16,
		centerOnTransform: true,
		alpha: 0.8
	} );
	
	this.circle = new Kiwi.Geom.Circle(this.owner.worldX + this.owner.width/2, this.owner.worldY + this.owner.height/2, params.diameter);
	this.owner.hitCircle = this.circle;	
	
	if(params.offsetX){
		this.offsetX = params.offsetX;
	}else{
		this.offsetX = 0;
	}
	if(params.offsetY){
		this.offsetY = params.offsetY;
	}else{
		this.offsetY = 0;
	}
}
Kiwi.extend( CircleColliderComponent, Kiwi.Component);

CircleColliderComponent.prototype.objType = function(){
	return 'CircleColliderComponent';
}

CircleColliderComponent.prototype.postUpdate = function(){
	Kiwi.Component.prototype.postUpdate.call(this);
	
	this.circle.x = this.owner.worldX + this.owner.width/2 + this.offsetX;
	this.circle.y = this.owner.worldY + this.owner.height/2 + this.offsetY;
	
	this.debugCircle.x = this.circle.x;
	this.debugCircle.y = this.circle.y;
}

