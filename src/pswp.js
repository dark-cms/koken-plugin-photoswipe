var initPhotoSwipeFromDOM = function(options) {

	var parseThumbnailElements = function(el) {
		var items = []
		el.children("img").each(function(){
			item = {};
			base = $(this).attr('data-base');
			ext = $(this).attr('data-extension');
			item['_common'] = {
				"msrc": $(this).attr('data-src') || $(this).attr('src')
			};

			jQuery.each($(this).attr('data-presets').split(" "), function(i,val) {
				preset_info = val.split(",");
				name = preset_info[0];
				size_factor = isHighDensity() ? 2 : 1;
				retina = isHighDensity() ? '.2x.' : '.';
				w = parseInt(preset_info[1]);
				h = parseInt(preset_info[2]);
				src = base+name+retina+ext;

				item[name] = {
					"src": src,
					"w": size_factor*w,
					"h": size_factor*h
				};
			});
			items.push(item);
		});
		return items;
	};

	// parse picture index and gallery index from URL (#&pid=1&gid=2)
	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
		params = {};

		if(hash.length < 5) {
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');  
			if(pair.length < 2) {
				continue;
			}           
			params[pair[0]] = pair[1];
		}

		if(params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		if(!params.hasOwnProperty('pid')) {
			return params;
		}
		params.pid = parseInt(params.pid, 10);
		return params;
	};

	var openPhotoSwipe = function(index, disableAnimation) {
		var pswpElement = $('.pswp')[0],
			gallery,
			options,
			items;

		items = parseThumbnailElements(galleryElements);

		availableShareButtons = {
			facebook:{ id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
			twitter:{id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
			pinterest:{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'},
			gplus:{id:'gplus', label:'Google+', url:'https://plus.google.com/share?url={{url}}'},
			tumblr:{id:'tumblr', label:'Tumblr', url:'http://www.tumblr.com/share/photo?caption={{text}}&click_thru={{url}}&source={{image_url}}'},
			download:{id:'download', label:'Download Image', url:'',download:true}
		};
		var shareButtons = Array();
		$.each(koken_options.sharing, function(index,value) {
			shareButtons.push(eval('availableShareButtons.'+value));
		});

		// define options (if needed)
		options = {
			index: parseInt(index),
			preload: [5,5],

			getThumbBoundsFn: function(index) {
				el=$("[data-pswp-gid='"+index+"']").children("img");
				return {x:el.offset().left, y:el.offset().top, w:el.width()};
			},

			shareButtons: shareButtons,
			shareEl: (shareButtons.length>0),
			// prevent zooming to 200x on retina devices (eg retina macbook pro, ipads)
			getDoubleTapZoom: function(){
			if (window.devicePixelRatio > 1)
			{return 0.5;}
			else {return 1;}
			}	
		};

		if(disableAnimation) {
			options.showAnimationDuration = 0;
		}
		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

		// create variable that will store real size of viewport
		var realViewportWidth,
			useImageSize = 'medium_large',
			firstResize = true,
			imageSrcWillChange;

		// beforeResize event fires each time size of gallery viewport updates
		gallery.listen('beforeResize', function() {
			// calculate real pixels when size changes
			size_factor = isHighDensity() ? 2 : 1;
			realViewportWidth = gallery.viewportSize.x * size_factor;

			// Code below is needed if you want image to switch dynamically on window.resize

			// Find out if current images need to be changed
			if(useImageSize!='huge' && realViewportWidth >=1600 && 'huge' in items[0]) {
				useImageSize = 'huge';
				imageSrcWillChange = true;
			} else if(useImageSize!='xlarge' && realViewportWidth >= 1024 && 'xlarge' in items[0]) {
				useImageSize = 'xlarge';
				imageSrcWillChange = true;
			} else if(useImageSize!='large' && realViewportWidth >= 800 && 'large' in items[0]) {
				useImageSize = 'large';
				imageSrcWillChange = true;
			} else if(useImageSize!='medium_large') {
				useImageSize = 'medium_large';
				imageSrcWillChange = true;
			}

			// Invalidate items only when source is changed and when it's not the first update
			if(imageSrcWillChange && !firstResize) {
				// invalidateCurrItems sets a flag on slides that are in DOM,
				// which will force update of content (image) on window.resize.
				gallery.invalidateCurrItems();
			}

			if(firstResize) {
				firstResize = false;
			}

			imageSrcWillChange = false;

		});

// This needs to be improved. Having close animation and scroll at same time results in something weird and unnatural.
//
//		  gallery.listen('close', function() {
//            index = gallery.getCurrentIndex();
//            el=$("[data-pswp-gid='"+index+"']").children("img");
//            $('html, body').animate({scrollTop:el.offset().top-$(window).height()/2+el.height()}, 500);
//        });

		// gettingData event fires each time PhotoSwipe retrieves image source & size
		gallery.listen('gettingData', function(index, item) {

			// Set image source & size based on real viewport width
			item.src = item[useImageSize].src;
			item.msrc = item['_common'].msrc;
			item.w = item[useImageSize].w;
			item.h = item[useImageSize].h;

			// It doesn't really matter what will you do here, 
			// as long as item.src, item.w and item.h have valid values.
			// 
			// Just avoid http requests in this listener, as it fires quite often

		});
		/*
		gallery.listen('imageLoadComplete', function(index, item) {
			console.log(index);
			console.dir(item);
		});
		*/

		var scroll_move = null;
		if (typeof $K == 'object') {
			if (typeof $K.keyboard == 'object') {
				if (typeof $K.keyboard.scroll == 'object') {
					if (typeof $K.keyboard.scroll.move == "function") {
						scroll_move = $K.keyboard.scroll.move;
						$K.keyboard.scroll.move = function(){return true;};
					}
				}
			}
		}
		gallery.listen('destroy',function(){
			if (scroll_move) {
				$K.keyboard.scroll.move = scroll_move;
				scroll_move = null;
			}
		});
		gallery.init();
	};

	var isHighDensity = function(){
		return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 144dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
	};

	var initPS = function(){
		var i = 0;
		galleryElements = $(koken_options.triggerEl);
		galleryElements.each(function(){
			if ($(this).children("img").length>0) {
				$(this).click(function(e){
					openPhotoSwipe(parseInt($(this).first().attr('data-pswp-gid')));
					return false;
				});
				$(this).attr('data-pswp-gid',i);
				i++;
			}
		});
	}
	var koken_options = options;

	var galleryElements = $(koken_options.triggerEl);

	$(window).on('k-infinite-loaded',function(){
		initPS();
	});

	initPS();
	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
	if(hashData.pid > 0) {
		openPhotoSwipe( hashData.pid - 1 , true );
	}

};
