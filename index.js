$(function(){
    document.addEventListener('keydown', keydownHandler);

    const pin_count = 3;
    const pin_max_fall_time_ms = 2000;

    const chamber_height_px = 300;

    const mode = {
        'Easy Mode': 'Hard Mode',
        'Hard Mode': 'Easy Mode',
    }

    const lock_opened = new Audio("lock_been_opened.wav");
    const pick_sound = new Audio("pick_sound.wav");


    for(i = 0; i < pin_count; i++){
        var chamber = '<div id=chamber' + i + ' class=chamber><div id=set-point' + i + ' class=set-point></div><div id=pin' + i + ' class=pin></div></div>';
        //$('.lockpick-container').append(chamber);
        $('.lock_body').append(chamber);
        $('#chamber' + i).css({top: '0px', left: '0px'});
        $('#pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px', left: '0px'});
    }


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
        pin_array_init.push((Math.random() * pin_falltime[i] * .6) + (pin_falltime[i] * .2));
        pin_array.push(pin_array_init[i]);
        pin_set_range.push((Math.random() * 75) + 250);

        var pos = (pin_array_init[i] / pin_falltime[i]) * chamber_height_px;
        $('#set-point' + i).css({top: pos + 'px'});
    }


    var selected_pin = -1;
    var time = 0;

    function randomize(){
        pin_array = [];
        pin_array_init = [];
        pin_falltime = [];
        pin_set_range = [];
        for(var i = 0; i < pin_count; i++){
            pin_falltime.push((Math.random() * pin_max_fall_time_ms / 2) + (pin_max_fall_time_ms / 2));
            pin_array_init.push((Math.random() * pin_falltime[i] * .6) + (pin_falltime[i] * .2));
            pin_array.push(pin_array_init[i]);
            pin_set_range.push((Math.random() * 75) + 250);

            var pos = (pin_array_init[i] / pin_falltime[i]) * chamber_height_px;
            $('#set-point' + i).css({top: pos + 'px'});
        }
    }

    function reset(){
        for(var i = 0; i < pin_array_init.length; i++){
            pin_array[i] = pin_array_init[i];
            $('#pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px', transition: 'top ' + (pin_falltime[i] / 1000) + 's'});
        }
    }

    $('#randomize').on('click', function (){
        randomize();
    });

    $('#reset').on('click', function (){
        reset();
    });

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
                else if((Date.now() - time) < 150){
                    //bug fix nice
                }
                //if time between presses is greater than it takes for the pin to fall down, push pin up
                else if(Date.now() - time > pin_max_fall_time_ms){
                    time = Date.now();
                    $('#pin' + (selected_pin)).css({top: '0px', transition: 'top .15s'});
                    setTimeout(() => {
                        $('#pin' + (selected_pin)).css({top: (chamber_height_px - $('#pin' + selected_pin).height()) + 'px', transition: 'top ' + (pin_falltime[selected_pin] / 1000) + 's'});
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

                        // Add Sound
                        $('#pin' + selected_pin).addClass("pin_set");
                        if ($(".pin_set").length == pin_count){
                            lock_opened.play();
                        }
                        else{
                            pick_sound.play();
                        }
                    }
                    else{
                        for(var i = 0; i < pin_array_init.length; i++){
                            pin_array[i] = pin_array_init[i];
                            $('#pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px', transition: 'top ' + (pin_falltime[i] / 1000) + 's'});
                        }

                        // Remove pin_set class
                        $(".pin_set").removeClass("pin_set");
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
        //$('.image-lockpick').css({left: (pin_pos.left - 350)});
        
        //$('.game-title').text('pos: ' + pin_array[selected_pin] + ', falltime: ' + pin_falltime[selected_pin] + ', range: ' + pin_set_range[selected_pin]);
    }

    

    $('#level-switch').on('click', function (){
        $('#level-label').html(mode[$('#level-label').html()]);
    });

});