const jQuery = require("./8ee62bea.js");
jQuery.extend({bez:function(encodedFuncName,coOrdArray){if(jQuery.isArray(encodedFuncName)){coOrdArray=encodedFuncName;encodedFuncName="bez_"+coOrdArray.join("_").replace(/\./g,"p")}if(typeof jQuery.easing[encodedFuncName]!=="function"){var polyBez=function(p1,p2){var A=[null,null],B=[null,null],C=[null,null],bezCoOrd=function(t,ax){C[ax]=3*p1[ax],B[ax]=3*(p2[ax]-p1[ax])-C[ax],A[ax]=1-C[ax]-B[ax];return t*(C[ax]+t*(B[ax]+t*A[ax]))},xDeriv=function(t){return C[0]+t*(2*B[0]+3*A[0]*t)},xForT=function(t){var x=t,i=0,z;while(++i<14){z=bezCoOrd(x,0)-t;if(Math.abs(z)<.001)break;x-=z/xDeriv(x)}return x};return function(t){return bezCoOrd(xForT(t),1)}};jQuery.easing[encodedFuncName]=function(x,t,b,c,d){return c*polyBez([coOrdArray[0],coOrdArray[1]],[coOrdArray[2],coOrdArray[3]])(t/d)+b}}return encodedFuncName}});;

