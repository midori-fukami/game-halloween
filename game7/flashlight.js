function createFlashlight() {
    const flashlightPoints = [];
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        flashlightPoints.push(vec2(
            Math.cos(angle) * FLASHLIGHT_RADIUS,
            Math.sin(angle) * FLASHLIGHT_RADIUS
        ));
    }

    return add([
        polygon(flashlightPoints),
        pos(0, 0),
        color(255, 255, 0, 0.3),
        anchor("center"),
        area(),
        opacity(0),
        "flashlight"
    ]);
}

function updateFlashlight(flashlight, player, flashlightOn, batteryLevel) {
    flashlight.pos = vec2(
        player.pos.x + PLAYER_WIDTH / 2,
        player.pos.y + PLAYER_HEIGHT / 2
    );

    if (flashlightOn) {
        batteryLevel = Math.max(0, batteryLevel - 0.1);
        if (batteryLevel <= 0) {
            flashlightOn = false;
            flashlight.opacity = 0;
        } else {
            flashlight.opacity = FLASHLIGHT_BASE_OPACITY * getVisibilityFactor();
        }
    } else {
        batteryLevel = Math.min(FLASHLIGHT_BATTERY, batteryLevel + 0.05);
        flashlight.opacity = 0;
    }

    return { flashlightOn, batteryLevel };
}

