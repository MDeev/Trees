$(window).on('load', function() {
	// Loader
	$('.loader').children('span').css({'backgroundColor': '#FFF', 'borderColor': '#FFF'}, 1000).delay(700).queue(function (){
		$('.loader').fadeOut(600);
	});
});

$(document).ready(function() {
	
	// Fire the scroll
	$("body").niceScroll({
		cursorcolor:"#5eaf87",
		cursorwidth: "15px",
		cursorborder: "none",
		cursorborderradius: "10px",
		background: "#484747",
		zindex: 999
	});

	var scrolled = false;
	function Scroll_toTop() {
		var top = $(window).scrollTop();
		if(top <= 100 && !scrolled) { $('.top').animate({right: '-150px'}, 1); scrolled = true; }
		else if(top > 100 && scrolled) { $('.top').animate({right: '65px'}, 1); scrolled = false; }
	}

	// Run this function on scroll
	$(window).scroll(function() { Scroll_toTop(); });

	// Run this on load
	Scroll_toTop();

	// Scroll to Top
	$(document).on('click', '.top', function() {
		 $('body, html').animate({scrollTop: 0}, 300);
	});

	// Fire fancybox plugin
	$(".work img").fancybox();

	// Fire aos plugin
	AOS.init();
	
});