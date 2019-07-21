
var ws_open:boolean = false;

var sync_required:boolean = false;


var ws:WebSocket = new WebSocket("ws://127.0.0.1:8080/");
ws.binaryType = 'arraybuffer';

var inStreamBuffer = [{}];

var t0:number;


if ("WebSocket" in window) {

    ws.onmessage = function(evt) {

        let dv:DataView = new DataView(evt.data);

        let packetType:number = dv.getUint8(0);

        switch(packetType){
            case 1:
                let connectPackage = {
                    'type': packetType,
                    'player_client_id': dv.getUint8(1),
                    'opponent_client_id': -1
                };

                if(dv.byteLength === 3){
                    connectPackage.opponent_client_id = dv.getUint8(2);
                }
                
                inStreamBuffer.push(connectPackage);
            break;
            case 2:
                inStreamBuffer.push({
                    'type': packetType,
                    'tick': dv.getUint16(1, true),
                    'delta': ((window.performance && window.performance.now ? window.performance.now() : new Date().getTime()) - t0)
                });
            break;
            case 3:
                let package = {
                    'type': packetType,
                    'tick': dv.getUint16(2, true),
                    'state': {}
                };
                
                let clientCount = dv.getUint8(1);

                let state:{ [key: number]: { [key: string]: number } } = {};
                
                let idx;
                for (idx = 4; idx < dv.byteLength; idx = idx + 5) {

                    state[dv.getUint8(idx)] = {
                        'x': dv.getUint16(idx + 1, true),
                        'y': dv.getUint16(idx + 3, true)
                    };
                }

                package.state = state;

                inStreamBuffer.push(package);
                
            break;
        }

    }

    ws.onopen = function() {
        ws_open = true;

        sync_required = true;

      };
    ws.onclose = function() {
        ws_open = false;
    };

}else{
    alert("WebSocket NOT supported by your Browser!");
}