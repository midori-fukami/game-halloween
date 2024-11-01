// kaboom({
//     global: true,
//     width: 716,
//     height: 716,
//     scale: 1,
//     debug: true,
//   });

const game = kaplay({
    width: 716,
    height: 716,
    scale: 1,
    debug: true,
});

// load assets
game.loadSprite("player", "/sprite/player.png");
game.loadSprite("candy", "/sprite/candy.png");
game.loadSprite("ghost", "/sprite/Ghost2.png");
game.loadSprite("pumpkin", "/sprite/Pumpkin1.png");
game.loadSprite("powerup", "/sprite/boots.png");
game.loadSprite("background", "/sprite/background.png");
game.loadSprite("startbackground", "/sprite/startbackground.png");

// sounds
game.loadSound("collect", "/sound/collect.mp3");
game.loadSound("levelComplete", "/sound/finishgame.mp3");

// Load custom font
