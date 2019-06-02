
var ws_open:boolean = false;


var ws:WebSocket = new WebSocket("ws://127.0.0.1:8080/");
ws.binaryType = 'arraybuffer';

var inStreamBuffer = [{}];


if ("WebSocket" in window) {

    ws.onmessage = function(evt) {

        let dv:DataView = new DataView(evt.data);

        let packetType:number = dv.getUint8(0);

        switch(packetType){
            case 1:
                inStreamBuffer.push({
                    'type': packetType,
                    'client_id': dv.getUint8(1)
                });
            break;
            case 2:
                inStreamBuffer.push({
                    'type': packetType,
                    'tick': dv.getUint16(1)
                });
            break;
            case 3:
                let package = {
                    'type': packetType,
                    'state': [{}]
                };
                /*
                let clientCount = dv.getUint8(1);
                let idx;
                for (idx = 0; idx <= (clientCount * 5); idx = idx + 5) {
                    package.state[dv.getUint8(2 + idx)] = {
                        'x': dv.getUint16(3 + idx),
                        'y': dv.getUint16(5 + idx)
                    }
                }
                inStreamBuffer.push(package);
                */
            break;
        }

        console.log("PackageType: " + packetType);
    }

    ws.onopen = function() {
        ws_open = true;
      };
    ws.onclose = function() {
        ws_open = false;
    };

}else{
    alert("WebSocket NOT supported by your Browser!");
}