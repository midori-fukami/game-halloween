var Assets = {
    load: function(game) {
        game.loadSprite("player", "/sprite/player.png");
        game.loadSprite("candy", "/sprite/candy.png");
        game.loadSprite("ghost", "/sprite/Ghost2.png");
        game.loadSprite("pumpkin", "/sprite/Pumpkin1.png");
        game.loadSprite("powerup", "/sprite/Pumpkin1.png");
        game.loadSprite("background", "/sprite/background.png");
        game.loadSprite("startBackground", "/sprite/startbackground.png");
        game.loadSprite("flashlight", "/sprite/flashbeam.png");

        game.loadSound("collect", "/sound/collect.mp3");
        game.loadSound("levelComplete", "/sound/finishgame.mp3");
        game.loadSound("ambient", "/sound/atmosphere.mp3");
        game.loadSound("jumpscare", "/sound/jumpscare.mp3");
    }
};