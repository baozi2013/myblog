/**
 * Created by tianhengzhou on 9/19/15.
 */
var timeStart = Date.now();

    $(window).load(function () {
        var timeDuration = Date.now() - timeStart;
        if (timeDuration < 3000) {
            setTimeout(function () {
                $(".loader").fadeOut('slow',function(){
                    $('.content').fadeIn('slow');
                });
            }, 3000 - timeDuration);
        }
        else {
            $(".loader").fadeOut('slow',function(){
                $('.content').fadeIn('slow')});
        }
        $('#fullpage').fullpage({
            verticalCentered: true,
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: ['Intro', 'My Work', 'Contact'],
            sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE']
        });
    });
