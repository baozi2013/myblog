/**
 * Created by tianhengzhou on 10/6/15.
 */
$(document).ready(function(){var $el = $('.writer'),
    txt = $el.text(),
    txtLen = txt.length,
    timeOut,
    char = 0;

$el.text('|');

(function typeIt() {
    var humanize = Math.round(Math.random() * (100 - 30));
    timeOut = setTimeout(function() {
        char++;
        var type = txt.substring(0, char);
        $el.text(type + '|');
        typeIt();

        if (char == txtLen) {
            $el.text($el.text().slice(0, -1)); // remove the '|'
            clearTimeout(timeOut);
            $('.main').fadeTo('slow',1)
        }

    }, humanize);
}());});


$(function(){
    $(".type").typed({
        strings: ["Tianheng Tim Zhou <br/> Web Developer"],
        typeSpeed: 10,
        showCursor: false
    });
});


