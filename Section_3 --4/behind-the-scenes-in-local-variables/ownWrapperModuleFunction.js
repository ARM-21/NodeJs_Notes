const b = loadModule('./math');
function loadModule(path){
    const fs = require('fs');
    if(!path.endsWith('.js')){
        path += '.js';

    }
    const contentOfFile = fs.readFileSync(path).toString();
    // console.log(contentOfFile);
   return (function(sendModule){
        eval(contentOfFile);
        // console.log(sendModule);
        return sendModule;
    }   
)({});

}