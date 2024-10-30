(function() {
    const game = kaplay({
        width: 716,
        height: 716,
        scale: 1,
        debug: false,
    });

    Assets.load(game);

    game.scene("menu", Menu.create(game));
    game.scene("game", Game.create(game));
    game.scene("gameOver", GameOver.create(game));

    game.go("menu");
})();
