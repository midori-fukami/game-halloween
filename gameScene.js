// gameScene.js

function gameScene(gameState) {
    let { level, sanity, candyCount = 0, flashlightRadius } = gameState;
    let score = 0;
    let timeLeft = 60;
    const TARGET_SCORE = level * 50;
    let flashlightOn = false;
    let batteryLevel = FLASHLIGHT_BATTERY;
    let activePowerUps = {
        speed: false,
        invincibility: false,
        repellent: false,
        magnet: false
    };
    let hasCrucifix = false;
    let crucifixTimer = 0;
    const rgbColors = [
        [255, 0, 0],   // Red
        [0, 255, 0],   // Green
        [0, 0, 255]    // Blue
    ];

    const ambientSound = play("ambient", { loop: true, volume: 0.5 });

    add([sprite("background"), scale(0.7)]);

    const player = createPlayer();
    const flashlight = createFlashlight();
    if (flashlightRadius) {
        increaseFlashlightSize(flashlight, flashlightRadius - getFlashlightRadius());
    }
    const ui = createUI(score, TARGET_SCORE, timeLeft, sanity, batteryLevel, candyCount);

    spawnGhost(level, player);
    spawnPowerUp();

    function collectCandy() {
        candyCount++;
        updateUI(ui, score, TARGET_SCORE, timeLeft, sanity, batteryLevel, activePowerUps, hasCrucifix, candyCount);
    }

    function checkLevelCompletion() {
        if (score >= TARGET_SCORE) {
            play("levelComplete", { volume: 0.5 });
            go("upgradeScene", { candyCount, level: level + 1, sanity, flashlight });
        }
    }

    function activateCrucifix() {
        hasCrucifix = true;
        crucifixTimer = CRUCIFIX_DURATION;
    }

    onCollide("player", "crucifix", (p, c) => {
        destroy(c);
        activateCrucifix();
        play("powerup");
    });

    function activatePowerUp(type) {
        activePowerUps[type] = true;
        
        if (type === "speed") {
            player.speed = PLAYER_SPEED * 1.5;
        }
        
        wait(POWERUP_DURATION, () => {
            activePowerUps[type] = false;
            if (type === "speed") {
                player.speed = PLAYER_SPEED;
            }
        });
    }

    function stunGhost(ghost) {
        if (!ghost.stunned) {
            ghost.stunned = true;
            ghost.stunTime = 2;
            ghost.opacity = 1;
        }
    }

    onKeyPress("space", () => {
        flashlightOn = !flashlightOn;
        flashlight.opacity = flashlightOn ? FLASHLIGHT_BASE_OPACITY : 0;
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
        collectCandy();
        checkLevelCompletion();
    });

    onCollide("player", "ghost", (p, g) => {
        if (hasCrucifix) {
            destroy(g);
            score += EXORCISM_POINTS;
            play("exorcism");
            checkLevelCompletion();
        } else if (!activePowerUps.invincibility && !g.stunned) {
            sanity -= 10;
            play("jumpscare");
            shake(5);
        }
    });

    onCollide("player", "pumpkin", (p, pumpkin) => {
        destroy(pumpkin);
        score += 20;
        play("collect");
        checkLevelCompletion();
    });

    onCollide("player", "powerup", (p, powerup) => {
        destroy(powerup);
        activatePowerUp(powerup.type);
        play("powerup");
    });

    onUpdate(() => {
        movePlayer(player);
        const flashlightStatus = updateFlashlight(flashlight, player, flashlightOn, batteryLevel);
        flashlightOn = flashlightStatus.flashlightOn;
        batteryLevel = flashlightStatus.batteryLevel;

        updateWeather();
        if (currentWeather === "clear") {
            clearWeather();
        }

        get("ghost").forEach(ghost => {
            if (!ghost.stunned) {
                ghost.opacity = GHOST_BASE_OPACITY * getVisibilityFactor();
                
                if (activePowerUps.repellent) {
                    const repelDir = ghost.pos.sub(player.pos).unit();
                    ghost.move(repelDir.scale(ghost.baseSpeed * dt()));
                } else {
                    const dir = player.pos.sub(ghost.pos).unit();
                    ghost.move(dir.scale(ghost.baseSpeed * dt()));
                }
            }
        });

        if (activePowerUps.magnet) {
            get("candy").forEach(candy => {
                const dir = player.pos.sub(candy.pos).unit();
                candy.move(dir.scale(2000 * dt()));
            });
            get("pumpkin").forEach(pumpkin => {
                const dir = player.pos.sub(pumpkin.pos).unit();
                pumpkin.move(dir.scale(2000 * dt()));
            });
        }

        const difficultyFactor = getDifficultyFactor();
        if (rand(0, 100) < 2 * difficultyFactor) {
            spawnCandy(level);
        }
        if (rand(0, 200) < 1 * difficultyFactor) {
            spawnPumpkin(level);
        }

        timeLeft -= dt();

        if (timeLeft <= 0 || sanity <= 0) {
            ambientSound.stop();
            go("gameOver", { score, level });
        }

        if (rand() < CRUCIFIX_SPAWN_CHANCE) {
            spawnCrucifix();
        }

        if (hasCrucifix) {
            crucifixTimer -= dt();
            if (crucifixTimer <= 0) {
                hasCrucifix = false;
                player.use(color(255, 255, 255));
            } else {
                rgbIndex = Math.floor(time() * 10) % rgbColors.length;
                player.use(color(rgbColors[rgbIndex]));
            }
        }

        if (level === 1) { 
            add([
                text("Press SPACE to use your flashlight!", { size: 24 }),
                pos(width() / 2, height() - 50),
                anchor("center"),
                color(255, 255, 0),
                lifespan(5)
            ]);
            console.log("Tutorial message added");
        }

        updateUI(ui, score, TARGET_SCORE, timeLeft, sanity, batteryLevel, activePowerUps, hasCrucifix, candyCount);
    });
}
