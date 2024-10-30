kaboom({
    global: true,
    width: 800,
    height: 600,
    scale: 1,
    debug: true,
  });

// load assets
loadSprite("player", "/sprite/player.png");
loadSprite("candy", "/sprite/Cake1.png");
loadSprite("ghost", "/sprite/Ghost2.png");
loadSprite("pumpkin", "/sprite/Pumpkin1.png");
loadSprite("powerup", "/sprite/boots.png");

// sounds
loadSound("collect", "/sound/collect.mp3");
loadSound("levelComplete", "/sound/finishgame.mp3");