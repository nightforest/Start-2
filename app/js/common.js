$(document).ready(function() {

	//Preloader
	setTimeout(function(){
		$('#preloader').fadeOut('slow',function(){$(this).remove();});
	}, 1000);

	// Img
	$("img, a").on("dragstart", function(event) { event.preventDefault(); });

	//Navbar
	$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
		event.preventDefault(); 
		event.stopPropagation(); 
		$(this).parent().siblings().removeClass('open');
		$(this).parent().toggleClass('open');
	});

	// Hide Bootstrap nav collapse on click
	$(document).on('click','.navbar-collapse.in',function(e) {
		if( $(e.target).is('a') && ( $(e.target).attr('class') != 'dropdown-toggle' ) ) {
			$(this).collapse('hide');
		}
	});

	//Аякс отправка форм
	//Документация: http://api.jquery.com/jquery.ajax/
	$("#form").submit(function() {
		$.ajax({
			type: "POST",
			url: "mail.php",
			data: $(this).serialize()
		}).done(function() {
			alert("Спасибо за заявку!");
			setTimeout(function() {
				
				$("#form").trigger("reset");
			}, 1000);
		});
		return false;
	});

	// Menu Toggle
	$('.main-menu-toggle').click(function() {
		$(this).toggleClass("on");
		$('.main-menu').slideToggle('slow');
	});

});

