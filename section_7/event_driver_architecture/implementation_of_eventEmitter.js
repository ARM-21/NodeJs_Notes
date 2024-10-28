class MyEmitter{
    constructor(){
        this._events={}
    }
    on(eventName,eventHandler){
        if(this._events[eventName]){
            this._events[eventName].push(eventHandler);
        }
        else{
            this._events[eventName] = [eventHandler];
        }
    }
    emit(eventName){
        if(this._events[eventName]){
            this._events[eventName].forEach((event)=>{
                event()
            })
        }
    }
}
export default MyEmitter;