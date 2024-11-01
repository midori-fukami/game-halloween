  // Define the game scene
  scene("game", (level = 1) => {
    let SPEED = 200;
    let timeLeft = 30;
    let score = 0;
    const TARGET_SCORE = level * 50;
  
    // Add player
    const player = add([
      sprite("player"),
      pos(width() / 2, height() / 2),
      area(),
      scale(1),
      "player"
    ]);
  
    // Player movement with boundaries
    onKeyDown("left", () => {
      player.move(-SPEED, 0);
      player.pos.x = Math.max(player.width / 2, player.pos.x);
    });
    onKeyDown("right", () => {
      player.move(SPEED, 0);
      player.pos.x = Math.min(width() - player.width / 2, player.pos.x);
    });
    onKeyDown("up", () => {
      player.move(0, -SPEED);
      player.pos.y = Math.max(player.height / 2, player.pos.y);
    });
    onKeyDown("down", () => {
      player.move(0, SPEED);
      player.pos.y = Math.min(height() - player.height / 2, player.pos.y);
    });
  
    // Spawn candy
    function spawnCandy() {
      add([
        sprite("candy"),
        pos(rand(50, width() - 50), rand(50, height() - 50)),
        area(),
        scale(2),
        "candy"
      ]);
      wait(rand(1, 3) / level, spawnCandy);
    }
    spawnCandy();
  
    // Spawn ghosts
    function spawnGhost() {
      add([
        sprite("ghost"),
        pos(rand(50, width() - 50), rand(50, height() - 50)),
        area(),
        scale(2),
        "ghost"
      ]);
      wait(rand(3, 6) / level, spawnGhost);
    }
    spawnGhost();
  
    // Spawn pumpkins
    function spawnPumpkin() {
      add([
        sprite("pumpkin"),
        pos(rand(50, width() - 50), rand(50, height() - 50)),
        area(),
        scale(2),
        "pumpkin"
      ]);
      wait(rand(5, 10), spawnPumpkin);
    }
    spawnPumpkin();
  
    // Spawn power-ups
    function spawnPowerUp() {
      add([
        sprite("powerup"),
        pos(rand(50, width() - 50), rand(50, height() - 50)),
        area(),
        scale(2),
        "powerup"
      ]);
      wait(rand(10, 15), spawnPowerUp);
    }
    spawnPowerUp();
  
    // Score
    const scoreText = add([
      text(`Score: ${score}`),
      pos(20, 20),
      scale(1)
    ]);
  
    // Timer
    const timerText = add([
      text(`Time: ${timeLeft}`),
      pos(20, 50),
      scale(1)
    ]);
  
    // Level
    const levelText = add([
      text(`Level: ${level}`),
      pos(20, 80),
      scale(1)
    ]);
  
    // Target score
    const targetText = add([
      text(`Target: ${TARGET_SCORE}`),
      pos(20, 110),
      scale(1)
    ]);
  
    // Update timer
    onUpdate(() => {
      timeLeft -= dt();
      timerText.text = `Time: ${Math.ceil(timeLeft)}`;
      if (timeLeft <= 0) {
        go("gameOver", score, level);
      }
    });
  
    // Candy collection
    onCollide("player", "candy", (p, c) => {
      destroy(c);
      score += 10;
      scoreText.text = `Score: ${score}`;
      play("collect");
      if (score >= TARGET_SCORE) {
        play("levelComplete");
        go("game", level + 1);
      }
    });
  
    // Pumpkin collection
    onCollide("player", "pumpkin", (p, c) => {
      destroy(c);
      score += 20;
      scoreText.text = `Score: ${score}`;
      play("collect");
      if (score >= TARGET_SCORE) {
        play("levelComplete");
        go("game", level + 1);
      }
    });
  
    // Power-up collection
    onCollide("player", "powerup", (p, c) => {
      destroy(c);
      SPEED = 300;
      play("collect");
      player.use(color(0, 255, 0, 0.5)); // Semi-transparent green overlay
      wait(5, () => {
        SPEED = 200;
        player.use(color(255, 255, 255)); // Reset to white (no tint)
      });
    });
  
    // Game over on ghost collision
    player.onCollide("ghost", () => {
      go("gameOver", score, level);
    });
  });
  
  // Game over scene
  scene("gameOver", (score, level) => {
    add([
      text(`Game Over!\nScore: ${score}\nLevel: ${level}\nPress space to restart`),
      pos(width() / 2, height() / 2),
      anchor("center"),
      scale(1)
    ]);
  
    onKeyPress("space", () => {
      go("game", 1);
    });
  });
  
  // Start the game
  go("game", 1);
  