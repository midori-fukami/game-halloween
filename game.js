
scene("game", () => {
    // Player
    const player = add([
      sprite("player"),
      pos(width() / 2, height() / 2),
      area(),
      scale(0.5),
      "player"
    ]);
  
    // Player movement
    const SPEED = 100;
    onKeyDown("left", () => {
      player.move(-SPEED, 0);
    });
    onKeyDown("right", () => {
      player.move(SPEED, 0);
    });
    onKeyDown("up", () => {
      player.move(0, -SPEED);
    });
    onKeyDown("down", () => {
      player.move(0, SPEED);
    });
  
    // Spawn candy
    function spawnCandy() {
        add([
          sprite("candy"),
          pos(rand(0, width()), rand(0, height())),
          area(),
          scale(2),
          "candy"
        ]);
        wait(rand(1, 3), spawnCandy);
      }
      spawnCandy();
  
    // Spawn ghosts
    function spawnGhost() {
        add([
        sprite("ghost"),
        pos(rand(0, width()), rand(0, height())),
        area(),
        scale(1),
        "ghost"
        ]);
        wait(rand(3, 6), spawnGhost);
    }
    spawnGhost();
  
    // Score
  let score = 0;
  const scoreText = add([
    text(score),
    pos(20, 20),
    scale(2)
  ]);

  // Candy collection
  onCollide("player", "candy", (p, c) => {
    destroy(c);
    score += 10;
    scoreText.text = score;
    play("collect")
  });

  // Game over on ghost collision
  player.onCollide("ghost", () => {
    play("gameover")
    go("gameOver", score);
  });
});

// Game over scene
scene("gameOver", (score) => {
  add([
    text(`Game Over!\nScore: ${score}\nPress space to restart`),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(1)
  ]);

  onKeyPress("space", () => {
    go("game");
  });
});

// Start the game
go("game");