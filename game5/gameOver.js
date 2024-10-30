var GameOver = {
    create: function(game) {
        return function(gameState) {
            const { score, level } = gameState;

            game.add([
                game.sprite("startBackground"),
                game.scale(0.7),
            ]);

            game.add([
                game.text(`Game Over!\nScore: ${score}\nLevel: ${level}\nPress space to restart`, { size: 24 }),
                game.pos(716 / 2, 716 / 2),
                game.anchor("center"),
                game.color(255, 0, 0),
            ]);

            game.onKeyPress("space", () => {
                game.go("menu");
            });
        };
    }
};
