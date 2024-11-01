// upgradeScene.js

function upgradeScene({ candyCount, level, sanity, flashlight }) {
    add([sprite("background"), scale(0.7)]);

    const candyCountText = add([
        text(`Candies: ${candyCount}`, 18),
        pos(20, 60),
        color(255, 255, 0),
    ]);

    add([
        text("Upgrade Menu", 24),
        pos(width() / 2, 20),
        anchor("center"),
        color(255, 255, 255),
    ]);

    const upgrades = [
        { 
            name: "Speed", 
            cost: UPGRADE_COSTS.speed, 
            upgrade: () => increasePlayerSpeed(20) 
        },
        { 
            name: "Power Duration", 
            cost: UPGRADE_COSTS.powerDuration, 
            upgrade: () => increasePowerupDuration(2) 
        },
        { 
            name: "Flashlight Size", 
            cost: UPGRADE_COSTS.flashlight, 
            upgrade: () => {
                increaseFlashlightSize(flashlight, 10);
                return `Flashlight size increased to ${getFlashlightRadius()}`;
            }
        },
    ];

    upgrades.forEach((upgrade, index) => {
        add([
            rect(600, 40), // Width and height of the rectangle
            pos(20, 100 + index * 30), // Position it below each option
            color(0, 0, 0, 0.7), // Black with some transparency
            anchor("topleft"),
        ]);
        add([
            text(`${index + 1}. ${upgrade.name} - Cost: ${upgrade.cost}`, 18),
            pos(20, 100 + index * 30),
            color(255, 255, 255),
        ]);
    });

    function attemptUpgrade(upgrade) {
        if (candyCount >= upgrade.cost) {
            candyCount -= upgrade.cost;
            const result = upgrade.upgrade();
            play("powerup");
            add([
                text(result || "Upgrade successful!", 16),
                pos(width() / 2, height() - 40),
                color(0, 255, 0),
                anchor("center"),
                lifespan(1)
            ]);
            candyCountText.text = `Candies: ${candyCount}`;
        } else {
            add([
                text("Not enough candies!", 16),
                pos(width() / 2, height() - 40),
                color(255, 0, 0),
                anchor("center"),
                lifespan(1)
            ]);
        }
    }

    onKeyPress("1", () => attemptUpgrade(upgrades[0]));
    onKeyPress("2", () => attemptUpgrade(upgrades[1]));
    onKeyPress("3", () => attemptUpgrade(upgrades[2]));

    add([
        text("Press ENTER to continue", 18),
        pos(width() / 2, height() - 80),
        anchor("center"),
        color(255, 255, 255),
    ]);

    onKeyPress("enter", () => go("game", { level, sanity, candyCount, flashlightRadius: getFlashlightRadius() }));
}
