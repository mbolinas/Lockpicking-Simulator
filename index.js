$(function(){
    document.addEventListener('keydown', keydownHandler);

    const pin_count = 3;
    const pin_max_fall_time_ms = 1000;

    //TODO: convert to pin_array.push(randomized_amt)
    var pin_array = [300,500,600];
    var pin_falltime = [1000,1000,1000];
    var pin_set_range = [2000,2000,2000];
    var selected_pin = -1;

    var time = 0;

    var str = '';

    function keydownHandler(e){
        switch(e.code){
            case 'KeyA':
                selected_pin = Math.max(0, selected_pin - 1);
                time = 0;
                update();
                break;
            case 'KeyD':
                selected_pin = Math.min(pin_count - 1, selected_pin + 1);
                time = 0;
                update();
                break;
            case 'Space':
                if(pin_array[selected_pin] === -1){
                    //this means this pin is already set
                    //we do nothing, probably just animate the lockpick kicking an empty chamber
                }
                else if(Date.now() - time > pin_max_fall_time_ms){

                    
                    //if time between presses is greater than it takes for the pin to fall down, push pin up
                    time = Date.now();
                    $('#pin' + (selected_pin)).css({top: '0px', transition: 'top .15s'});
                    str = 'top ' + (pin_falltime[selected_pin] / 1000) + 's';
                    //TODO: if the user switches pins before setTimeout fires, it will call the wrong pin
                    setTimeout(() => {
                        $('#pin' + (selected_pin)).css({top: '200px', transition: str});
                    }, 200);
                }
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
        var pin_pos = $('#pin' + selected_pin).offset();
        //alert(pin_pos.left);
        $('.image-lockpick').css(pin_pos);
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