
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
            VELOCITY_X: 4,
            MAX_VELOCITY_X: 20,
            JUMP_VELOCITY: (8 * 3),
            JUMP_MIN_VELOCITY: 6
        },
        MAX_GRAVITY: 3,
        MIN_GRAVITY: 1
    }
}