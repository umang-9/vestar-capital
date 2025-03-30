var scrollTopFlag = false;
var scrollBottomFlag = false;
var scrollBottomCounter = 0;
var lastScrollTop = 0;
var isEdge = !isIE && !!window.StyleMedia;
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var isAnimationBackward = false, isAnimationForward = false;
var aboveSection = null;
// var aboutHtml = null;
var aboutHighlightTextColor = "#1CA6DF";
var isMobile = false, isDesktop = false;

if (isIE || isEdge) {
  $('body').addClass('edge-browser');
}

if (iOS) {
  $('body').addClass('ios-browser');
}

// var current = location.pathname;
// $('#navbarMain ul li a').each(function () {
// 	var match_href = $(this).attr('href');

// 	// if the current path is like this link, make it active
// 	if (~current.indexOf(match_href)) {
// 		$(this).parent().addClass('active');
// 	}
// });

// document.ready start
$(document).ready(function () {

  if ($(".should-stickey").length) {
    if ($(window).scrollTop() > 0) {
      $('.site-header').addClass('scrolled');
    } else {
      $('.site-header').removeClass('scrolled');
    }
  }

  setTimeout(function () {
    if ($(".no-fullpage").length) {
      $(".no-fullpage").animate({
        opacity: 1
      }, 20);
    }
  }, 1000);

  /* [Window onload function] */
  window.onload = function () {
    // console.log("onLoad");
    bsMenuOnHover();

  };

  // if (window.matchMedia("(min-width: 768px)").matches) {
  //   if ($(".about-section-content").length) {
  //     $(".about-section-content").mCustomScrollbar({
  //       callbacks:{
  //         // onScroll:function(){
  //         //   console.log('pxlCount:');
  //         //   $(".about-section-content p").css({"webkit-filter": "blur(4px)",
  //         //   "moz-filter":"blur(4px)",
  //         //  "ms-filter":"blur(4px)",
  //         //  "o-filter":"blur(4px)",
  //         //  "filter":"blur(4px)"});

  //         // }
  //       }
  //     });
  //   }
  // }

  const $dropdown = $("header .dropdown");
  const $dropdownToggle = $("header .dropdown-toggle");
  const $dropdownMenu = $("header .dropdown-menu");
  const showClass = "show";

  /* [Bootstrap sub-menu work on hover] */
  window.bsMenuOnHover = function () {
    if (this.matchMedia("(min-width: 1200px)").matches) {
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");
    }
  }

   /* [Toggle search] */
  //  $(".toggle-search, .close-search").on("click", function (e) {
  //   e.preventDefault();
  //   $(".search-popup").toggleClass("active");
  //   if ($(this).hasClass("close-search")) {
  //     $("#inputSearch").val("");
  //   }
  // });

  $('#nav-icon').click(function(){
    $(this).toggleClass('open');
    $("navbar-brand").toggleClass('menu-open');
  });

  $('#accordion').on('shown.bs.collapse', function () {
    $.fn.fullpage.reBuild();
  });

  $('#accordion').on('hidden.bs.collapse', function () {
    $.fn.fullpage.reBuild();
  });


});
// document.ready end 

$(window).scroll(function (e) {
  if ($(".should-stickey").length) {
    if ($(window).scrollTop() > 0) {
      $('.site-header').addClass('scrolled');
    } else {
      $('.site-header').removeClass('scrolled');
    }
  }
});

/* Options for page transition animation */
const options = [
  {
    from: '(.*)',
    to: '(.*)',
    in: function (next) {
      animateFadeInSimple(next);
    },
    out: function (next) {
      if (isAnimationBackward || isAnimationForward) {
        animateFadeOutLeft(next);
        isAnimationBackward = isAnimationForward = false;
      } else {
        animateFadeOutSimple(next);
      }
    }
  },
  {
    from: '(.*)',
    to: '(.*)-detail.html',
    in: function (next) {
      animateFadeIn(next);
    },
    out: function (next) {
      animateFadeOutLeft(next);
    }
  },
  {
    from: '(.*)-detail.html',
    to: '(.*)',
    in: function (next) {
      // console.log("In: from detail to any");
      animateFadeIn(next);
    },
    out: function (next) {
      // console.log("Out: from detail to any");
      animateFadeOutLeft(next);
    }
  },
];

