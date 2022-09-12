
$(".hamburger").click( function () {
    $("nav").toggleClass('show');
    $(this).toggleClass('is-active');
});

$("#toggle-list").click(function () {
    $("#course-schedule").toggleClass('list-schedule');
    if ($("#course-schedule").hasClass('list-schedule')) {
        $(this).text('View As Calendar');
    } else {
        $(this).text('View As List');
    }
});

// apply only list view for small screens.  
// changes may not apply if window is resized without refresh.
if (window.matchMedia("(max-width: 850px)").matches) {
    $("#course-schedule").addClass('list-schedule');
    $("#toggle-list").text('View As Calendar').hide();
}

function display() {
    var name = document.getElementById('firstName').value;
    alert("Thank you, " + name + ". We have received your information and will contact you shortly.");
}