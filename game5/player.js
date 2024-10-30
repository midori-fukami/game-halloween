var Player = {
    create: function(game) {
        return game.add([
            game.sprite("player"),
            game.pos(716 / 2, 716 / 2),
            game.area(),
            "player",
            { flashlight: true, batteryLife: 100 }
        ]);
    },
    update: function(game, player, sanity) {
        const SPEED = 200;

        if (game.isKeyDown("left")) player.move(-SPEED, 0);
        if (game.isKeyDown("right")) player.move(SPEED, 0);
        if (game.isKeyDown("up")) player.move(0, -SPEED);
        if (game.isKeyDown("down")) player.move(0, SPEED);

        if (game.isKeyPressed("space")) {
            player.flashlight = !player.flashlight;
        }

        if (player.flashlight) {
            player.batteryLife -= 0.1;
            if (player.batteryLife <= 0) {
                player.flashlight = false;
            }
        } else {
            player.batteryLife = Math.min(player.batteryLife + 0.05, 100);
        }

        if (player.flashlight) {
            game.drawCircle({
                pos: player.pos,
                radius: 100,
                color: game.color(255, 255, 200, 0.1),
            });
        }
    }
};
