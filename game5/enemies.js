var Enemies = {
    spawn: function(game, level) {
        const enemies = [];
        const numEnemies = 3 + level;

        for (let i = 0; i < numEnemies; i++) {
            enemies.push(game.add([
                game.sprite("ghost"),
                game.pos(game.rand(0, 716), game.rand(0, 716)),
                game.area(),
                "ghost",
                { speed: game.rand(50, 100) }
            ]));
        }

        return enemies;
    },
    update: function(game, enemies, player, level) {
        enemies.forEach(enemy => {
            const dir = player.pos.sub(enemy.pos).unit();
            enemy.move(dir.scale(enemy.speed));

            if (game.chance(0.02)) {
                enemy.speed = game.rand(50, 100);
            }
        });

        if (game.time() % 10 < 0.1) {
            enemies.push(game.add([
                game.sprite("ghost"),
                game.pos(game.rand(0, 716), game.rand(0, 716)),
                game.area(),
                "ghost",
                { speed: game.rand(50, 100) }
            ]));
        }
    }
};
