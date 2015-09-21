/**
 * Created by tianhengzhou on 9/19/15.
 */
var timeStart = Date.now();

    $(window).load(function () {
        var timeDuration = Date.now() - timeStart;
        if (timeDuration < 1000) {
            setTimeout(function () {
                $(".loader").fadeOut('slow',function(){
                    $('.content').fadeIn('slow');
                });
            }, 1000 - timeDuration);
        }
        else {
            $(".loader").fadeOut('slow',function(){
                $('.content').fadeIn('slow')});
        }
        $('#fullpage').fullpage({
            verticalCentered: true,
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: ['Intro', 'My Work', 'Contact Me'],
            sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE']
        });
    });