const swup = new Swup({
  animateHistoryBrowsing: true,
  // plugins: [new SwupScrollPlugin(), new SwupJsPlugin(), new SwupDebugPlugin()]
  plugins: [new SwupScrollPlugin(), new SwupJsPlugin(options), new SwupScriptsPlugin(), new SwupBodyClassPlugin(), new SwupPreloadPlugin()]
});

init();

swup.on('contentReplaced', init);
swup.on('willReplaceContent', unload);

if ($('.scroll-up-sec').length) {
  var scrollUpSecOffsetTop = $('.scroll-up-sec').offset().top;
  var scrollUpSecHeight = $('.scroll-up-sec').outerHeight();
  var scrollUpSecOffsetBottom = scrollUpSecOffsetTop + scrollUpSecHeight;
}
swup.on('contentReplaced', function () {
  if ($(".no-fullpage").length) {
    swup.scrollTo(scrollUpSecOffsetBottom);
  }
});
if ($(".no-fullpage").length) {
  swup.scrollTo(scrollUpSecOffsetBottom);
}
swup.on('transitionEnd', function () {
  scrollTopFlag = false;
  setTimeout(function () {
    if ($(".no-fullpage").length) {
      $(".no-fullpage").animate({
        opacity: 1
      }, 20);
    }
  }, 1000);
});
swup.on('scrollDone', function () {
  setTimeout(function () {
    if ($(".no-fullpage").length) {
      $(".no-fullpage").animate({
        opacity: 1
      }, 20);
    }
  }, 1000);
});

/* [Reverse animation on popState event] */
// swup.on('popState', function (event) {
//   var fromPage = sessionStorage.getItem('thisPage');
//   var toPage = getPageNameFromPath(event.target.location.pathname);

//   isAnimationBackward =
//     (fromPage == "news-detail.html" && toPage == "news.html") ||
//     (fromPage == "portfolio-detail.html" && toPage == "portfolio.html") ||
//     (fromPage == "people-detail.html" && toPage == "people.html");

//   isAnimationForward =
//     (fromPage == "news.html" && toPage == "news-detail.html") ||
//     (fromPage == "portfolio.html" && toPage == "portfolio-detail.html") ||
//     (fromPage == "people.html" && toPage == "people-detail.html");

//   console.log("popState: " + fromPage + " -> " + toPage);
//   console.log("isAnimationBackward: " + isAnimationBackward);
//   console.log("isAnimationForward: " + isAnimationForward);
// });

/* [Set location when page change] */
swup.on('pageView', function () {
  setLocation();
});

/* [Actions when page loaded] */
document.addEventListener("DOMContentLoaded", function (event) {
  setLocation();
});

/* [Set location function] */
function setLocation() {
  var urlPath = window.location.pathname;
  var thisPage = getPageNameFromPath(urlPath);
  var lastPage = sessionStorage.getItem('thisPage');

  sessionStorage.setItem('thisPage', thisPage);
  sessionStorage.setItem('lastPage', lastPage);
  // console.log("Last page:", lastPage, "| This page:", thisPage);
}

/* [Get Page name from Path] */
function getPageNameFromPath(url) {
  var urlArr = url.split('/');
  var pageName = "index.html";
  if (urlArr[urlArr.length - 1].length) {
    pageName = urlArr[urlArr.length - 1];
  }
  // console.log(pageName);
  return pageName;
}

/* [Animation Functions] */
function animateFadeInSimple(next) {
  const tlFadeIn = gsap.timeline({ paused: true });
  tlFadeIn.fromTo('.site-content', 0.6, {
    // xPercent: 100,
    autoAlpha: 0
  }, {
    // xPercent: 0,
    autoAlpha: 1,
    ease: Linear.easeOut,
    onComplete: next
  }, 0).play();
}

