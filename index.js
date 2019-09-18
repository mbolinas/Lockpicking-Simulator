$(function(){
    document.addEventListener('keydown', keydownHandler);

    const pin_count = 3;
    const pin_max_fall_time_ms = 1000;

    //TODO: convert to pin_array.push(randomized_amt)
    var pin_array = [300,500,600];
    var pin_falltime = [1000,1000,1000];
    var pin_set_range = [2000,2000,2000];
    var selected_pin = 0;

    var time = 0;

    var str = '';

    function keydownHandler(e){

        //alert(e.code);

        switch(e.code){
            case 'KeyA':
                selected_pin = Math.max(0, selected_pin - 1);
                time = 0;
                update();
                break;
            case 'KeyD':
                selected_pin = Math.min(pin_count, selected_pin + 1);
                time = 0;
                update();
                break;
            case 'Space':
                //$('.test').css({left: '100vw', transition: 'left 5s'});
                if(pin_array[selected_pin - 1] === -1){
                    //this means this pin is already set

                    //we do nothing
                    //alert('bruh');
                }
                else if(Date.now() - time > pin_max_fall_time_ms){
                    //if time between presses is greater than it takes for the pin to fall down, push pin up
                    time = Date.now();
                    $('#chamber' + (selected_pin - 1)).css({top: '0px', transition: 'top .2s'});
                    str = 'top ' + (pin_falltime[selected_pin - 1] / 1000) + 's';
                    setTimeout(() => {
                        $('#chamber' + (selected_pin - 1)).css({top: '200px', transition: str});
                    }, 200);
                    //$('#chamber' + (selected_pin - 1)).css({top: '200px', transition: str});
                    //alert('kicking');
                }
                else{
                    //alert('hitit');
                    //TODO: convert 200 to a random amount per pin
                    if(Math.abs(Date.now() - time - pin_array[selected_pin - 1]) < 2000){
                        pin_array[selected_pin - 1] = -1;
                    }
                }
                update();
                break;
        }
    }

    function update(){
        $('.game-title').text('current pin: ' + selected_pin + ';     time (-1 for done): ' + pin_array[selected_pin - 1] + 'str: ' + str);
    }

    mode = {
        'Easy Mode': 'Hard Mode',
        'Hard Mode': 'Easy Mode',
    }

    $('#level-switch').on('click', function (evt){
        $('#level-label').html(mode[$('#level-label').html()]);
    });
    
    for(i = 0; i < pin_count; i++){
        var chamber = '<div id=chamber' + i + ' class=chamber></div>';
        $('.lockpick-container').append(chamber);
        $('#chamber' + i).css({top: '200px', left: '0px'});
    }
});