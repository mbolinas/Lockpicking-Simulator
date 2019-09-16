// up arrow - 38 or ArrowUp
// left arrow - 37 or ArrowLeft
// right arrow - 39 or ArrowRight
var lockpickGame = function(){
    var self = this;

    this.options={
        //put a bunch of game stuff here
    }

    //randomize pin timing
    //initialize pins and randomize order
    //keep track of set pins

    
    //on up arrow press, run activatePin for a given pinId.

}

var pin=function(pinId){
    var self=this;
    this.id = pinId;
    this.setable = false; // can this pin be set?
    this.isSet = false; // has this pin been set?
    this.setMode = false; //are we in the process of trying to set this pin?

    this.initialize=function(){};

    this.activatePin = function() {
    //press up -> take in current pin id,
    //isSet = false -> run setPin
    //isSet = true -> do nothing, user is stupid
    //setMode = true, setable = false -> picking fails, setmode becomes false.
    //setmode = true, setable = true -> picking succeeds, isSet becomes true.
    };

    this.setPin = function(){
        setMode = true;
        let setTime = 2; //make randomized
        let unsetTime = 2; //mAkE rAnDoMiZeD
        setTimeout(function(){this.setable = true}, setTime);        
        setTimeout(function(){this.setable = false}, unsetTime);
        setMode = false;
    };

}