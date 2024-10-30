var Environment = {
    create: function(game) {
        return {
            darkness: game.add([
                game.rect(716, 716),
                game.color(0, 0, 0),
                game.opacity(0.7),
                game.z(100),
            ]),
            ambientSound: game.play("ambient", { loop: true, volume: 0.5 }),
        };
    },
    update: function(game, environment) {
        if (game.chance(0.05)) {
            environment.darkness.opacity = game.rand(0.6, 0.8);
        }

        if (game.chance(0.001)) {
            game.play("jumpscare", { volume: 0.3 });
        }
    }
};
