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
	
	this.isComet = params.isComet;
	
	if(params.isComet && this.owner.parent){
		this.circle = new Kiwi.Geom.Circle(this.owner.x + this.owner.width/2, this.owner.y + this.owner.height/2, params.diameter);			
	}else{
		this.circle = new Kiwi.Geom.Circle(this.owner.x + this.owner.width/2, this.owner.y + this.owner.height/2, params.diameter);					
	}

	this.owner.hitCircle = this.circle;	
}
Kiwi.extend( CircleColliderComponent, Kiwi.Component);

CircleColliderComponent.prototype.objType = function(){
	return 'CircleColliderComponent';
}

CircleColliderComponent.prototype.update = function(){
	Kiwi.Component.prototype.update.call(this);
	
	if(this.isComet){
		this.circle.x = this.owner.parent.x + this.owner.width/2;
		this.circle.y = this.owner.parent.y + this.owner.height/2;
	}else{
		this.circle.x = this.owner.parent.x + this.owner.x + this.owner.width/2;
		this.circle.y = this.owner.parent.y + this.owner.y + this.owner.height/2;
	}

}

