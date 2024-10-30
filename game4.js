game.scene("menu", () => {
    game.add([
        game.sprite("startbackground"),
        game.scale(0.7),
    ]);

    game.add([
        game.text("Halloween Candy Collector", { size: 32 }),
        game.pos(716 / 2, 716 / 4),
        game.anchor("center"),
        game.color(255, 165, 0), // Orange color
    ]);

    game.add([
        game.text("Press SPACE to start", 24),
        game.pos(game.width() / 2, game.height() / 2),
        game.anchor("center"),
    ]);

    game.onKeyPress("space", () => {
        game.go("game", 1);
    });
});

game.scene("game", (level) => {
    let SPEED = 200;
    let timeLeft = 30;
    let score = 0;
    const TARGET_SCORE = level * 50;

    game.add([
        game.sprite("background"),
        game.scale(0.7),
    ]);

    const player = game.add([
        game.sprite("player"),
        game.pos(game.width() / 2, game.height() / 2),
        game.area(),
        "player"
    ]);

    game.onKeyDown("left", () => {
        player.move(-SPEED, 0);
        player.pos.x = Math.max(player.width / 2, player.pos.x);
    });
    game.onKeyDown("right", () => {
        player.move(SPEED, 0);
        player.pos.x = Math.min(game.width() - player.width / 2, player.pos.x);
    });
    game.onKeyDown("up", () => {
        player.move(0, -SPEED);
        player.pos.y = Math.max(player.height / 2, player.pos.y);
    });
    game.onKeyDown("down", () => {
        player.move(0, SPEED);
        player.pos.y = Math.min(game.height() - player.height / 2, player.pos.y);
    });

    function spawnCandy() {
        game.add([
            game.sprite("candy"),
            game.pos(game.rand(50, game.width() - 50), game.rand(50, game.height() - 50)),
            game.area(),
            "candy"
        ]);
        game.wait(game.rand(1, 3) / level, spawnCandy);
    }
    spawnCandy();

    function spawnGhost() {
        game.add([
            game.sprite("ghost"),
            game.pos(game.rand(50, game.width() - 50), game.rand(50, game.height() - 50)),
            game.area(),
            "ghost"
        ]);
        game.wait(game.rand(3, 6) / level, spawnGhost);
    }
    spawnGhost();

    function spawnPumpkin() {
        game.add([
            game.sprite("pumpkin"),
            game.pos(game.rand(50, game.width() - 50), game.rand(50, game.height() - 50)),
            game.area(),
            "pumpkin"
        ]);
        game.wait(game.rand(5, 10), spawnPumpkin);
    }
    spawnPumpkin();

    function spawnPowerUp() {
        game.add([
            game.sprite("powerup"),
            game.pos(game.rand(50, game.width() - 50), game.rand(50, game.height() - 50)),
            game.area(),
            "powerup"
        ]);
        game.wait(game.rand(10, 15), spawnPowerUp);
    }
    spawnPowerUp();
    

    const scoreText = game.add([
        game.text(`Score: ${score}`),
        game.pos(20, 20),
    ]);

    const timerText = game.add([
        game.text(`Time: ${timeLeft}`),
        game.pos(20, 50),
    ]);

    const levelText = game.add([
        game.text(`Level: ${level}`),
        game.pos(20, 80),
    ]);

    game.onCollide("player", "candy", (p, c) => {
        game.destroy(c);
        score += 10;
        scoreText.text = `Score: ${score}`;
        game.play("collect");
        if (score >= TARGET_SCORE) {
            game.play("levelComplete");
            game.go("game", level + 1);
        }
    });

    game.onCollide("player", "pumpkin", (p, c) => {
        game.destroy(c);
        score += 20;
        scoreText.text = `Score: ${score}`;
        game.play("collect");
        if (score >= TARGET_SCORE) {
            game.play("levelComplete");
            game.go("game", level + 1);
        }
    });

    game.onCollide("player", "powerup", (p, c) => {
        game.destroy(c);
        SPEED = 300;
        game.play("collect");
        player.use(game.color(0, 255, 0, 0.5)); // Semi-transparent green overlay
        game.wait(5, () => {
            SPEED = 200;
            player.use(game.color(255, 255, 255)); // Reset to white (no tint)
        });
    });
    

    game.onCollide("player", "ghost", () => {
        game.go("gameOver", score, level);
    });

    game.onUpdate(() => {
        timeLeft -= game.dt();
        timerText.text = `Time: ${Math.ceil(timeLeft)}`;
        if (timeLeft <= 0) {
            game.go("gameOver", score, level);
        }
    });
});

game.scene("gameOver", (score, level) => {
    game.add([
        game.sprite("startbackground"),
        game.scale(0.7),
    ]);

    game.add([
        game.text(`Game Over!\nScore: ${score}\nLevel: ${level}\nPress space to restart`),
        game.pos(game.width() / 2, game.height() / 2),
        game.anchor("center"),
    ]);

    game.onKeyPress("space", () => {
        game.go("menu");
    });
});

game.go("menu");
