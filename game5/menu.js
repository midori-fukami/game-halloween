var Menu = {
    create: function(game) {
        game.add([
            game.sprite("startBackground"),
            game.scale(0.7),
        ]);

        game.add([
            game.text("Halloween Horror", { size: 48 }),
            game.pos(716 / 2, 716 / 4),
            game.anchor("center"),
            game.color(255, 0, 0),
        ]);

        game.add([
            game.text("Press SPACE to start", { size: 24 }),
            game.pos(716 / 2, 716 / 2),
            game.anchor("center"),
            game.color(255, 255, 255),
        ]);

        game.onKeyPress("space", () => {
            game.go("game", { level: 1, sanity: 100 });
        });
    }
};
