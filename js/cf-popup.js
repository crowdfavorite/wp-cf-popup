(function($){
	// Don't run this on iOS. It appears to crash these devices running Mobile Safari currently.
	if (navigator.userAgent.match(/[\W]i(pad|phone|pod)[\W]/i)) {
	        return;
	}
	cfPopup = {
		showWhen : _cfPopup.showWhen,
		waitTime : _cfPopup.waitTime ? Math.abs(parseInt(_cfPopup.waitTime, 10)) : 0, // in seconds
		interval : Math.abs(parseInt(_cfPopup.interval, 10)), // in days
		pages : $.trim(_cfPopup.pages) == '' ? [] : _cfPopup.pages.split(','),
		categories : $.trim(_cfPopup.categories) == '' ? [] : _cfPopup.categories.split(','),
		postTypes : $.trim(_cfPopup.postTypes) == '' ? [] : _cfPopup.postTypes.split(','),
		hiddenDiv : $('#js-cfpopup-content'),
		cookieName : _cfPopup.cookieName,
		debug : Math.abs(parseInt(_cfPopup.debug, 10)),
		doPopupOnLinkClick : Math.abs(parseInt(_cfPopup.popupOnLinkClick, 10)),
		domain : _cfPopup.domain,
		hasCookiePlugin : function() {
			return (typeof($.cookie) === 'function');
		},
		hasPopupCookie : function() {
			return ($.cookie(cfPopup.cookieName) === '1');
		},
		setPopupCookie : function() {
			$.cookie(cfPopup.cookieName, '1', { expires: cfPopup.interval, path: '/' });
		},
		showPopup : function() {
			$.colorbox({
				html : cfPopup.hiddenDiv.data('content'),
				overlayClose : false
			});
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
		setTimer : function() {
			console.log(cfPopup.getWaitTime());
			cfPopup.timer = window.setTimeout(
				cfPopup.maybeShowPopup,
				cfPopup.getWaitTime() * 1000
			);
		},
		init : function() {
			var n = cfPopup;
			if (!n.hasCookiePlugin() || n.showWhen == 'never' || !n.showOnThisPage()) {
				return;
			}

			if (n.showWhen == 'enter') {
				n.setTimer();
			}
			else if (n.showWhen == 'exit') {
				$(document).mouseleave(n.maybeShowPopup);
			}

			if (n.doPopupOnLinkClick) {
				$(document).one('click', 'a[href*="' + n.domain + '"]', function(e) {
					n.maybeShowPopup();
					e.preventDefault();
					return false;
				});
			}
		}
	};

	$(cfPopup.init());


})(jQuery);
