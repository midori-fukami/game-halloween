function spawnCandy(level) {
    add([
        sprite("candy"),
        pos(rand(LEFT_MARGIN, width() - RIGHT_MARGIN), rand(TOP_MARGIN, height() - BOTTOM_MARGIN)),
        area(),
        "candy"
    ]);
    wait(rand(0.5, 1.5) / level, () => spawnCandy(level));
}

function spawnGhost(level, player) {
    if (get("ghost").length < MAX_GHOSTS) {
        const ghostSpeed = BASE_GHOST_SPEED + (level * 50);
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
    }
    wait(rand(2, 4) / level, () => spawnGhost(level, player));
}

function spawnPumpkin(level) {
    add([
        sprite("pumpkin"),
        pos(rand(LEFT_MARGIN, width() - RIGHT_MARGIN), rand(TOP_MARGIN, height() - BOTTOM_MARGIN)),
        area(),
        "pumpkin"
    ]);
    wait(rand(2, 5) / level, () => spawnPumpkin(level));
}

function spawnPowerUp() {
    add([
        sprite("powerup"),
        pos(rand(LEFT_MARGIN, width() - RIGHT_MARGIN), rand(TOP_MARGIN, height() - BOTTOM_MARGIN)),
        area(),
        "powerup"
    ]);
    wait(rand(15, 20), spawnPowerUp);
}
