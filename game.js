var gameOptions = {
	width: 1000,
	height: 600
}

var myGame = new Kiwi.Game('game', 'myGame', null, gameOptions);

myGame.stage.color = '000000';

myGame.states.addState('titleState');
myGame.states.addState('gameState');

myGame.states.switchState('titleState');

