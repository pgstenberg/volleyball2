
const CONSTANTS = {
    KEY: {
        SPACE:    32,
        LEFT:     37,
        RIGHT:    39,
    },
    INPUT: {
        LEFT: 0,
        RIGHT: 1,
        JUMP: 2
    },
    PACKET_TYPE: {
        INITIAL: 1,
        SYNC: 2,
        STATE: 3
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
            VELOCITY_X: 2,
            MAX_VELOCITY_X: 15,
            JUMP_VELOCITY: 10,
            JUMP_MIN_VELOCITY: 2
        },
        MAX_GRAVITY: 1,
        MIN_GRAVITY: 0.5
    }
}