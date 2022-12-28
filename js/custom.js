(function ($) {
"use strict";


	/* Preloader */
	var win = $(window);
	win.on('load',function() {
		$('.page-loader').delay(350).fadeOut('slow');
	});	
	
	/* menu last class added */
	$('ul.basic-menu>li').slice(-2).addClass('menu-p-right');
	
	/* headroom */	
	var myElement = document.querySelector(".headroom");
	var headroom  = new Headroom(myElement);
	headroom.init(); 
	
	/* TOP Menu Stick  */
	win.on('scroll',function() {
	if ($(this).scrollTop() > 1){  
		$('#sticky-header').addClass("sticky");
	  }
	  else{
		$('#sticky-header').removeClass("sticky");
	  }
	}); 
	
	/* meanmenu */
	 $('#mobile-nav').meanmenu({
		 meanMenuContainer: '.basic-mobile-menu',
		 meanScreenWidth: "767"
	 });
	 
	/* hamburgers menu option  */
    $('.hamburger').on('click', function() {
        $(this).toggleClass('is-active');
        $(this).next().toggleClass('nav-menu-show')
    }); 
	
	
	/*-- One Page Menu --*/
    var TopOffsetId = $('.header-area').height() - 25;
    $('.header-area nav').onePageNav({
        currentClass: 'active',
        scrollThreshold: 0.2,
        scrollSpeed: 1000,
        scrollOffset: TopOffsetId,
    });
    
	/* imagesLoaded active */
	$('#portfolio-grid,.blog-masonry').imagesLoaded( function() {
		
		/* Filter menu */
		$('.filter-menu').on( 'click', 'button', function() {
		  var filterValue = $(this).attr('data-filter');
		  $grid.isotope({ filter: filterValue });
		});	

		/* filter menu active class  */
		$('.filter-menu button').on('click', function(event) {
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			event.preventDefault();
		});

		/* Filter active */
		var $grid = $('#portfolio-grid').isotope({
		  itemSelector: '.portfolio-item',
		  percentPosition: true,
		  masonry: {
			columnWidth: '.portfolio-item',
		  }
		});
		
		/* Filter active */
		$('.blog-masonry').isotope({
		  itemSelector: '.blog-item',
		  percentPosition: true,
		  masonry: {
			columnWidth: '.blog-item',
		  }
		});			
		
	});

	/* magnificPopup img view */
	$('.popup-link').magnificPopup({
		type: 'image',
		gallery: {
		  enabled: true
		}
	});

	/* magnificPopup video view */
	$('.popup-video').magnificPopup({
		type: 'iframe'
	});
	
	/* counterUp */
	$('.counter-number').counterUp();

	/* main-slider */
	$('.slider-active').owlCarousel({
		loop:true,
		navText:['<i class="ion-chevron-left"></i>','<i class="ion-chevron-right"></i>'],
		nav:false,
		dots:true,
		animateOut: 'fadeOut',
		responsive:{
			0:{
				items:1
			},
			600:{
				items:1
			},
			1000:{
				items:1
			}
		}
	})	
	
	/* Blog-slider */
	$('.blog-img-side').owlCarousel({
		loop:true,
		navText:['<i class="lnr lnr-chevron-left"></i>','<i class="lnr lnr-chevron-right"></i>'],
		nav:true,
		autoplay:true,
		animateOut: 'fadeOut',
		responsive:{
			0:{
				items:1
			},
			450:{
				items:1
			},
			768:{
				items:1
			},
			1000:{
				items:1
			}
		}
	}); 
	
     $('.count').counterUp({
        delay: 10,
        time: 5000
    }); 
	
	
   /*  youtube video */
    $('.youtube-bg').YTPlayer({
        videoURL: "r4dD-WYzrMs",
        containment: '.youtube-bg',
        autoPlay: true,
        loop: true,
		showControls: false,
		mute:true
    });
	
	$.scrollUp({
		scrollName: 'scrollUp', 
		topDistance: '300',
		topSpeed: 300, 
		animation: 'fade', 
		animationInSpeed: 1000, 
		animationOutSpeed: 1000, 
		scrollText: '<i class="lnr lnr-chevron-up"> </i>', 
	});	
	
})(jQuery);	