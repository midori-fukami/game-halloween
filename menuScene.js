// menuScene.js

function menuScene() {
    // Add background
    add([
        sprite("startBackground"),
        scale(0.7)
    ]);

    // Add title
    add([
        text("Halloween Horror", 48),
        pos(width() / 2, height() / 4),
        anchor("center"),
        color(255, 0, 0),
    ]);

    // Add start instruction
    const startText = add([
        text("Press SPACE to start", 24),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 255, 255),
    ]);

    // Add blinking effect to start text
    let visible = true;
    loop(0.5, () => {
        visible = !visible;
        startText.opacity = visible ? 1 : 0;
    });

    // Add credits or additional info
    add([
        text("Created by AI with help from Midori", 16),
        pos(width() / 2, height() - 20),
        anchor("center"),
        color(200, 200, 200),
    ]);

    // Handle start game
    onKeyPress("space", () => {
        // Initial game state
        const initialGameState = {
            level: 1,
            sanity: 100,
            candyCount: 0,
            flashlightRadius: getFlashlightRadius() // Assuming this function exists in flashlight.js
        };

        // Transition to game scene
        go("game", initialGameState);
    });

    // Optional: Add background music
    const menuMusic = play("ambient", {
        loop: true,
        volume: 0.5
    });

    // Stop music when leaving the scene
    onSceneLeave(() => {
        menuMusic.stop();
    });
}
