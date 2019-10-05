
var ws_open:boolean = false;

var sync_required:boolean = false;


var ws:WebSocket = new WebSocket("ws://127.0.0.1:8080/");
ws.binaryType = 'arraybuffer';

var inStreamBuffer = [{}];

var t0:number;


function decodeFloat(bytes:number[], signBits=1, exponentBits=11, fractionBits=52, eMin=-1022, eMax=1023, littleEndian=true) {
    var totalBits = (signBits + exponentBits + fractionBits);
  
    var binary = "";
    for (var i = 0, l = bytes.length; i < l; i++) {
      var bits = bytes[i].toString(2);
      while (bits.length < 8) 
        bits = "0" + bits;
  
      if (littleEndian)
        binary = bits + binary;
      else
        binary += bits;
    }
  
    var sign = (binary.charAt(0) == '1')?-1:1;
    var exponent = parseInt(binary.substr(signBits, exponentBits), 2) - eMax;
    var significandBase = binary.substr(signBits + exponentBits, fractionBits);
    var significandBin = '1'+significandBase;
    var i = 0;
    var val = 1;
    var significand = 0;
  
    if (exponent == -eMax) {
        if (significandBase.indexOf('1') == -1)
            return 0;
        else {
            exponent = eMin;
            significandBin = '0'+significandBase;
        }
    }
  
    while (i < significandBin.length) {
        significand += val * parseInt(significandBin.charAt(i));
        val = val / 2;
        i++;
    }
  
    return sign * significand * Math.pow(2, exponent);
  }


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

            case 4:
                let packageSync = {
                    'type': packetType,
                    'tick': dv.getUint16(2, true),
                    'sync': {}
                };

                let syncCount = dv.getUint8(1);

                let sync:{ [key: number]: { [key: string]: number } } = {};
                
                let idxSync;
                for (idx = 4; idx < dv.byteLength; idx = idx + 21) {

                    let x = dv.getUint16(idx + 1, true);
                    let y = dv.getUint16(idx + 3, true);

                    let u64b: number[] = [];
                    let idx1;
                    for(idx1 = idx + 5; idx1 < idx + 13; idx1 = idx1 +1 ){
                        let i1 = dv.getUint8(idx1);
                        u64b.push(i1);
                    }
                    let vx = decodeFloat(u64b);

                    let u64b2: number[] = [];
                    let idx2;
                    for(idx2 = idx + 13; idx2 < idx + 21; idx2 = idx2 +1 ){
                        let i2 = dv.getUint8(idx2);
                        u64b2.push(i2);
                    }
                    let vy = decodeFloat(u64b2);

                    sync[dv.getUint8(idx)] = {
                        'x': x,
                        'y': y,
                        'vx': vx,
                        'vy': vy
                    };
                }

                packageSync.sync = sync;

                inStreamBuffer.push(packageSync);

            break;

            case 5:
                inStreamBuffer.push({
                    'type': packetType
                });
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