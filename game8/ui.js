function createUI(score, TARGET_SCORE, timeLeft, sanity, batteryLevel) {
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

    const batteryUI = add([
        text(`Battery: ${batteryLevel}%`),
        pos(20, 110),
        color(255, 255, 255),
    ]);

    const powerUpUI = add([
        text(""),
        pos(20, 140),
        color(255, 255, 255),
    ]);

    return { scoreText, timerText, sanityMeter, batteryUI, powerUpUI };
}

function updateUI(ui, score, TARGET_SCORE, timeLeft, sanity, batteryLevel, activePowerUps, hasCrucifix) {
    ui.scoreText.text = `Score: ${score}/${TARGET_SCORE}`;
    ui.timerText.text = `Time: ${Math.ceil(timeLeft)}`;
    ui.sanityMeter.width = (sanity / 100) * 200;
    ui.sanityMeter.color = sanity > 50 ? rgb(0, 255, 0) : rgb(255, 0, 0);
    ui.batteryUI.text = `Battery: ${Math.floor(batteryLevel)}%`;

    let activePowerUpsText = "Active Power-ups: ";
    for (const [type, active] of Object.entries(activePowerUps)) {
        if (active) {
            activePowerUpsText += `${type} `;
        }
    }
    if (hasCrucifix) {
        activePowerUpsText += "Crucifix ";
    }
    ui.powerUpUI.text = activePowerUpsText;
}
