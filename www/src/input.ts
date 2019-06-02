var KEY = {
    SPACE:    32,
    LEFT:     37,
    RIGHT:    39,
    UP:       38,

    W:    87,
    A:    65,
    D:    68,
};
var INPUT = {
    LEFT: 0,
    RIGHT: 1,
    JUMP: 2,
};

var input = [[false, false, false],[false, false, false]];

function onkey(ev: KeyboardEvent, key: number, pressed: boolean) {
    switch(key) {
      case KEY.LEFT:  input[0][INPUT.LEFT] = pressed; ev.preventDefault(); break;
      case KEY.RIGHT: input[0][INPUT.RIGHT] = pressed; ev.preventDefault(); break;
      case KEY.UP: input[0][INPUT.JUMP]  = pressed; ev.preventDefault(); break;

      case KEY.W:  input[1][INPUT.JUMP] = pressed; ev.preventDefault(); break;
      case KEY.A: input[1][INPUT.LEFT] = pressed; ev.preventDefault(); break;
      case KEY.D: input[1][INPUT.RIGHT]  = pressed; ev.preventDefault(); break;
    }
}

document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);