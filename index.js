$(function(){
    
    document.addEventListener('keydown', keydownHandler);

    const pin_count = 5;
    const pin_max_fall_time_ms = 2000;

    const chamber_height_px = 300;

    const mode = {
        'Easy Mode': 'Hard Mode',
        'Hard Mode': 'Easy Mode',
    }

    const lock_opened = new Audio("lock_been_opened.wav");
    const pick_sound = new Audio("pick_sound.wav");
    const insert_key = new Audio("insert_key.wav");

    for(i = 0; i < pin_count; i++){
        var chamber = '<div id=chamber' + i + ' class=chamber><div id=spring' + i + ' class=spring></div><div id=hold-pin' + i + ' class=hold-pin></div><div id=set-point' + i + ' class=set-point></div><div id=pin' + i + ' class=pin></div></div>';
        $('.lock_body').append(chamber);
        $('#chamber' + i).css({top: '0px', left: '0px'});
    }

    var pin_array = [];
    var pin_array_init = [];
    var pin_falltime = [];
    var pin_set_range = [];

    for(var i = 0; i < pin_count; i++){
        pin_falltime.push((Math.random() * pin_max_fall_time_ms / 2) + (pin_max_fall_time_ms / 2));
        pin_array_init.push((Math.random() * pin_falltime[i] * .4) + (pin_falltime[i] * .3));
        pin_array.push(pin_array_init[i]);
        pin_set_range.push((Math.random() * 75) + 250);

        var pos = (pin_array_init[i] / pin_falltime[i]) * chamber_height_px;
        $('#pin' + i).css({height: (Math.max(30, (chamber_height_px - pos) / 2)) + 'px'});
        $('#pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px'});
        $('#hold-pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px'});
        $('#spring' + i).css({height: (chamber_height_px - $('#pin' + i).height()) + 'px'});

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
            pin_array_init.push((Math.random() * pin_falltime[i] * .4) + (pin_falltime[i] * .3));
            pin_array.push(pin_array_init[i]);
            pin_set_range.push((Math.random() * 75) + 250);

            var pos = (pin_array_init[i] / pin_falltime[i]) * chamber_height_px;

            $('#pin' + i).css({height: (Math.max(30, (chamber_height_px - pos) / 2)) + 'px'});
            $('#pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px'});
            $('#hold-pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px'});
            $('#spring' + i).css({height: (chamber_height_px - $('#pin' + i).height()) + 'px'});
        }
        $('.lock_status').attr('src', 'closed.png');
    }

    function reset(){
        for(var i = 0; i < pin_array_init.length; i++){
            pin_array[i] = pin_array_init[i];
            $('#pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px', transition: 'top ' + (pin_falltime[i] / 1000) + 's'});
            $('#hold-pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px', transition: 'top ' + (pin_falltime[i] / 1000) + 's'});
            $('#spring' + i).css({height: (chamber_height_px - $('#pin' + i).height()) + 'px'});
        }
        $('.lock_status').attr('src', 'closed.png');
    }

    $('#randomize').on('click', function (){
        insert_key.play();
        randomize();
    });

    $('#reset').on('click', function (){
        insert_key.play();
        reset();
    });

    function keydownHandler(e){
        switch(e.code){
            case 'KeyA':
                //if statement prevents you from changing pin while a pin is falling
                if(Date.now() - time > pin_max_fall_time_ms){
                    //TODO: play lockpick-move sound
                    selected_pin = Math.max(0, selected_pin - 1);
                    update();
                }
                break;
            case 'KeyD':
                if(Date.now() - time > pin_max_fall_time_ms){
                    //TODO: play lockpick-move sound
                    selected_pin = Math.min(pin_count - 1, selected_pin + 1);
                    update();
                }
                break;
            case 'Space':
                //TODO: play lockpick-click sound
                e.preventDefault();
                //this means this pin is already set
                if(pin_array[selected_pin] === -1){
                    $('#pin' + selected_pin).css({top: (chamber_height_px / 2) + 'px', transition: 'top .15s'});
                    setTimeout(() => {
                        $('#pin' + (selected_pin)).css({top: (chamber_height_px - $('#pin' + selected_pin).height()) + 'px', transition: 'top .2s'});
                        //TODO: play pin-hit-bottom sound
                    }, 150);
                    //we do nothing, probably just animate the lockpick kicking an empty chamber
                }
                else if((Date.now() - time) < 150){
                    //bug fix nice
                }
                //if time between presses is greater than it takes for the pin to fall down, push pin up
                else if(Date.now() - time > pin_max_fall_time_ms){
                    time = Date.now();
                    //TODO: play pin-hits-top sound
                    $('#pin' + (selected_pin)).css({top: '0px', transition: 'top .15s'});
                    $('#hold-pin' + selected_pin).css({top: '0px', transition: 'top .15s'});
                    $('#spring' + selected_pin).css({height: '0px', transition: 'height .15s'});
                    setTimeout(() => {
                        $('#pin' + (selected_pin)).css({top: (chamber_height_px - $('#pin' + selected_pin).height()) + 'px', transition: 'top ' + (pin_falltime[selected_pin] / 1000) + 's'});
                        $('#hold-pin' + (selected_pin)).css({top: (chamber_height_px - $('#pin' + selected_pin).height()) + 'px', transition: 'top ' + (pin_falltime[selected_pin] / 1000) + 's'});
                        $('#spring' + selected_pin).css({height: (chamber_height_px - $('#pin' + selected_pin).height()) + 'px', transition: 'height ' + (pin_falltime[selected_pin] / 1000) + 's'});
                    }, 200);
                }
                //the pin is currently falling, user is trying to set it
                else{
                    if((Date.now() - time - pin_array[selected_pin]) <= 0 && (Date.now() - time - pin_array[selected_pin] > -1 * pin_set_range[selected_pin])){
                        pin_array[selected_pin] = -1;
                        //position pin where it would be depending on when it's supposed to get set
                        var pos = (pin_array_init[selected_pin] / pin_falltime[selected_pin]) * chamber_height_px;
                        $('#hold-pin' + selected_pin).css({top: (chamber_height_px / 3) + 'px'});
                        $('#spring' + selected_pin).css({height: (chamber_height_px / 3) + 'px'});
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
                            if(pin_array[i] === -1){
                                setTimeout(() => {
                                    //TODO: play pin-hit-bottom sound
                                    insert_key.play();
                                }, pin_falltime[i]);
                            }
                            pin_array[i] = pin_array_init[i];
                            $('#pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px', transition: 'top ' + (pin_falltime[i] / 1000) + 's'});
                            $('#hold-pin' + i).css({top: (chamber_height_px - $('#pin' + i).height()) + 'px', transition: 'top ' + (pin_falltime[i] / 1000) + 's'});
                            $('#spring' + i).css({height: (chamber_height_px - $('#pin' + i).height()) + 'px', transition: 'height ' + (pin_falltime[i] / 1000) + 's'});
                        }
                        // Remove pin_set class
                        $(".pin_set").removeClass("pin_set");
                    }
                }
                update();
                break;
        }
        var win = true;
        for(var i = 0; i < pin_array.length; i++){
            if(pin_array[i] !== -1){
                win = false;
            }
        }
        if(win){
            $('.lock_status').attr('src', 'open.png');
        }
    }

    function update(){
        var pin_pos = $('#chamber' + selected_pin).offset();
        $('.image-lockpick').css({top: (pin_pos.top + $('#chamber' + selected_pin).height() + 50) + 'px', left: (pin_pos.left - $('.image-lockpick').width() + 30) + 'px'});
    }
    
    function win() {
        $("#modalWin").modal();
    }

    $('#level-switch').on('click', function (){
        $('#level-label').html(mode[$('#level-label').html()]);
        if($('.hidden').length >= pin_count){
            $('.chamber').removeClass('hidden');
            $('.lock_body').css({zIndex: '1'});
            //$('.lock_body').css({backgroundImage: ''});
        }
        else{
            $('.chamber').addClass('hidden');
            $('.lock_body').css({zIndex: '3'});
            //$('.lock_body').css({backgroundImage: ''});
        }
    });

});