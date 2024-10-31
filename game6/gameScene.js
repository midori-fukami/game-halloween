function gameScene(gameState) {
    let { level, sanity } = gameState;
    let score = 0;
    let timeLeft = 60;
    const TARGET_SCORE = level * 50;
    const PLAYER_SPEED = 100;
    const BASE_GHOST_SPEED = 2000;
    const LEFT_MARGIN = 20;
    const RIGHT_MARGIN = 40;
    const TOP_MARGIN = 20;
    const BOTTOM_MARGIN = 40;

    const PLAYER_WIDTH = 32; // Adjust this to match your player sprite width
    const PLAYER_HEIGHT = 32; // Adjust this to match your player sprite height

    // Play ambient sound
    const ambientSound = play("ambient", {
        loop: true,
        volume: 0.5
    });

    add([
        sprite("background"),
        scale(0.7),
        anchor("center"),
        pos(width() / 2, height() / 2)
    ]);

    const player = add([
        sprite("player"),
        pos(width() / 2, height() / 2),
        area({ width: PLAYER_WIDTH, height: PLAYER_HEIGHT }),
        {
            speed: PLAYER_SPEED,
            powerUpActive: false
        },
        "player"
    ]);

    const scoreText = add([
        text(`Score: ${score}/${TARGET_SCORE}`),
        pos(20, 20),
        color(255, 255, 255),
    ]);

    const timerText = add([
        text(`Time: ${timeLeft}`),
        pos(20, 50),
        color(255, 255, 255),
    ]);

    const sanityMeter = add([
        rect(200, 20),
        pos(20, 80),
        color(0, 255, 0),
    ]);

    function spawnCandy() {
        add([
            sprite("candy"),
            pos(rand(LEFT_MARGIN, width() - RIGHT_MARGIN), rand(TOP_MARGIN, height() - BOTTOM_MARGIN)),
            area(),
            "candy"
        ]);
        wait(rand(0.5, 1.5) / level, spawnCandy);
    }
    spawnCandy();

    function spawnGhost() {
        const ghostSpeed = BASE_GHOST_SPEED + (level * 20);
        const ghost = add([
            sprite("ghost"),
            pos(rand(LEFT_MARGIN, width() - RIGHT_MARGIN), rand(TOP_MARGIN, height() - BOTTOM_MARGIN)),
            area(),
            "ghost",
            {
                speed: rand(ghostSpeed * 0.8, ghostSpeed * 1.2),
                direction: vec2(rand(-1, 1), rand(-1, 1)).unit()
            },
        ]);

        ghost.onUpdate(() => {
            const dir = player.pos.sub(ghost.pos).unit();
            ghost.move(dir.scale(ghost.speed * dt()));

            if (chance(0.01)) {
                ghost.direction = vec2(rand(-1, 1), rand(-1, 1)).unit();
            }
        });

        wait(rand(2, 4) / level, spawnGhost);
    }
    spawnGhost();

    function spawnPumpkin() {
        add([
            sprite("pumpkin"),
            pos(rand(LEFT_MARGIN, width() - RIGHT_MARGIN), rand(TOP_MARGIN, height() - BOTTOM_MARGIN)),
            area(),
            "pumpkin"
        ]);
        wait(rand(2, 5) / level, spawnPumpkin);
    }
    spawnPumpkin();

    function spawnPowerUp() {
        add([
            sprite("powerup"),
            pos(rand(LEFT_MARGIN, width() - RIGHT_MARGIN), rand(TOP_MARGIN, height() - BOTTOM_MARGIN)),
            area(),
            "powerup"
        ]);
        wait(rand(15, 20), spawnPowerUp);
    }
    spawnPowerUp();

    onKeyPress("left", () => {
        console.log("Left key pressed");
    });
    onKeyPress("right", () => {
        console.log("Right key pressed");
    });
    onKeyPress("up", () => {
        console.log("Up key pressed");
    });
    onKeyPress("down", () => {
        console.log("Down key pressed");
    });
    onKeyPress("a", () => {
        console.log("A key pressed");
    });
    onKeyPress("d", () => {
        console.log("D key pressed");
    });
    onKeyPress("w", () => {
        console.log("W key pressed");
    });
    onKeyPress("s", () => {
        console.log("S key pressed");
    });
    

    onCollide("player", "candy", (p, c) => {
        destroy(c);
        score += 10;
        scoreText.text = `Score: ${score}/${TARGET_SCORE}`;
        play("collect");
        if (score >= TARGET_SCORE) {
            play("levelComplete");
            go("game", { level: level + 1, sanity: 100 }); // Reset sanity to 100 when passing a level
        }
    });

    onCollide("player", "ghost", (p, g) => {
        if (!player.powerUpActive) {
            sanity -= 10;
            play("jumpscare");
            shake(5);
        }
    });

    onCollide("player", "pumpkin", (p, pumpkin) => {
        destroy(pumpkin);
        score += 20;
        scoreText.text = `Score: ${score}/${TARGET_SCORE}`;
        play("collect");
    });

    onCollide("player", "powerup", (p, powerup) => {
        destroy(powerup);
        player.powerUpActive = true;
        player.speed = PLAYER_SPEED * 1.5; // Increase player speed by 50%
        player.use(color(0, 255, 0));
        play("collect");
        
        wait(5, () => {
            player.powerUpActive = false;
            player.speed = PLAYER_SPEED;
            player.use(color(255, 255, 255));
        });
    });

    onUpdate(() => {
        timeLeft -= dt();
        timerText.text = `Time: ${Math.ceil(timeLeft)}`;
        sanityMeter.width = (sanity / 100) * 200;
        sanityMeter.color = sanity > 50 ? rgb(0, 255, 0) : rgb(255, 0, 0);

        if (timeLeft <= 0 || sanity <= 0) {
            ambientSound.stop();
            go("gameOver", { score, level });
        }

        const moveSpeed = player.speed * dt();
    
        if (isKeyDown("left") || isKeyDown("a")) {
            player.pos.x = Math.max(player.pos.x - moveSpeed, LEFT_MARGIN);
        }
        if (isKeyDown("right") || isKeyDown("d")) {
            player.pos.x = Math.min(player.pos.x + moveSpeed, width() - RIGHT_MARGIN - PLAYER_WIDTH);
        }
        if (isKeyDown("up") || isKeyDown("w")) {
            player.pos.y = Math.max(player.pos.y - moveSpeed, TOP_MARGIN);
        }
        if (isKeyDown("down") || isKeyDown("s")) {
            player.pos.y = Math.min(player.pos.y + moveSpeed, height() - BOTTOM_MARGIN - PLAYER_HEIGHT);
        }
    });
}
