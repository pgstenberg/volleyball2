const components = {
    'CONSTANTS.COMPONENT.TRANSFORM': function(){
        return {
            x: 0,
            y: 0
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
            0: [false, false, false]
        };
    },
    'CONSTANTS.COMPONENT.GRAPHICS': function(){
        return new PIXI.Graphics();
    },
    'CONSTANTS.COMPONENT.JUMPING': function(){
        return {
            isJumping: false
        }
    }
};