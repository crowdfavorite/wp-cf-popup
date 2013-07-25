// Custom newsletter Popup JS.
(function($){
	var newsletterPopup = {
		showWhen : _newsletterPopup.showWhen,
		interval : parseInt(_newsletterPopup.interval, 10), // in days
		pages : _newsletterPopup.pages,
		newsletterLinkSelector : '.js-newsletter-link',
		cookieName : _newsletterPopup.cookieName,
		debug : parseInt(_newsletterPopup.debug, 10),
		doPopupOnLinkClick : parseInt(_newsletterPopup.popupOnLinkClick, 10),
		domain : _newsletterPopup.domain,
		hasCookiePlugin : function() {
			return (typeof($.cookie) === 'function');
		},
		hasPopupCookie : function() {
			return ($.cookie(newsletterPopup.cookieName) === '1');
		},
		setPopupCookie : function() {
			$.cookie(newsletterPopup.cookieName, '1', { expires: newsletterPopup.interval, path: '/' });
		},
		showPopup : function() {
			// Currently depends on autothickbox plugin being active
			$(newsletterPopup.newsletterLinkSelector).first().click();
		},
		maybeShowPopup : function() {
			if (!newsletterPopup.hasPopupCookie() || newsletterPopup.debug) {
				newsletterPopup.showPopup();
				newsletterPopup.setPopupCookie();
			}
		},
		showOnThisPage : function() {
			// empty = show on all pages
			if (newsletterPopup.pages === '') {
				console.log('empty, so true');
				return true;
			}

			// Logic to check the page ID
			var pages = newsletterPopup.pages.split(','),
				r = false;
			$.each(pages, function(index, val) {
				if ($('#post-' + val).size()) {
					return (r = true);
				}
			});
			return r;
		}
	};

	$(function() {
		var n = newsletterPopup;
		if (!n.hasCookiePlugin() || n.showWhen == 'never' || !n.showOnThisPage()) {
			return;
		}

		if (n.showWhen == 'enter') {
			n.maybeShowPopup();
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
	});


})(jQuery);
