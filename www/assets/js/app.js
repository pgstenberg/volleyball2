var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var components = {
    'CONSTANTS.COMPONENT.TRANSFORM': function () {
        return {
            x: 0,
            y: 0
        };
    },
    'CONSTANTS.COMPONENT.VELOCITY': function () {
        return {
            x: 0,
            y: 0
        };
    },
    'CONSTANTS.COMPONENT.INPUT': function () {
        return {
            0: [false, false, false]
        };
    },
    'CONSTANTS.COMPONENT.GRAPHICS': function () {
        return new PIXI.Graphics();
    },
    'CONSTANTS.COMPONENT.JUMPING': function () {
        return {
            isJumping: false
        };
    },
    'CONSTANTS.COMPONENT.BALL': function () {
        return;
    },
};
var CONSTANTS = {
    KEY: {
        SPACE: 32,
        LEFT: 37,
        RIGHT: 39,
    },
    INPUT: {
        LEFT: 0,
        RIGHT: 1,
        JUMP: 2
    },
    COMPONENT: {
        INPUT: 'input',
        TRANSFORM: 'transform',
        VELOCITY: 'velocity',
        GRAPHICS: 'graphics',
        JUMPING: 'jumping',
        BALL: 'ball'
    },
    PHYSICS: {
        PLAYER: {
            VELOCITY_X: 4,
            MAX_VELOCITY_X: 20,
            JUMP_VELOCITY: (8 * 3),
            JUMP_MIN_VELOCITY: 6
        },
        MAX_GRAVITY: 3,
        MIN_GRAVITY: 1
    }
};
var Utils = (function () {
    function Utils() {
    }
    Utils.UUID = function () {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    return Utils;
}());
var System = (function () {
    function System() {
    }
    System.prototype.update = function (entityManager, delta, tick) {
        throw new Error('You have to implement this function!');
    };
    return System;
}());
var EntityManager = (function () {
    function EntityManager(componentFactories) {
        this._entities = {};
        this._componentFactories = {};
        this._componentFactories = componentFactories;
    }
    EntityManager.prototype.addComponentFactory = function (cType, factory) {
        this._componentFactories[cType] = factory;
    };
    EntityManager.prototype.createEntity = function () {
        var id = Utils.UUID();
        this._entities[id] = {};
        return id;
    };
    EntityManager.prototype.createComponent = function (id, cType) {
        var self = this;
        this._entities[id][cType] = self._componentFactories[Object.keys(this._componentFactories).find(function (cf) {
            if (cf.split('.').pop().toLowerCase() === cType) {
                return cf;
            }
        })]();
        return this._entities[id][cType];
    };
    EntityManager.prototype.getEntityComponents = function (eid) {
        var cType = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            cType[_i - 1] = arguments[_i];
        }
        var self = this;
        var rMap = {};
        var fKeys = Object.keys(self._entities[eid]).filter(function (ct) {
            return cType.includes(ct);
        });
        if (fKeys.length !== cType.length) {
            return rMap;
        }
        fKeys.forEach(function (ct) {
            if (rMap[eid] === undefined) {
                rMap[eid] = {};
            }
            rMap[eid][ct] = self._entities[eid][ct];
        });
        return rMap;
    };
    EntityManager.prototype.getComponents = function (complete) {
        if (complete === void 0) { complete = true; }
        var cType = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            cType[_i - 1] = arguments[_i];
        }
        var self = this;
        var rMap = {};
        Object.keys(self._entities).forEach(function (eid) {
            var fKeys = Object.keys(self._entities[eid]).filter(function (ct) {
                return cType.includes(ct);
            });
            if (fKeys.length !== cType.length && complete) {
                return;
            }
            fKeys.forEach(function (ct) {
                if (rMap[eid] === undefined) {
                    rMap[eid] = {};
                }
                rMap[eid][ct] = self._entities[eid][ct];
            });
        });
        return rMap;
    };
    return EntityManager;
}());
;
var KEY = {
    SPACE: 32,
    LEFT: 37,
    RIGHT: 39,
};
var INPUT = {
    LEFT: 0,
    RIGHT: 1,
    JUMP: 2
};
var input = [false, false, false];
function onkey(ev, key, pressed) {
    switch (key) {
        case KEY.LEFT:
            input[INPUT.LEFT] = pressed;
            ev.preventDefault();
            break;
        case KEY.RIGHT:
            input[INPUT.RIGHT] = pressed;
            ev.preventDefault();
            break;
        case KEY.SPACE:
            input[INPUT.JUMP] = pressed;
            ev.preventDefault();
            break;
    }
}
document.addEventListener('keydown', function (ev) { return onkey(ev, ev.keyCode, true); }, false);
document.addEventListener('keyup', function (ev) { return onkey(ev, ev.keyCode, false); }, false);
var CollisionSystem = (function (_super) {
    __extends(CollisionSystem, _super);
    function CollisionSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollisionSystem.prototype.update = function (entityManager, delta, tick) {
        var playerComponents = entityManager.getComponents(true, CONSTANTS.COMPONENT.VELOCITY, CONSTANTS.COMPONENT.TRANSFORM, CONSTANTS.COMPONENT.JUMPING);
        var ballComponent = entityManager.getComponents(true, CONSTANTS.COMPONENT.VELOCITY, CONSTANTS.COMPONENT.TRANSFORM, CONSTANTS.COMPONENT.BALL);
        Object.keys(playerComponents)
            .forEach(function (eid) {
            Object.keys(ballComponent)
                .forEach(function (bid) {
                var dx = playerComponents[eid].transform.x - ballComponent[bid].transform.x;
                var dy = playerComponents[eid].transform.y - ballComponent[bid].transform.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < (50 + 5)) {
                    console.log("HIT!" + " DX: " + dx + ", DY:" + dy + ", VY: " + playerComponents[eid].velocity.y);
                    ballComponent[bid].transform.y = playerComponents[eid].transform.y + 50 + 5;
                    ballComponent[bid].velocity.y = Math.min(30, 20 + playerComponents[eid].velocity.y);
                    ballComponent[bid].velocity.x = dx * -1;
                }
            });
        });
        Object.keys(ballComponent)
            .forEach(function (bid) {
            if (ballComponent[bid].transform.x > 800) {
                ballComponent[bid].transform.x = 800;
                if (ballComponent[bid].velocity.x > 0) {
                    ballComponent[bid].velocity.x = ballComponent[bid].velocity.x * -1;
                }
            }
            else if (ballComponent[bid].transform.x < 0) {
                ballComponent[bid].transform.x = 0;
                if (ballComponent[bid].velocity.x < 0) {
                    ballComponent[bid].velocity.x = ballComponent[bid].velocity.x * -1;
                }
            }
            if (ballComponent[bid].transform.y <= 0) {
                ballComponent[bid].transform.y = 0;
                ballComponent[bid].velocity.x = 0;
            }
        });
    };
    return CollisionSystem;
}(System));
var GravitySystem = (function (_super) {
    __extends(GravitySystem, _super);
    function GravitySystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GravitySystem.prototype.update = function (entityManager, delta, tick) {
        var components = entityManager.getComponents(false, CONSTANTS.COMPONENT.VELOCITY, CONSTANTS.COMPONENT.JUMPING);
        Object.keys(components)
            .forEach(function (eid) {
            var g = CONSTANTS.PHYSICS.MIN_GRAVITY;
            if (components[eid].jumping !== undefined) {
                g = (!components[eid].jumping.isJumping || components[eid].velocity.y < 0) ? CONSTANTS.PHYSICS.MAX_GRAVITY : CONSTANTS.PHYSICS.MIN_GRAVITY;
            }
            components[eid].velocity.y -= g;
        });
    };
    return GravitySystem;
}(System));
var InputSystem = (function (_super) {
    __extends(InputSystem, _super);
    function InputSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InputSystem.prototype.update = function (entityManager, delta, tick) {
        var components = entityManager.getComponents(true, CONSTANTS.COMPONENT.INPUT, CONSTANTS.COMPONENT.TRANSFORM, CONSTANTS.COMPONENT.JUMPING, CONSTANTS.COMPONENT.VELOCITY);
        Object.keys(components)
            .forEach(function (eid) {
            components[eid].input[tick] = input;
            if (components[eid].input[tick][INPUT.RIGHT]) {
                if (components[eid].velocity.x < 0) {
                    components[eid].velocity.x = CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                }
                else {
                    components[eid].velocity.x += CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                }
            }
            else if (components[eid].input[tick][INPUT.LEFT]) {
                if (components[eid].velocity.x > 0) {
                    components[eid].velocity.x = -CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                }
                else {
                    components[eid].velocity.x += -CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                }
            }
            else {
                if (components[eid].velocity.x > (CONSTANTS.PHYSICS.PLAYER.VELOCITY_X * 2)) {
                    components[eid].velocity.x = components[eid].velocity.x - CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                }
                else if (components[eid].velocity.x < -(CONSTANTS.PHYSICS.PLAYER.VELOCITY_X * 2)) {
                    components[eid].velocity.x = components[eid].velocity.x + CONSTANTS.PHYSICS.PLAYER.VELOCITY_X;
                }
                else {
                    components[eid].velocity.x = 0;
                }
            }
            if (components[eid].input[tick][INPUT.JUMP] &&
                components[eid].transform.y === 0 &&
                !components[eid].jumping.isJumping) {
                components[eid].velocity.y = CONSTANTS.PHYSICS.PLAYER.JUMP_VELOCITY;
                components[eid].jumping.isJumping = true;
            }
            if (!components[eid].input[tick][INPUT.JUMP]) {
                components[eid].jumping.isJumping = false;
                if (components[eid].velocity.y > CONSTANTS.PHYSICS.MAX_GRAVITY) {
                    components[eid].velocity.y = CONSTANTS.PHYSICS.PLAYER.JUMP_MIN_VELOCITY;
                }
            }
        });
    };
    return InputSystem;
}(System));
var RenderSystem = (function (_super) {
    __extends(RenderSystem, _super);
    function RenderSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderSystem.prototype.update = function (entityManager, delta, tick) {
        var components = entityManager.getComponents(true, CONSTANTS.COMPONENT.TRANSFORM, CONSTANTS.COMPONENT.GRAPHICS);
        Object.keys(components)
            .forEach(function (eid) {
            components[eid].graphics.x = components[eid].transform.x;
            components[eid].graphics.y = 800 - components[eid].transform.y;
        });
    };
    return RenderSystem;
}(System));
var TransformSystem = (function (_super) {
    __extends(TransformSystem, _super);
    function TransformSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransformSystem.prototype.update = function (entityManager, delta, tick) {
        var components = entityManager.getComponents(true, CONSTANTS.COMPONENT.VELOCITY, CONSTANTS.COMPONENT.TRANSFORM);
        Object.keys(components)
            .forEach(function (eid) {
            if (components[eid].velocity.x > CONSTANTS.PHYSICS.PLAYER.MAX_VELOCITY_X) {
                components[eid].velocity.x = CONSTANTS.PHYSICS.PLAYER.MAX_VELOCITY_X;
            }
            else if (components[eid].velocity.x < -CONSTANTS.PHYSICS.PLAYER.MAX_VELOCITY_X) {
                components[eid].velocity.x = -CONSTANTS.PHYSICS.PLAYER.MAX_VELOCITY_X;
            }
            if (components[eid].transform.y + components[eid].velocity.y < 0) {
                components[eid].transform.y = 0;
                components[eid].velocity.y = 0;
            }
            components[eid].transform.x += components[eid].velocity.x;
            components[eid].transform.y += components[eid].velocity.y;
        });
    };
    return TransformSystem;
}(System));
//# sourceMappingURL=app.js.map