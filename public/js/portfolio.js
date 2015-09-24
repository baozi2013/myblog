/**
 * Created by tianhengzhou on 9/19/15.
 */
var timeStart = Date.now();

    $(document).ready(function () {
        var timeDuration = Date.now() - timeStart;
        $(".loader").fadeOut('slow',function(){
            $('.content').fadeIn('slow')});

        $('#work ul li button').click(function(){
            var data = $(this).data('filter');
            if(data){
                $grid.isotope({filter: '.' + data});
            }
            else {
                $grid.isotope({filter: '*'});
            }

        });
        $('.grid-item').mouseover(function(){
            $(this).find('img').addClass('hoverOn')
            $(this).find('.hoverpopup').addClass('showDetail')
        });
        $('.grid-item').mouseout(function(){
            $(this).find('img').removeClass('hoverOn')
            $(this).find('.hoverpopup').removeClass('showDetail')
        })
        //$('.grid-item').mouseover(function(){
        //    $(this).find('img').addClass('hoverOn');
        //    $(this).find('.hover').addClass('showDetail');
        //
        //});
        //$('.grid-item').mouseout(function(){
        //    $(this).find('img').removeClass('hoverOn');
        //    $(this).find('.info').removeClass('showInfo');
        //})
        var $grid= $('.grid').isotope({
            itemSelector: '.grid-item',
            layoutMode: 'fitRows'
        });
        $('#fullpage').fullpage({
            verticalCentered: true,
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: ['Intro', 'My Work', 'Contact Me'],
            sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE']
        });
    });

