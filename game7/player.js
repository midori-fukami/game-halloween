function createPlayer() {
    return add([
        sprite("player"),
        pos(width() / 2, height() / 2),
        area({ width: PLAYER_WIDTH, height: PLAYER_HEIGHT }),
        {
            speed: PLAYER_SPEED,
            powerUpActive: false
        },
        "player"
    ]);
}

function movePlayer(player) {
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
}
