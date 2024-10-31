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
    const PLAYER_WIDTH = 32; // Adjust based on your player sprite
    const PLAYER_HEIGHT = 32; // Adjust based on your player sprite

    // Play ambient sound
    const ambientSound = play("ambient", {
        loop: true,
        volume: 0.5
    });

    add([
        sprite("background"),
        scale(0.7),
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

    const FLASHLIGHT_RADIUS = 100;
    const FLASHLIGHT_SEGMENTS = 16; // Number of segments to approximate the circle

    // Create polygon points for a circle
    const flashlightPoints = [];
    for (let i = 0; i < FLASHLIGHT_SEGMENTS; i++) {
        const angle = (i / FLASHLIGHT_SEGMENTS) * Math.PI * 2;
        flashlightPoints.push(vec2(
            Math.cos(angle) * FLASHLIGHT_RADIUS,
            Math.sin(angle) * FLASHLIGHT_RADIUS
        ));
    }

    const flashlight = add([
        polygon(flashlightPoints),
        color(255, 255, 0, 0.3),  // Yellow with 30% opacity
        pos(0, 0),
        anchor("center"),
        area(),
        opacity(0),  // Start with flashlight off
        "flashlight"
    ]);

    let flashlightOn = false;
    const FLASHLIGHT_BATTERY = 100;
    let batteryLevel = FLASHLIGHT_BATTERY;

    // Battery UI
    const batteryUI = add([
        text(`Battery: ${batteryLevel}%`),
        pos(20, 110),
        color(255, 255, 255),
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
            opacity(0.5),
            "ghost",
            {
                speed: rand(ghostSpeed * 0.8, ghostSpeed * 1.2),
                stunned: false,
                stunTime: 0
            },
        ]);
    
        ghost.onCollide("flashlight", () => {
            if (flashlightOn && !ghost.stunned) {
                stunGhost(ghost);
            }
        });
    
        ghost.onUpdate(() => {
            if (ghost.stunTime > 0) {
                ghost.stunTime -= dt();
                if (ghost.stunTime <= 0) {
                    ghost.stunned = false;
                    ghost.opacity = 0.5;
                }
            }
    
            if (!ghost.stunned) {
                const dir = player.pos.sub(ghost.pos).unit();
                ghost.move(dir.scale(ghost.speed * dt()));
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

    // Player movement and flashlight update
    onUpdate(() => {
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

        // Flashlight update
        flashlight.pos = vec2(
            player.pos.x + PLAYER_WIDTH + PLAYER_WIDTH/2,
            player.pos.y + PLAYER_HEIGHT + PLAYER_HEIGHT/2
        );

        if (flashlightOn) {
            // Drain battery
            batteryLevel = Math.max(0, batteryLevel - 0.1);
            if (batteryLevel <= 0) {
                flashlightOn = false;
                flashlight.opacity = 0;
            }
        } else {
            // Recharge battery when off
            batteryLevel = Math.min(FLASHLIGHT_BATTERY, batteryLevel + 0.05);
        }

        batteryUI.text = `Battery: ${Math.floor(batteryLevel)}%`;
    });


    // Flashlight toggle
    onKeyPress("f", () => {
        flashlightOn = !flashlightOn;
        flashlight.opacity = flashlightOn ? 0.3 : 0;
        play("flashlightClick");  // Assuming you have this sound

        // Check for ghosts in the flashlight area when turned on
        if (flashlightOn) {
            every("ghost", (ghost) => {
                if (ghost.isColliding(flashlight) && !ghost.stunned) {
                    stunGhost(ghost);
                }
            });
        }
    });

    function stunGhost(ghost) {
        ghost.stunned = true;
        ghost.stunTime = 2;
        ghost.opacity = 1;
        play("ghostStun");
    }

    onCollide("player", "candy", (p, c) => {
        destroy(c);
        score += 10;
        scoreText.text = `Score: ${score}/${TARGET_SCORE}`;
        play("collect");
        if (score >= TARGET_SCORE) {
            play("levelComplete");
            go("game", { level: level + 1, sanity: 100 });
        }
    });

    // Update the player-ghost collision handler
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
        scoreText.text = `Score: ${score}/${TARGET_SCORE}`;
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

    // Flashlight effect on ghosts
    onCollide("ghost", "flashlight", (g, f) => {
        console.log("ghost touch flashlight")
        if (flashlightOn && !g.stunned) {
            g.stunned = true;
            g.stunTime = 2;  // Stun for 2 seconds
            g.opacity = 1;  // Make ghost fully visible when stunned
            //play("ghostStun");  // Assuming you have this sound
        }
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
    });
}