(function($) {
	var Roulette = function(options) {		
		var defaultSettings = {
			maxPlayCount : null, // x >= 0 or null
			speed : 30, // x > 0
			stopImageNumber : null, // x >= 0 or null or -1
			rollCount : 3, // x >= 0
			duration : 2, //(x second)
			stopCallback : function() {
			},
			startCallback : function() {
			},
			slowDownCallback : function() {
			},
			audioManager: null
		}
		var defaultProperty = {
			playCount : 0,
			$rouletteTarget : null,
			imageCount : null,
			$images : null,
			originalStopImageNumber : null,
			totalHeight : null,
			topPosition : 0,

			maxDistance : null,
			slowDownStartDistance : null,

			isRunUp : true,
			isSlowdown : false,
			isStop : false,

			distance : 0,
			runUpDistance : null,
			slowdownTimer : null,
			isIE : navigator.userAgent.toLowerCase().indexOf('msie') > -1 // TODO IE
		};
		var p = $.extend({}, defaultSettings, options, defaultProperty);

		var reset = function() {
			p.maxDistance = defaultProperty.maxDistance;
			p.slowDownStartDistance = defaultProperty.slowDownStartDistance;
			p.distance = defaultProperty.distance;
			p.isRunUp = defaultProperty.isRunUp;
			p.isSlowdown = defaultProperty.isSlowdown;
			p.isStop = defaultProperty.isStop;
			p.topPosition = defaultProperty.topPosition;

			clearTimeout(p.slowDownTimer);
		}

		var slowDownSetup = function() {
			if(p.isSlowdown){
				return;
			}
			p.slowDownCallback();
			p.isSlowdown = true;
			p.slowDownStartDistance = p.distance;
			p.maxDistance = p.distance + (2 * p.totalHeight);
			p.maxDistance += p.imageHeight - p.topPosition % p.imageHeight;
			if (p.stopImageNumber != null) {
				p.maxDistance += (p.totalHeight - (p.maxDistance % p.totalHeight) + (p.stopImageNumber * p.imageHeight)) % p.totalHeight;
			}
		}

		var canPlaySound = true;
		var soundInterval = 0;
		var playSound = function() {
			if ( canPlaySound ) {
				canPlaySound = false;
				p.audioManager.playSound('spin_01',
				{
					channel: 'ui',
					delay: 0.0,
					forceStart: true
				});				
				setTimeout(function() {canPlaySound = true;}, 100)
			} else {				
				if(soundInterval == 0) {
					soundInterval = setInterval(function() {
						if(canPlaySound) {
							setTimeout(function() {canPlaySound = true;}, 100);
							p.audioManager.playSound('spin_01',
							{
								channel: 'ui',
								delay: 0.0,
								forceStart: true
							});
							clearInterval(soundInterval);
							soundInterval = 0;
							canPlaySound = false;
						}
					}, 5);
				}
			}
		}

		var roll = function() {
			if (p.totalHeight) {
				var numberRand = (Math.floor(Math.random() * (p.imageHeight - 12)) + 6);
				var startOfWinningCard = (p.totalHeight - (p.imageHeight * 7) - (p.imageHeight / 2));
				var totalTranslate = startOfWinningCard + numberRand;
				var centerOfWinningCard = startOfWinningCard + p.imageHeight / 2;
				var animationTime = 10000;

				p.$rouletteTarget.css('transition','all ' + animationTime + 'ms cubic-bezier(.09,.08,.1,.99)');
				p.$rouletteTarget.css('transform','translateX(-' + (totalTranslate) + 'px) rotate3d(0,0,0, 0deg)');

				var markerOffset = p.imageHeight/2;
				var last = 0; // last position a click was played at						
				$({tracker: 0}).animate({
					tracker:-centerOfWinningCard
				}, {
					duration: animationTime, easing: $.bez([.09,.08,.1,.99]),
					step: function(now) { // called every frame						
						if(last > Math.floor((now-markerOffset)/191)) {
							playSound()
							last = Math.floor((now-markerOffset)/191);
						}
					}
				})

				setTimeout(function() {finishedSliding(centerOfWinningCard);}, animationTime + 500);
			} else {
				setTimeout(roll, 1);
			}
		}

		var finishedSliding = function(centerOfWinningCard) {			
			p.$rouletteTarget.css('transition','all 300ms');
			p.$rouletteTarget.css('transform','translateX(-' + centerOfWinningCard + 'px) scale(1) rotate3d(0,0,0, 0deg');
			setTimeout(function() {p.stopCallback(centerOfWinningCard);}, 500);
		}

		var init = function($roulette) {
			$roulette.css({ 'overflow' : 'hidden' });
			defaultProperty.originalStopImageNumber = p.stopImageNumber;
			if (!p.$images) {
				p.$images = $roulette.find(p.itemSelector).remove();
				p.imageCount = p.$images.length;
				p.imageHeight = $(p.$images[0]).width() + 30;
				$roulette.css({ 'height' : ((p.imageHeight * 3) + 'px') });
				p.totalHeight = p.imageCount * p.imageHeight;
				p.runUpDistance = 2 * p.imageHeight;
				/*p.$images.eq(0).bind('load',function(){
				}).each(function(){
					if (this.complete || this.complete === undefined){
						var src = this.src;
						// set BLANK image
						this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
						this.src = src;
					}
				});*/
			}
			$(p.$rouletteTarget).empty();
			$roulette.find('div').remove();
			p.$images.css({
				'display' : 'block'
			});
			p.$rouletteTarget = $('<div>').css({
				'position' : 'relative',
				'top' : '0'
			}).attr('class',"roulette-inner");
			$roulette.append(p.$rouletteTarget);
			p.$rouletteTarget.append(p.$images);
			$roulette.show();
		}

		var start = function() {
			p.playCount++;
			if (p.maxPlayCount && p.playCount > p.maxPlayCount) {
				return;
			}
			p.stopImageNumber = $.isNumeric(defaultProperty.originalStopImageNumber) && Number(defaultProperty.originalStopImageNumber) >= 0 ?
									Number(defaultProperty.originalStopImageNumber) : Math.floor(Math.random() * p.imageCount);

			p.stopImageNumber = p.stopImageNumber == 0 ? (p.imageCount - 1) : p.stopImageNumber - 1;
			p.startCallback();
			roll();
		}

		var stop = function(option) {
			if (!p.isSlowdown) {
				if (option) {
					var stopImageNumber = Number(option.stopImageNumber);
					if (0 <= stopImageNumber && stopImageNumber <= (p.imageCount - 1)) {
						p.stopImageNumber = option.stopImageNumber;
					}
				}
				slowDownSetup();
			}
		}
		var option = function(options) {
			p = $.extend(p, options);
			p.speed = Number(p.speed);
			p.duration = Number(p.duration);
			p.duration = p.duration > 1 ? p.duration - 1 : 1;
			defaultProperty.originalStopImageNumber = options.stopImageNumber;
		}

		var ret = {
			start : start,
			stop : stop,
			init : init,
			option : option
		}
		return ret;
	}

	var pluginName = 'roulette';
	$.fn[pluginName] = function(method, options) {
		return this.each(function() {
			var self = $(this);
			var roulette = self.data('plugin_' + pluginName);

			if (roulette) {
				if (roulette[method]) {
					roulette[method](options);
				} else {
					console && console.error('Method ' + method + ' does not exist on jQuery.roulette');
				}
			} else {
				roulette = new Roulette(method);
				roulette.init(self, method);
				$(this).data('plugin_' + pluginName, roulette);
			}
		});
	}
})(jQuery);

