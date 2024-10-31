kaboom({
    global: true,
    width: 716,
    height: 716,
    scale: 1,
    debug: true,
});

loadAssets();

scene("menu", menuScene);
scene("game", gameScene);
scene("gameOver", gameOverScene);

go("menu");
