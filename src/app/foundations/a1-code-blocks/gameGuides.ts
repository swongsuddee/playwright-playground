// Acceptance criteria + a build guide (pseudocode) for each A3 bonus game.
//
// The playground is a QA training app, so every game gets treated like a real
// feature: first the ACCEPTANCE CRITERIA (what "done" means — the checklist you
// could later turn into tests), then a step-by-step BUILD GUIDE with
// language-neutral pseudocode. Rendered by GameGuide.tsx on each game page.

export type BuildStep = {
  title: string;
  detail: string;
  pseudo?: string; // language-neutral pseudocode
};

export type GameGuide = {
  intro: string; // one line framing the spec
  acceptance: string[]; // testable "the game is done when…" statements
  build: BuildStep[]; // ordered steps with pseudocode
};

export const GAME_GUIDES: Record<string, GameGuide> = {
  /* ── Maze ──────────────────────────────────────────────────────────────── */
  maze: {
    intro: "A cursor-steering game: get from START to the GOAL without touching a wall.",
    acceptance: [
      "The board shows a maze with exactly one green START, one red GOAL, safe path cells, and wall cells.",
      "On load the game is idle and tells the player to move onto START to begin.",
      "Moving the cursor onto START while idle arms the game (status becomes “playing”).",
      "While playing, touching a wall cell fails the run, increases the “walls hit” count, and asks the player to return to START.",
      "While playing, moving the cursor off the whole board also counts as a fail.",
      "Reaching the GOAL while playing wins the game and reports how many walls were hit.",
      "A Reset control returns the game to idle and sets “walls hit” back to 0.",
    ],
    build: [
      {
        title: "Model the maze as a grid",
        detail: "Each cell is one character: wall, path, start or goal. This is your only source of truth for the layout.",
        pseudo: `MAZE = [
  "#############",
  "#E.........##",
  ...
  "#S..........#",
]
// '#' wall   '.' path   'S' start   'E' goal (end)`,
      },
      {
        title: "Keep two pieces of state",
        detail: "One variable for where you are in the game, one counter for mistakes.",
        pseudo: `status   = "idle"   // idle | playing | won | failed
wallsHit = 0`,
      },
      {
        title: "React when the cursor enters a cell",
        detail: "The whole game is one event handler that branches on the cell type — this is your first big “if / else”.",
        pseudo: `on cursorEnters(cellType):
  if cellType == 'S' and status != "playing":
      status = "playing"            // touch START to (re)arm
  else if cellType == 'E' and status == "playing":
      status = "won"
  else if cellType == '#' and status == "playing":
      status   = "failed"
      wallsHit = wallsHit + 1
  // '.' path cells are safe — do nothing`,
      },
      {
        title: "Leaving the board is also a wall",
        detail: "Cheaters would dodge walls by going around the outside — close that gap.",
        pseudo: `on cursorLeavesBoard():
  if status == "playing":
      status   = "failed"
      wallsHit = wallsHit + 1`,
      },
      {
        title: "Reset + show a message that matches the status",
        detail: "Give the player feedback for every state, and a way to start over.",
        pseudo: `on reset():
  status = "idle"; wallsHit = 0

message = {
  idle:    "Move onto the green START to begin.",
  playing: "Trace the path to the red goal!",
  failed:  "You hit a wall — go back to START.",
  won:     "You reached the goal! Walls hit: " + wallsHit,
}[status]`,
      },
    ],
  },

  /* ── Flappy Bird ───────────────────────────────────────────────────────── */
  flappy: {
    intro: "Tap to flap a bird through moving pipes; each pipe passed scores a point.",
    acceptance: [
      "On load the board is idle, shows a “tap / press Space to flap” hint, and shows Score and Best.",
      "Tapping the board or pressing Space/↑ while idle starts a run and gives the bird one upward flap.",
      "While playing, the bird constantly accelerates downward (gravity); each flap sets an upward speed.",
      "Pipes move steadily leftward and new pipes keep appearing with a gap to fly through.",
      "The score increases by 1 each time the bird fully passes a pipe.",
      "Touching a pipe or the ground ends the run and the message shows how many pipes were cleared.",
      "Best score is remembered and updates whenever a run beats it.",
      "Reset returns the game to idle with Score 0 (Best is unchanged).",
    ],
    build: [
      {
        title: "Set up state and the tuning constants",
        detail: "Position and speed are just numbers. The constants are the “feel” of the game — change them later to make it easier or harder.",
        pseudo: `birdY, birdVel                 // bird's height and vertical speed
pipes = []                     // each pipe: { x, gapY, passed }
status = "idle"; score = 0

GRAVITY       =  1600          // pulls the bird down every second
FLAP_VELOCITY =  -430          // negative = upward kick
PIPE_SPEED    =   158          // how fast pipes slide left
GAP           =   158          // size of the opening`,
      },
      {
        title: "Handle the flap input",
        detail: "One action does two jobs: it starts the game from idle, and it kicks the bird up.",
        pseudo: `on flap():
  if status == "idle":
      reset the bird to the middle; pipes = []
      status = "playing"; startLoop()
  birdVel = FLAP_VELOCITY`,
      },
      {
        title: "Run the game loop every frame",
        detail: "This is a forever-loop. dt = seconds since the last frame keeps motion smooth on any device.",
        pseudo: `loop(dt):
  birdVel = birdVel + GRAVITY * dt      // gravity
  birdY   = birdY   + birdVel * dt      // move the bird

  for p in pipes: p.x = p.x - PIPE_SPEED * dt
  drop pipes that scrolled off the left
  if the last pipe is far enough left:
      add a new pipe with a random gapY

  for p in pipes:                        // scoring
      if not p.passed and p.x + width < birdX:
          p.passed = true; score = score + 1

  if birdHitsPipe() or birdY off-screen:
      gameOver()
  else:
      requestNextFrame(loop)`,
      },
      {
        title: "Detect a collision",
        detail: "The bird is a circle; each pipe is two rectangles with a gap. A hit is any overlap, or the bird leaving the top/bottom.",
        pseudo: `birdHitsPipe():
  for p in pipes:
     if bird overlaps p.x .. p.x+width horizontally:
        topGap    = p.gapY - GAP/2
        bottomGap = p.gapY + GAP/2
        if birdTop < topGap or birdBottom > bottomGap:
           return true
  return false`,
      },
      {
        title: "Game over and reset",
        detail: "Stop the loop, remember the best score, and let the player try again.",
        pseudo: `gameOver():
  status = "dead"; stopLoop()
  best = max(best, score)     // and save it

on reset():
  stopLoop(); pipes = []; center the bird
  score = 0; status = "idle"`,
      },
    ],
  },

  /* ── Angry Birds ───────────────────────────────────────────────────────── */
  "angry-birds": {
    intro: "Drag a slingshot to launch a bird and knock out every pig before you run out of birds.",
    acceptance: [
      "The scene shows a slingshot with a bird ready, a wooden structure, and 3 pigs; the HUD shows Birds left = 3 and Pigs left = 3.",
      "While a bird is ready, dragging it back on the slingshot aims the shot and shows a trajectory preview.",
      "Releasing launches the bird; the pull direction and distance set the launch angle and power.",
      "The launched bird flies under gravity and bounces off the wooden blocks and the ground.",
      "Hitting a pig removes that pig and decreases Pigs left.",
      "When a shot comes to rest or leaves the scene, the next bird loads and Birds left decreases (unless the level is already won).",
      "Clearing every pig wins the level; running out of birds with pigs remaining loses it.",
      "Reset restores 3 birds, 3 pigs, and the ready state.",
    ],
    build: [
      {
        title: "Model the scene",
        detail: "The bird carries a position and a velocity. Pigs and blocks are just shapes placed in the world.",
        pseudo: `anchor = slingshot fork point
bird   = { x, y, vx, vy }      // vx,vy = speed in each direction
pigs   = [ {x, y}, ... ]        // circles to clear
blocks = [ {x, y, w, h}, ... ]  // rectangles to bounce off
birdsLeft = 3; status = "ready"
GRAVITY = 1000; MAX_PULL = 74; K = 11   // launch power factor`,
      },
      {
        title: "Aim by dragging",
        detail: "The player pulls the bird back from the anchor. Clamp the pull so it can’t be dragged infinitely far.",
        pseudo: `on drag(point):
  pull = point - anchor
  if length(pull) > MAX_PULL:
      pull = pull scaled down to MAX_PULL
  bird.pos = anchor + pull
  drawTrajectoryPreview(bird.pos)   // dotted arc`,
      },
      {
        title: "Launch on release",
        detail: "Velocity points from the pulled-back bird back toward the anchor — pull down-left to fire up-right.",
        pseudo: `on release():
  bird.vx = (anchor.x - bird.x) * K
  bird.vy = (anchor.y - bird.y) * K
  status  = "flying"`,
      },
      {
        title: "Fly, bounce, and pop pigs in the loop",
        detail: "Same game loop as before: gravity + move, then check everything the bird could touch.",
        pseudo: `loop(dt):
  if status != "flying": return
  bird.vy = bird.vy + GRAVITY * dt
  bird.x  = bird.x + bird.vx * dt
  bird.y  = bird.y + bird.vy * dt

  if bird hits ground: reverse & damp bird.vy
  for block in blocks: resolveBounce(bird, block)
  for pig in pigs:
     if distance(bird, pig) < birdR + pigR:
         remove pig                       // pop!
  if bird resting or off-screen: endShot()`,
      },
      {
        title: "Resolve the end of each shot",
        detail: "This is the win/lose logic — the “if / else if / else” that decides what happens next.",
        pseudo: `endShot():
  if pigs is empty:
      status = "won"
  else:
      birdsLeft = birdsLeft - 1
      if birdsLeft == 0:
          status = "lost"
      else:
          load a fresh bird onto the sling
          status = "ready"`,
      },
      {
        title: "Reset the level",
        detail: "Put every pig and bird back and return to the ready state.",
        pseudo: `on reset():
  pigs = full list again; blocks unchanged
  bird = fresh bird at anchor
  birdsLeft = 3; status = "ready"`,
      },
    ],
  },
};
