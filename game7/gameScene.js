function gameScene(gameState) {
    let { level, sanity } = gameState;
    let score = 0;
    let timeLeft = 60;
    const TARGET_SCORE = level * 50;
    let flashlightOn = false;
    let batteryLevel = FLASHLIGHT_BATTERY;

    const ambientSound = play("ambient", { loop: true, volume: 0.5 });

    add([sprite("background"), scale(0.7)]);

    const player = createPlayer();
    const flashlight = createFlashlight();
    const ui = createUI(score, TARGET_SCORE, timeLeft, sanity, batteryLevel);

    spawnCandy(level);
    spawnGhost(level, player);
    spawnPumpkin(level);
    spawnPowerUp();

    function stunGhost(ghost) {
        if (!ghost.stunned) {
            ghost.stunned = true;
            ghost.stunTime = 2;
            ghost.opacity = 1;
        }
    }

    onKeyPress("space", () => {
        flashlightOn = !flashlightOn;
        flashlight.opacity = flashlightOn ? 0.3 : 0;
        play("flashlightClick");

        if (flashlightOn) {
            get("ghost").forEach(ghost => {
                if (ghost.isColliding(flashlight)) {
                    stunGhost(ghost);
                }
            });
        }
    });

    onCollide("ghost", "flashlight", (ghost, f) => {
        if (flashlightOn) {
            stunGhost(ghost);
        }
    });

    onCollide("player", "candy", (p, c) => {
        destroy(c);
        score += 10;
        play("collect");
        if (score >= TARGET_SCORE) {
            play("levelComplete", { volume: 0.5 });
            go("game", { level: level + 1, sanity: sanity });
        }
    });

    onCollide("player", "ghost", (p, g) => {
        if (!player.powerUpActive && !g.stunned) {
            sanity -= 10;
            play("jumpscare");
            shake(5);
        }
    });

    onCollide("player", "pumpkin", (p, pumpkin) => {
        destroy(pumpkin);
        score += 20;
        play("collect");
    });

    onCollide("player", "powerup", (p, powerup) => {
        destroy(powerup);
        player.powerUpActive = true;
        player.speed = PLAYER_SPEED * 1.5;
        player.use(color(0, 255, 0));
        play("collect");
        
        wait(5, () => {
            player.powerUpActive = false;
            player.speed = PLAYER_SPEED;
            player.use(color(255, 255, 255));
        });
    });

    onUpdate(() => {
        movePlayer(player);
        const flashlightStatus = updateFlashlight(flashlight, player, flashlightOn, batteryLevel);
        flashlightOn = flashlightStatus.flashlightOn;
        batteryLevel = flashlightStatus.batteryLevel;

        timeLeft -= dt();
        updateUI(ui, score, TARGET_SCORE, timeLeft, sanity, batteryLevel);

        if (timeLeft <= 0 || sanity <= 0) {
            ambientSound.stop();
            go("gameOver", { score, level });
        }
    });
}
