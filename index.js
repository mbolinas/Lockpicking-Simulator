var lockpickGame = function(){
    var self = this;

    this.options={
        //put a bunch of game stuff here
    }

    //randomize pin timing
    //initialize pins and randomize order
    //keep track of set pins

}

var pin=function(pinId){
    var self=this;
    this.id = pinId;
    this.setable = false;
    this.isSet = false;
    //this.setTime = 0 //random time between .5 and 1 second
    this.setStart = this.setTime - .5
    this.setEnd = this.setTime + .5
    this.setMode = false;
    this.initialize=function(){};

    this.setPin = function(){
        setMode = true
        let setTime = 2 //make randomized
        setTimeout(()=>this.setable = true, setTime)
        
        setTimeout(function(){
            

        }

    }
}
