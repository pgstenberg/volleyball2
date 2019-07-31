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
    ROLLBACK: 3,
};

function onkey(ev: KeyboardEvent, key: number, pressed: boolean) {
    let input = Global.Input;
    switch(key) {
      case KEY.LEFT:  input[INPUT.LEFT] = pressed; ev.preventDefault(); break;
      case KEY.RIGHT: input[INPUT.RIGHT] = pressed; ev.preventDefault(); break;
      case KEY.UP: input[INPUT.JUMP]  = pressed; ev.preventDefault(); break;
      case KEY.A: input[INPUT.ROLLBACK]  = pressed; ev.preventDefault(); break;
    }
    Global.Input = input;
}

document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);