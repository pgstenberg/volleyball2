const components = {
    'CONSTANTS.COMPONENT.TRANSFORM': function(){
        return {
            x: 0,
            y: 0
        };
    },
    'CONSTANTS.COMPONENT.EVENT': function(){
        return new Array();
    },
    'CONSTANTS.COMPONENT.INTERPOLATION': function(){
        return {
            x: 0,
            y: 0
        };
    },
    'CONSTANTS.COMPONENT.NETWORKING': function(){
        return {
            id: -1,
        };
    },
    'CONSTANTS.COMPONENT.VELOCITY': function(){
        return {
            x: 0,
            y: 0
        };
    },
    'CONSTANTS.COMPONENT.INPUT': function(){
        return {
            d: [false, false, false]
        };
    },
    'CONSTANTS.COMPONENT.GRAPHICS': function(){
        return new PIXI.Graphics();
    },
    'CONSTANTS.COMPONENT.JUMPING': function(){
        return {
            isJumping: false
        }
    },
    'CONSTANTS.COMPONENT.BALL': function(){
        return;
    },
    'CONSTANTS.COMPONENT.PLAYER': function(){
        return;
    },
    'CONSTANTS.COMPONENT.OPPONENT': function(){
        return;
    },
};