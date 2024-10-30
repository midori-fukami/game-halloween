kaboom({
    global: true,
    width: 716,
    height: 716,
    scale: 1,
    debug: true,
  });

// load assets
loadSprite("player", "/sprite/player.png");
loadSprite("candy", "/sprite/candy.png");
loadSprite("ghost", "/sprite/Ghost2.png");
loadSprite("pumpkin", "/sprite/Pumpkin1.png");
loadSprite("powerup", "/sprite/boots.png");
loadSprite("background", "/sprite/background.png");
loadSprite("startbackground", "/sprite/startbackground.png");

// sounds
loadSound("collect", "/sound/collect.mp3");
loadSound("levelComplete", "/sound/finishgame.mp3");