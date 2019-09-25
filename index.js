$(function(){
    document.addEventListener('keydown', keydownHandler);

    const pin_count = 3;
    const pin_max_fall_time_ms = 2000;

    const chamber_height_px = 200;

    //TODO: convert to pin_array.push(randomized_amt)
    //var pin_array = [300,500,600];
    //var pin_array_init = [300, 500, 600];  //so that reset works
    //var pin_falltime = [1000,1000,1000];
    //var pin_set_range = [200,200,200];

    var pin_array = [];
    var pin_array_init = [];
    var pin_falltime = [];
    var pin_set_range = [];

    for(var i = 0; i < pin_count; i++){
        pin_falltime.push((Math.random() * pin_max_fall_time_ms / 2) + (pin_max_fall_time_ms / 2));
        pin_array_init.push(Math.random() * pin_falltime[i] * .9);
        pin_array.push(pin_array_init[i]);
        pin_set_range.push((Math.random() * 150) + 150);
    }


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
                if(selected_pin == -1 || Date.now() - time > pin_falltime[selected_pin]){
                    selected_pin = Math.max(0, selected_pin - 1);
                    update();
                }
                break;
            case 'KeyD':
                if(selected_pin == -1 || Date.now() - time > pin_falltime[selected_pin]){
                    selected_pin = Math.min(pin_count - 1, selected_pin + 1);
                    update();
                }
                break;
            case 'Space':
                //this means this pin is already set
                if(pin_array[selected_pin] === -1){
                    //we do nothing, probably just animate the lockpick kicking an empty chamber
                }
                else if((Date.now() - time) < 155){
                    //bug fix nice
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
                    if((Date.now() - time - pin_array[selected_pin]) <= 0 && (Date.now() - time - pin_array[selected_pin] > -1 * pin_set_range[selected_pin])){
                        pin_array[selected_pin] = -1;
                        //position pin where it would be depending on when it's supposed to get set
                        var pos = (pin_array_init[selected_pin] / pin_falltime[selected_pin]) * chamber_height_px;
                        $('#pin' + selected_pin).css({top: pos + 'px'});
                    }
                    else{
                        for(var i = 0; i < pin_array_init.length; i++){
                            pin_array[i] = pin_array_init[i];
                            $('#pin' + i).css({top: '200px', transition: 'top ' + (pin_falltime[i] / 1000) + 's'});
                        }
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
        //$('.game-title').text('pos: ' + pin_array[selected_pin] + ', falltime: ' + pin_falltime[selected_pin] + ', range: ' + pin_set_range[selected_pin]);
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