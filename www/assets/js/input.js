var KEY = {
    SPACE:    32,
    LEFT:     37,
    RIGHT:    39,
};
var INPUT = {
    LEFT: 0,
    RIGHT: 1,
    JUMP: 2
};

var input = [false, false, false];

function onkey(ev, key, pressed) {
    switch(key) {
      case KEY.LEFT:  input[INPUT.LEFT] = pressed; ev.preventDefault(); break;
      case KEY.RIGHT: input[INPUT.RIGHT] = pressed; ev.preventDefault(); break;
      case KEY.SPACE: input[INPUT.JUMP]  = pressed; ev.preventDefault(); break;
    }
}

document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);