//GLOBAL CUSTOM JS 

const alertsDurationInSeconds = 10;

// ON DOCUMENT READY
$(function () {

    // AUTO CLOSE ALERTS IN A FEW SECONDS
    setTimeout(function () { $(".alert").alert('close'); }, alertsDurationInSeconds * 1000);

    // ENABLE ALL TOOLTIPS
    $('[data-toggle="tooltip"]')
        .tooltip({
            html: true, animation: true,
            template: '<div class="tooltip" role="tooltip"><div class="arrow"></div>' +
                '<div class="tooltip-inner bg-dark"></div></div>'
        });
});
