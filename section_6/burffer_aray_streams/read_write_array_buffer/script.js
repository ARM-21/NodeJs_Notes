const a = new ArrayBuffer(4);

let view = new DataView(a);

view.setInt8(0,50);