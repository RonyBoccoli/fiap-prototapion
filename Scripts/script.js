(function(document , window , $){
	$(document).ready(function(){
		$('.slider').slick({
			autoplay: true,
			autoplaySpeed: 2000,
			dots: true,
			infinite: true,
			speed: 300,
            edgeFriction:0.30,
			slidesToShow: 3,
			slidesToScroll: 1,
			responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
			    // You can unslick at a given breakpoint now by adding:
			    // settings: "unslick"
			    // instead of a settings object
			    ]
			});
	});
})(document , window , jQuery);