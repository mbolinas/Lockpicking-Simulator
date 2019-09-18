$(function(){

    const pin_count = 3;

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
        $('#chamber' + i).css({top: '0px', left: '0px'});
    }

    let x = function(){
        alert('wow');
    }

    //x();

    $('.randomize-button').addEventListener('click', function(){
        alert('uhh');
    });


});