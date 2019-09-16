$(function () {
    mode = {
        'Easy Mode': 'Hard Mode',
        'Hard Mode': 'Easy Mode',
    }

    $('#level-switch').on('click', function (evt) {
        $('#level-label').html(mode[$('#level-label').html()]);
    });

    $(document).keypress(function (evt) {
        switch (evt.which) {
            // left
            case 100:
                $("#pick").animate({ left: "+=5" }, 1);
                break;

            // right
            case 97:
                $("#pick").animate({ left: "-=5" }, 1);
                break;

            // up
            case 119:
                $("#pick").animate({ top: "-=5" }, 1);
                break;

            // down
            case 115:
                $("#pick").animate({ top: "+=5" }, 1);
                break;

            default: return; // exit this handler for other keys
        }
        evt.preventDefault(); // prevent the default action (scroll / move caret)
    });
});