function animateFadeOutSimple(next) {
  const tlFadeOut = gsap.timeline({ paused: true });
  tlFadeOut.fromTo('.site-content', 0.6, {
    // xPercent: 100,
    autoAlpha: 1
  }, {
    // xPercent: 0,
    autoAlpha: 0,
    ease: Linear.easeOut,
    onComplete: next
  }, 0).play();
}

function animateFadeIn(next) {
  const tlFadeIn = gsap.timeline({ paused: true });
  tlFadeIn.fromTo('.site-content-cover', 0.6, {
    // xPercent: 100,
    autoAlpha: 0
  }, {
    // xPercent: 0,
    autoAlpha: 1,
    ease: Linear.easeOut,
    onComplete: next
  }, 0).play();
}

function animateFadeOutLeft(next) {
  const tlFadeOutLeft = gsap.timeline({ paused: true });
  tlFadeOutLeft.to('.site-content-cover', 0.6, {
    xPercent: -100,
    autoAlpha: 0,
    ease: Linear.easeOut,
    onComplete: next
  }, 0).play();
}

function init() {
  // console.log("Init");

  var isIE = /*@cc_on!@*/false || !!document.documentMode;
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIE || isEdge) {
    $('body').addClass('edge-browser');
  }

  if (iOS) {
    $('body').addClass('ios-browser');
  }

  if (window.matchMedia("(min-width: 768px)").matches) {
    if ($(".about-section-content").length) {
      $(".about-section-content").mCustomScrollbar();
    }
  }


  var revealDuration = 0.5;
  var revealStartTime = 0.5;

  // Banner Caption animation start
  if ($(".banner-section").length) {
    var bannerCaption = gsap.timeline();
    bannerCaption.fromTo('.banner-caption-text', revealDuration, { autoAlpha: 0 },{ autoAlpha: 1 }, revealStartTime)
      .pause();
      bannerCaption.play();
  }
  // Banner Caption animation end


  // About page animation start
  if ($(".about-section").length) {
    var aboutSection = gsap.timeline();
    aboutSection
      .fromTo('.about-section  .banner-caption-text', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
      .pause();
    aboutSection.play();

    // inner section content animation start 
		var controller = new ScrollMagic.Controller();
		$("section .inner-section").each(function () {
			const timeline = gsap.timeline({ paused: true });

			var sectionElements = $(this);

			timeline
        .fromTo(sectionElements, revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
        .pause();
				
			var scene = new ScrollMagic.Scene({
				triggerElement: this,
				reverse: false,
				offset: -300,
				triggerHook: 0,
			})
      .setTween(timeline.play())
      // .addIndicators({
      // 	colorTrigger: "red",
      // 	colorStart: "blue",
      // 	colorEnd: "green",
      // 	indent: 40
      // 	})
      .addTo(controller);

		});
		// inner section content animation end

  }
  // About page animation end


  //Investment Philosophy page animation start
  if ($(".our-approach-top-section").length) {
    var approachTopSection = gsap.timeline({ paused: false });
      approachTopSection
        .fromTo('.our-approach-tab-content-section > *', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  //Investment Philosophy page animation end


  //Value Creation Strategy page animation start
  if ($(".value-creation-strategy-inner-section").length) {
    var valueCreationSection = gsap.timeline({ paused: false });
      valueCreationSection
        .fromTo('.value-creation-strategy-inner-section > *', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  //Value Creation Strategy page animation end


  //Sector Focus page animation start
  if ($(".sector-focus-sub-section").length) {
    var sectorFocusSection = gsap.timeline({ paused: false });
    sectorFocusSection
        .fromTo('.sector-focus-sub-section > *', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  //Sector Focus page animation end


  //Sector Focus Details page animation start
  if ($(".sector-cosumer-details-page-inner-section").length) {
    var sectorFocusDetailsSection = gsap.timeline({ paused: false });
    sectorFocusDetailsSection
        .fromTo('.sector-cosumer-details-page-inner-section > *', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  //Sector Focus Details page animation end


  //Portfolio page animation start
  if ($(".portfolio-listing-section .inner-section").length) {
    var portfolioSection = gsap.timeline({ paused: false });
    portfolioSection
        .fromTo('.portfolio-listing-section .inner-section > *', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  //Portfolio page animation end


  //Portfolio Details page animation start
  if ($(".portfolio-details-section .inner-section").length) {
    var portfolioDetailsSection = gsap.timeline({ paused: false });
    portfolioDetailsSection
        .fromTo('.portfolio-details-section .inner-section > *', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  //Portfolio Details page animation end


  // Team listing page animation start 
  if ($(".team-listing-inner-section").length) {
    var teamListingController = new ScrollMagic.Controller();
    const teamLstingTimeline = gsap.timeline({ paused: true });

    var sectionElements = $('.team-listing-inner-section');

    teamLstingTimeline
      .fromTo(sectionElements, revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
      .pause();
      
    var scene = new ScrollMagic.Scene({
      triggerElement: '.team-listing-inner-section',
      reverse: false,
      offset: -300,
      triggerHook: 0,
    })
    .setTween(teamLstingTimeline.play())
    // .addIndicators({
    // 	colorTrigger: "red",
    // 	colorStart: "blue",
    // 	colorEnd: "green",
    // 	indent: 40
    // 	})
    .addTo(teamListingController);
  }
  // Team listing page animation end


  // Team detail page animation start 
  if ($(".team-details-section").length) {
    var teamDetail = gsap.timeline({ paused: false });
    teamDetail
        .fromTo('.team-details', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  if ($(".bottom-responsible-investing").length) {
    var responsibleInvesting = gsap.timeline({ paused: false });
    responsibleInvesting
        .fromTo('.bottom-content-block', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  if ($(".news-listing-inner-section").length) {
    var newsListing = gsap.timeline({ paused: false });
    newsListing
        .fromTo('.news-listing-inner-section .section-title, .news-listing-inner-section .filter-options, .news-listing-inner-section .feature-news-wrap, .news-listing-inner-section .news-listing, .news-listing-inner-section .pagination-wrap', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  if ($(".news-detail-section").length) {
    var newsWithImage = gsap.timeline({ paused: false });
    newsWithImage
        .fromTo('.news-detail-with-image > *, .news-detail-inner-section > *', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  if ($(".video-gallry-slider-section").length) {
    var videoGallarySlider = gsap.timeline({ paused: false });
    videoGallarySlider
        .fromTo('.video-gallary-slider', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  if ($(".video-gallary-listing-section").length) {
    var videoListing = gsap.timeline({ paused: false });
    videoListing
        .fromTo('.gallary-listing-inner-section .section-title, .gallary-listing-inner-section .filter-options', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime);
    videoListing
        .staggerFromTo('.gallary-listing-inner-section .video-item-wrap', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  // Team detail page animation start


  //Footer animation start
  if ($(".site-footer > .row").length) {
    var footerSection = gsap.timeline({ paused: false });
    footerSection
        .fromTo('.site-footer > .row', revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
  }
  //Footer animation end


  //Case study slider start
  if($('.case-study-slider').length) {
    $('.case-study-slider').slick({
      speed: 500,
      fade: true,
      cssEase: 'linear',
      prevArrow: '<button class="slide-arrow slick-prev"><i class="fal fa-chevron-left"></i></button>',
    nextArrow: '<button class="slide-arrow slick-next"><i class="fal fa-chevron-right"></i></button>'
    });
  }
  //Case study slider end


  // Community Involvement page animation start 
  if ( $('.bottom-responsible-investing').length ) {
    var communityInvolvementController = new ScrollMagic.Controller();
    const communityInvolvement = gsap.timeline({ paused: true });

    var sectionElements = $('.bottom-content-block .content-block-wrapper');

    communityInvolvement
      .fromTo(sectionElements, revealDuration, { autoAlpha: 0 }, { autoAlpha: 1 }, revealStartTime)
      .pause();
      
    var scene = new ScrollMagic.Scene({
      triggerElement: '.bottom-content-block .content-block-wrapper',
      reverse: false,
      offset: -300,
      triggerHook: 0,
    })
    .setTween(communityInvolvement.play())
    // .addIndicators({
    // 	colorTrigger: "red",
    // 	colorStart: "blue",
    // 	colorEnd: "green",
    // 	indent: 40
    // 	})
    .addTo(communityInvolvementController);
  }
  // Community Involvement page animation end


  //Feature video slider start
  if($('.video-gallary-slider').length) {
    $('.video-gallary-slider').slick({
      speed: 500,
      fade: true,
      cssEase: 'linear',
      prevArrow: '<button class="slide-arrow slick-prev"><i class="fal fa-chevron-left"></i></button>',
    nextArrow: '<button class="slide-arrow slick-next"><i class="fal fa-chevron-right"></i></button>'
    });
  }
  //Feature video slider End


  // News-detail-gallry slider
  if($('.news-image-gallary').length) {
    $('.gallry-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 500,
      fade: true,
      arrows:false,
      cssEase: 'linear',
      asNavFor: '.gallry-slider-nav'
    });
    $('.gallry-slider-nav').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows:false,
      asNavFor: '.gallry-slider',
      dots: false,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 414,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        }
      ]
    });
  }
  // News-detail-gallry slider End


  //testimonials video start
  if ($(".video-link").length > 0) {
    $('.video-link').click(function () {
        var _videow = $(".embed-responsive").width();
        var _videoh = $(".embed-responsive").height();
        var video = '<div class="embed-responsive embed-responsive-16by9"><iframe id="modal-video" src="' + $(this).attr('data-video') + '" height="' + _videoh + '" width="' + _videow + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe></div>';
        $(this).parent('.embed-responsive').replaceWith(video);
    });
  }
  //testimonials video end


  // video-gallry js start 
  if($(".video-gallary-slide").length > 0){
      $('.video-gallary-slide').magnificPopup({
      delegate: 'a', 
      type: 'iframe',
      gallery:{
        enabled:true
      }
    });
  }

  if($(".gallry-listing-wrap").length > 0){
    $('.video-item-wrap .video-wrapper').magnificPopup({
    delegate: 'a', 
    type: 'iframe',
    gallery:{
      enabled:true
    }
    });
  }

  if($(".testimonials-section").length > 0){
    $('.video-wrapper').magnificPopup({
    delegate: 'a', 
    type: 'iframe',
    gallery:{
      enabled:true
    }
    });
  }
  // video-gallry js start


  //scroll to team listing section js for "Meet Our Team" button
  $(document).on('click', '#moveToTeamListing', function(){
    fullpage_api.moveTo('page3', 1);
  });
  //scroll to team listing section js for "Meet Our Team" button


  if (document.querySelector('#fullpage')) {
    $('#fullpage').fullpage({
      licenseKey: 'A2B14386-2C614A99-B097591D-BAD19F4B',
      lockAnchors: true,
      anchors: ['page1', 'page2', 'page3', 'page4'],
      // parallax: true,
      // parallaxKey: 'YmNscy5sb3VzY2gubmV0X1dJcGNHRnlZV3hzWVhnPVkxag==',
      // parallaxOptions: {
      //   type: 'reveal',
      //   percentage: 100,
      //   property: 'translate'
      // },
      scrollingSpeed: 1000,
      verticalCentered: false,
      fitToSectionDelay: 0,
      controlArrows: false,
      // css3: false,
      // touchSensitivity: 0,
      // autoScrolling: false,
      scrollOverflow: true,
      scrollOverflowOptions: {
        keyBindings: {
          pageUp: 33,
          pageDown: 34
        }
      },
      normalScrollElements: '.dropdown-menu, #navbarMain',
      onLeave: function (origin, destination, direction) {
        // console.log("onLeave", origin.item);
        // console.log("onLeave", destination.index);

        const activeSlide = origin.item.querySelector('.slide.active');
        // console.log(activeSlide);

        var scroll = null;
        if (activeSlide) {
          // console.log("Slides");
          scroll = activeSlide.querySelector('.fp-scrollable');
        } else {
          // console.log("No Slides");
          scroll = origin.item.querySelector('.fp-scrollable');
        }

        // console.log("Scroll:", scroll);

        if (scroll) {
          const cannotPrev = origin.index > destination.index && scroll.fp_iscrollInstance.y < 0;
          const cannotNext = origin.index < destination.index && scroll.fp_iscrollInstance.y > scroll.fp_iscrollInstance.maxScrollY;
          // $('.site-header').addClass('scrolled');
          if (cannotPrev || cannotNext) {
            // console.log("cannotPrev: " + cannotPrev, "cannotPrev: " + cannotNext);
            return false;
          }
        }

        if ($('.move-prev-page-sec').length) {
          if (destination.index > 1) {
            if ($(".should-stickey").length) {
              $('.site-header').addClass('scrolled');
            }
          } else {
            if ($(".should-stickey").length) {
              $('.site-header').removeClass('scrolled');
            }
          }
        } else {
          if (destination.index > 0) {
            if ($(".should-stickey").length) {
              $('.site-header').addClass('scrolled');
            }
          } else {
            if ($(".should-stickey").length) {
              $('.site-header').removeClass('scrolled');
            }
          }
        }

        if ($(destination.item).hasClass('banner-section')) {
          if ($(".banner-caption-text").length) {
            bannerCaption.play();
          }
        } else {
          if ($(".banner-caption-text").length) {
            // bannerCaption.reverse();
          }
        }

        if ($(destination.item).hasClass('move-next-page-sec')) {
					if ($(".move-next-page-sec").length) {
            // console.log("Entered move-next-page-sec");
						gsap.delayedCall(0, moveToNextPageOnSroll);
					}
				}

        if ($('.move-prev-page-sec').length) {
					if (destination.index == 0 && direction == 'up') {
						// changePageSlantColor();
						moveToPrevPageOnSroll();
					}
				}

        // if (window.matchMedia("(min-width: 768px)").matches) {
        //   if ($(".about-section-content").length) {
        //     $(".about-section-content").mCustomScrollbar();
        //   }
        // }

        if ($(destination.item).hasClass('about-section')) {
          if ($(".about-section").length) {
            // console.log('about-section');
            aboutSection.play();
          }
        }

        if ($(destination.item).hasClass('our-approach-section')) {
          if ($(".our-approach-top-section").length) {
            approachTopSection.play();
          }
        }

        if ($(destination.item).hasClass('site-footer')) {
          if ($(".site-footer > .row").length) {
            footerSection.play();
          }
        }
        
        if ($(destination.item).hasClass('value-creation-strategy-section')) {
          if ($(".value-creation-strategy-inner-section").length) {
            valueCreationSection.play();
          }
        }

        if ($(destination.item).hasClass('sector-focus-page-section')) {
          if ($(".sector-focus-sub-section").length) {
            sectorFocusSection.play();
          }
        }
        
        if ($(destination.item).hasClass('sector-cosumer-details-page-section')) {
          if ($(".sector-cosumer-details-page-inner-section").length) {
            sectorFocusDetailsSection.play();
          }
        }

        if ($(destination.item).hasClass('portfolio-listing-section')) {
          if ($(".portfolio-listing-section .inner-section").length) {
            portfolioSection.play();
          }
        } 

        if ($(destination.item).hasClass('portfolio-details-section')) {
          if ($(".portfolio-details-section .inner-section").length) {
            portfolioDetailsSection.play();
          }
        } 

      },
      afterLoad: function (origin, destination, direction) {
        // console.log("afterLoad");
        // console.log("AFter load page index:", destination.index);
        if (!$('html').hasClass('fullpage-ready')) {
          $('html').addClass('fullpage-ready');
        }

        if ($(destination.item).hasClass('about-section')) {
          if ($(".about-section").length) {
            // console.log('about-section');
            aboutSection.play();
            // $.fn.fullpage.reBuild();
          }
        }

        if ($(destination.item).hasClass('vestar-by-the-number-section')) {
          if ($(".counterWrap .count").length > 0) {
            $('.counterWrap .count').counterUp({
                delay: 10,
                time: 1000
            });
          }
        }

        if ($('.move-next-page-sec').length && $('.move-prev-page-sec').length) {
          if (destination.index == 0) {
            $.fn.fullpage.silentMoveTo('page2', 0);
          }
        }

        if ($(destination.item).hasClass('our-approach-section')) {
          if ($(".our-approach-top-section").length) {
            approachTopSection.play();
          }
        }

        if ($(destination.item).hasClass('site-footer')) {
            if ($(".site-footer > .row").length) {
              footerSection.play();
            }
        }

        if ($(destination.item).hasClass('value-creation-strategy-section')) {
          if ($(".value-creation-strategy-inner-section").length) {
            valueCreationSection.play();
          }
        }
        if ($(destination.item).hasClass('team-details-section')) {
          if ($(".team-details-section").length) {
            teamDetail.play();
          }
        }
        if ($(destination.item).hasClass('banner-responsible-investing')) {
          if ($(".bottom-responsible-investing").length) {
            responsibleInvesting.play();
          }
        }
        if ($(destination.item).hasClass('news-listing-section')) {
          if ($(".news-listing-inner-section").length) {
            newsListing.play();
          }
        }
        if ($(destination.item).hasClass('news-detail-section')) {
          if ($(".news-detail-section").length) {
            newsWithImage.play();
          }
        }
        if ($(destination.item).hasClass('video-gallry-slider-section')) {
          if ($(".video-gallry-slider-section").length) {
            videoGallarySlider.play();
          }
        }
        if ($(destination.item).hasClass('.video-gallary-listing-section')) {
          if ($(".video-gallary-listing-section").length) {
            videoListing.play();
          }
        }
        if ($(destination.item).hasClass('sector-focus-page-section')) {
          if ($(".sector-focus-sub-section").length) {
            sectorFocusSection.play();
          }
        }
        if ($(destination.item).hasClass('sector-cosumer-details-page-section')) {
          if ($(".sector-cosumer-details-page-inner-section").length) {
            sectorFocusDetailsSection.play();
          }
        }
        if ($(destination.item).hasClass('portfolio-listing-section')) {
          if ($(".portfolio-listing-section .inner-section").length) {
            portfolioSection.play();
          }
        } 
        if ($(destination.item).hasClass('portfolio-details-section')) {
          if ($(".portfolio-details-section .inner-section").length) {
            portfolioDetailsSection.play();
          }
        }

      },
      onSlideLeave: function (section, origin, destination, direction) {
        

      },
      afterRender: function () {
        // console.log("afterRender");
        // $.fn.fullpage.reBuild();
      }
    });
  }


  setTimeout(function () {
    // console.log("Before Rebuild: Scrollbar height:", $('.iScrollIndicator').height());
    $.fn.fullpage.reBuild();
    // console.log("Rebuild on timeout");
  }, 1000);

  $('.dropdown').on('shown.bs.dropdown', function (e) {
    setTimeout(function () {
      $(e.target).addClass('shown');
    }, 350);
  });
  $('.dropdown').on('hide.bs.dropdown', function (e) {
    $(e.target).removeClass('shown');
  });

  // if ( !$(".search").hasClass('search--open') ) {
  //   $('.').style.display = "none";
  // }

  

  const $dropdown = $("header .dropdown");
  const $dropdownToggle = $("header .dropdown-toggle");
  const $dropdownMenu = $("header .dropdown-menu");
  const showClass = "show";

  /* [Bootstrap sub-menu work on hover] */
  window.bsMenuOnHover = function () {
    if (this.matchMedia("(min-width: 1200px)").matches) {
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");
    }
  }

  bsMenuOnHover();

}

function unload() {
  if (document.querySelector('#fullpage')) {
    $.fn.fullpage.destroy('all');
  }
}


function moveToNextPageOnSroll() {
  var currentPage;
  if (document.location.pathname == "/html/") {
    currentPage = 'index.html';
  } 
  else {
    currentPage = document.location.pathname.match(/[^\/]+$/)[0];
    // console.log(currentPage);
  }

  if (currentPage == 'index.html') {
    // console.log("moveToNextPageOnSroll if");
    swup.loadPage({
      url: '/html/about-us.html',
    });
  } 
  else {
    
    if ($(".navbar .navbar-nav > li.active").length) {
      // console.log("moveToNextPageOnSroll else");
      if (!$(".navbar .navbar-nav > li.active").is(':last-child')) {

        if($(".navbar .navbar-nav > li.active").hasClass('dropdown') && !$(".navbar .navbar-nav .dropdown-menu a.active").is(':last-child')) {
          // console.log("main if");
            if ( $('.our-approach-title-tabs-wrap .custom-tabs > .tab-btn.active').length ) {
              if (!$('.our-approach-title-tabs-wrap .custom-tabs > .tab-btn.active').is(':last-child')) {
                navNextLink = $(".our-approach-title-tabs-wrap .custom-tabs .tab-btn.active").next().attr("href");
                // console.log("current page partners-with-management.html if");
              }
              else {
                navNextLink = $(".navbar .navbar-nav > li.active .dropdown-menu a.active").next().attr("href");
                // console.log("Next page link:" + navNextLink);
                console.log("current page partners-with-management.html inner else");
              }
            } 
            else {
              navNextLink = $(".navbar .navbar-nav > li.active .dropdown-menu a.active").next().attr("href");
              // console.log("current page partners-with-management.html  else");
            }
        }

        else {
          // console.log("main else");
          navNextLink = $(".navbar .navbar-nav > li.active a").parent().next().children("a").attr("href")
        }

        swup.loadPage({
          url: navNextLink,
        });
        
      }
    }
  }

}

function moveToPrevPageOnSroll() {
  var currentPage = document.location.pathname.match(/[^\/]+$/)[0];
  // console.log(currentPage);
  if (currentPage == 'about-us.html') {
    console.log("First If");
    swup.loadPage({
      url: '/html/',
    });
  } 
  else {
    if ($(".navbar .navbar-nav > li.active").length) {
      // var prevChild = $(".navbar .navbar-nav > li.active").prev();
      // console.log('Previous child: ' + prevChild);
      if( ($(".navbar .navbar-nav > li.active").prev().hasClass('dropdown') && !$(".navbar .navbar-nav > li.active").hasClass('dropdown')) || ($(".navbar .navbar-nav > li.active").prev().hasClass('dropdown') && $(".navbar .navbar-nav > li.active").hasClass('dropdown') && $(".navbar .navbar-nav > li.active a.active").is(':first-child')) ) {
        // console.log("main if");
        // navNextLink = $(".navbar .navbar-nav > li .dropdown-menu a:last-child").attr("href");
        navNextLink = $(".navbar .navbar-nav > li.active").prev().find(".dropdown-menu a:last-child").attr("href");
          // console.log("current page partners-with-management.html if");
        
      }

      else if($(".navbar .navbar-nav > li.active").hasClass('dropdown') && !$(".navbar .navbar-nav .dropdown-menu a.active").is(':first-child')) {
        navNextLink = $(".navbar .navbar-nav > li.active .dropdown-menu a.active").prev().attr("href");
        // console.log("main else if 1");
      }

      else if($(".navbar .navbar-nav > li.active").hasClass('dropdown') && $(".navbar .navbar-nav .dropdown-menu a.active").is(':first-child')) {
        navNextLink = $(".navbar .navbar-nav > li.active a").parent().prev().children("a").attr("href")
        // console.log("main else if 2");
      }

      else {
        // console.log("main else");
        navNextLink = $(".navbar .navbar-nav > li.active a").parent().prev().children("a").attr("href")
      }

      // navNextLink = $(".navbar .navbar-nav > li.active a").parent().prev().children("a").attr("href");
      // console.log($(".bottom-header .navbar-nav > li.active a").parent().next().children("a").attr("href"));
      // $(navNextLink).trigger("click");
      // console.log(navNextLink);

      swup.loadPage({
        url: navNextLink,
      });
    }
  }

}
