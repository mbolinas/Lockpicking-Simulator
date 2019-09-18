$(function(){
    document.addEventListener('keydown', keydownHandler);

    const pin_count = 3;
    const pin_max_fall_time_ms = 1000;

    //TODO: convert to pin_array.push(randomized_amt)
    var pin_array = [300,500,600];
    var pin_array_init = [300, 500, 600];  //so that reset works
    var pin_falltime = [1000,1000,1000];
    var pin_set_range = [2000,2000,2000];


    var selected_pin = -1;
    var time = 0;

    function randomize(){

    }

    function reset(){
        selected_pin = -1;
        time = 0;
        update();
    }

    function keydownHandler(e){
        switch(e.code){
            case 'KeyA':
                //if statement prevents you from changing pin while a pin is falling
                if(Date.now() - time > pin_max_fall_time_ms){
                    selected_pin = Math.max(0, selected_pin - 1);
                    update();
                }
                break;
            case 'KeyD':
                if(Date.now() - time > pin_max_fall_time_ms){
                    selected_pin = Math.min(pin_count - 1, selected_pin + 1);
                    update();
                }
                break;
            case 'Space':
                //this means this pin is already set
                if(pin_array[selected_pin] === -1){
                    //we do nothing, probably just animate the lockpick kicking an empty chamber
                }
                //if time between presses is greater than it takes for the pin to fall down, push pin up
                else if(Date.now() - time > pin_max_fall_time_ms){
                    time = Date.now();
                    $('#pin' + (selected_pin)).css({top: '0px', transition: 'top .15s'});
                    setTimeout(() => {
                        $('#pin' + (selected_pin)).css({top: '200px', transition: 'top ' + (pin_falltime[selected_pin] / 1000) + 's'});
                    }, 200);
                }
                //the pin is currently falling, user is trying to set it
                else{
                    //TODO: convert 2000 to a random amount per pin, found in pin_set_range
                    if(Math.abs(Date.now() - time - pin_array[selected_pin]) < 2000){
                        pin_array[selected_pin] = -1;
                        //TODO: place the set pin at correct height, corresponding to it's pin_falltime
                        $('#pin' + selected_pin).css({top: '100px'});
                    }
                }
                update();
                break;
        }
    }
    //TODO:
    //make update() handle lockpick positioning onto correct pin
    function update(){
        var pin_pos = $('#chamber' + selected_pin).offset();
        //alert(pin_pos.left);
        $('.image-lockpick').css({top: (pin_pos.top + $('#chamber' + selected_pin).height()) + 'px', left: (pin_pos.left - $('.image-lockpick').width()) + 'px'});
        //$('.game-title').text('current pin: ' + selected_pin + ';     time (-1 for done): ' + pin_array[selected_pin] + 'str: ' + str);
    }

    mode = {
        'Easy Mode': 'Hard Mode',
        'Hard Mode': 'Easy Mode',
    }

    $('#level-switch').on('click', function (evt){
        $('#level-label').html(mode[$('#level-label').html()]);
    });
    
    for(i = 0; i < pin_count; i++){
        var chamber = '<div id=chamber' + i + ' class=chamber><div id=pin' + i + ' class=pin></div></div>';
        $('.lockpick-container').append(chamber);
        $('#chamber' + i).css({top: '0px', left: '0px'});
        $('#pin' + i).css({top: '200px', left: '0px'});
    }
});