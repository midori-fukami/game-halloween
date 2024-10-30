var Game = {
    create: function(game) {
        return function(gameState) {
            let { level, sanity } = gameState;
            let score = 0;
            let timeLeft = 60;
            const TARGET_SCORE = level * 50; // Target score increases with each level

            const environment = Environment.create(game);
            const player = Player.create(game);
            const enemies = Enemies.spawn(game, level);

            function spawnCandy() {
                game.add([
                    game.sprite("candy"),
                    game.pos(game.rand(50, 666), game.rand(50, 666)),
                    game.area(),
                    "candy"
                ]);
                game.wait(game.rand(1, 3), spawnCandy);
            }
            spawnCandy();

            // Spawn power-up
            function spawnPowerUp() {
                game.add([
                    game.sprite("powerup"),
                    game.pos(game.rand(50, 666), game.rand(50, 666)),
                    game.area(),
                    "powerup"
                ]);
                game.wait(game.rand(10, 15), spawnPowerUp);
            }
            spawnPowerUp();

            const scoreText = game.add([
                game.text(`Score: ${score}/${TARGET_SCORE}`, { size: 16 }),
                game.pos(20, 20),
                game.color(255, 255, 255),
            ]);

            const levelText = game.add([
                game.text(`Level: ${level}`, { size: 16 }),
                game.pos(20, 50),
                game.color(255, 255, 255),
            ]);

            const timerText = game.add([
                game.text(`Time: ${timeLeft}`, { size: 16 }),
                game.pos(20, 50),
                game.color(255, 255, 255),
            ]);

            const sanityMeter = game.add([
                game.rect(200, 20),
                game.pos(20, 80),
                game.color(0, 255, 0),
            ]);

            game.onUpdate(() => {
                timeLeft -= game.dt();
                timerText.text = `Time: ${Math.ceil(timeLeft)}`;

                // Check if target score is reached
                if (score >= TARGET_SCORE) {
                    game.play("levelComplete");
                    game.go("game", { level: level + 1, sanity: sanity });
                }

                Player.update(game, player, sanity);
                Enemies.update(game, enemies, player, level);
                Environment.update(game, environment);

                sanityMeter.width = (sanity / 100) * 200;
                sanityMeter.color = sanity > 50 ? game.rgb(0, 255, 0) : game.rgb(255, 0, 0);

                if (timeLeft <= 0 || sanity <= 0) {
                    game.go("gameOver", { score, level });
                }
            });

            game.onCollide("player", "candy", (p, c) => {
                game.destroy(c);
                score += 10;
                scoreText.text = `Score: ${score}/${TARGET_SCORE}`;
                game.play("collect");
            });

            game.onCollide("player", "ghost", (p, g) => {
                sanity -= 10;
                game.play("jumpscare");
                game.shake(5);
            });

            // Collision handling for power-up
            game.onCollide("player", "powerup", (p, c) => {
                game.destroy(c);
                score += 20;
                scoreText.text = `Score: ${score}/${TARGET_SCORE}`;
                game.play("collect");
                player.use(game.color(0, 255, 0)); // Green tint to indicate power-up
                player.speed = 300; // Increase speed
                game.wait(5, () => {
                    player.use(game.color(255, 255, 255)); // Reset color
                    player.speed = 200; // Reset speed
                });
            });
        };
    }
};
