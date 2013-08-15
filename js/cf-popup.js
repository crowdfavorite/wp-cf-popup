(function($){
	// Don't run this on iOS. It appears to crash these devices running Mobile Safari currently.
	if (navigator.userAgent.match(/[\W]i(pad|phone|pod)[\W]/i)) {
	        return;
	}
	cfPopup = {
		showWhen : _cfPopup.showWhen,
		waitTime : _cfPopup.waitTime ? Math.abs(parseInt(_cfPopup.waitTime, 10)) : 0, // in seconds
		secondaryWaitTime : _cfPopup.secondaryWaitTime ? Math.abs(parseInt(_cfPopup.secondaryWaitTime, 10)) : 0, // in seconds
		interval : Math.abs(parseInt(_cfPopup.interval, 10)), // in days
		pages : $.trim(_cfPopup.pages) == '' ? [] : _cfPopup.pages.split(','),
		categories : $.trim(_cfPopup.categories) == '' ? [] : _cfPopup.categories.split(','),
		postTypes : $.trim(_cfPopup.postTypes) == '' ? [] : _cfPopup.postTypes.split(','),
		hiddenDiv : $('#js-cfpopup-content'),
		cookieName : 'cf_popup_shown',
		clickedAwayCookieName : 'cf_popup_clickedaway',
		debug : Math.abs(parseInt(_cfPopup.debug, 10)),
		doPopupOnLinkClick : Math.abs(parseInt(_cfPopup.popupOnLinkClick, 10)),
		domain : _cfPopup.domain,
		width : Math.abs(parseInt(_cfPopup.width, 10)),
		hasCookiePlugin : function() {
			return (typeof($.cookie) === 'function');
		},
		hasPopupCookie : function() {
			return ($.cookie(cfPopup.cookieName) === '1');
		},
		setPopupCookie : function() {
			$.cookie(
				cfPopup.cookieName,
				'1',
				{
					expires: cfPopup.interval,
					path: '/'
				}
			);
		},
		hasClickedAwayCookie : function() {
			return ($.cookie(cfPopup.clickedAwayCookieName) === '1');
		},
		setClickedAwayCookie : function() {
			$.cookie(
				cfPopup.clickedAwayCookieName,
				'1',
				{
					expires: cfPopup.interval,
					path: '/'
				}
			);
		},
		showPopup : function() {
			var options = {
				html : cfPopup.hiddenDiv.data('content'),
				overlayClose : false
			};
			if (cfPopup.width) {
				options.width = Math.abs(parseInt(cfPopup.width, 10));
			}
			$.colorbox(options);
		},
		maybeShowPopup : function() {
			if (!cfPopup.hasPopupCookie() || cfPopup.debug) {
				cfPopup.showPopup();
				cfPopup.setPopupCookie();
			}
		},
		showOnThisPage : function() {
			var r = false;

			// empty = show on all pages
			if (cfPopup.pages.length === 0
				&& cfPopup.categories.length === 0
				&& cfPopup.postTypes.length === 0
				) {
				return true;
			}

			if (cfPopup.pages.length > 0) {
				$.each(cfPopup.pages, function(index, val) {
					if ($('#post-' + val + ', .page-id-' + val).size()) {
						return (r = true);
					}
				});
			}
			if (cfPopup.categories.length > 0) {
				r = false; // if we have a value, we're requiring this check so reset to false
				var currentCats = cfPopup.hiddenDiv.data('categories');
				currentCats = currentCats.split(' ');
				$.each(cfPopup.categories, function(index, val) {
					if (currentCats.indexOf($.trim(val)) !== -1) {
						return (r = true);
					}
				});
			}
			if (cfPopup.postTypes.length > 0) {
				r = false; // if we have a value, we're requiring this check so reset to false
				var current = cfPopup.hiddenDiv.data('post-type');
				$.each(cfPopup.postTypes, function(index, val) {
					if ($.trim(current) == $.trim(val)) {
						return (r = true);
					}
				});
			}

			return r;
		},
		getWaitTime : function() {
			return cfPopup.waitTime;
		},
		getSecondaryWaitTime : function() {
			return cfPopup.secondaryWaitTime;
		},
		setTimer : function() {
			cfPopup.timer = window.setTimeout(
				cfPopup.maybeShowPopup,
				cfPopup.getWaitTime() * 1000
			);
		},
		setSecondaryTimer : function() {
			cfPopup.secondaryTimer = window.setTimeout(
				cfPopup.maybeShowPopup,
				cfPopup.getSecondaryWaitTime() * 1000
			);
		},
		attachClickedAwayEvents : function() {
			$(document).on('click', 'a', cfPopup.handleClickedAway);
		},
		handleClickedAway : function(e) {
			e.preventDefault();
			cfPopup.setClickedAwayCookie();
			document.location = $(this).attr('href');
		},
		init : function() {
			var n = cfPopup;
			if (!n.hasCookiePlugin() || n.showWhen == 'never' || !n.showOnThisPage()) {
				return;
			}

			if (n.showWhen == 'enter') {
				if (n.hasClickedAwayCookie()) {
					n.setSecondaryTimer();
				}
				else {
					n.setTimer();
					n.attachClickedAwayEvents();
				}
			}
			else if (n.showWhen == 'exit') {
				$(document).mouseleave(n.maybeShowPopup);
			}
			else if (n.showWhen == 'link_click') {
				$(document).one('click', 'a', function(e) {
					n.maybeShowPopup();
					e.preventDefault();
					return false;
				});
			}
		}
	};

	$(cfPopup.init());


})(jQuery);
