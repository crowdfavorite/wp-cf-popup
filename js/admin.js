(function($) {
	cfPopupAdmin = {
		initProps : function() {
			cfPopupAdmin.wrapper = $('#wpbody-content');
			cfPopupAdmin.showWhenDropdown = $('#js_cf_popup_settings__show_when');
			cfPopupAdmin.waitTimeElem = $('#js_cf_popup_settings__wait_time');
		},
		hideWaitTime : function() {
			cfPopupAdmin.waitTimeElem.parents('tr').hide();
		},
		showWaitTime : function() {
			cfPopupAdmin.waitTimeElem.parents('tr').show();
		},
		showHideElements : function() {
			console.log(cfPopupAdmin.showWhenDropdown);
			console.log('changing: ' + cfPopupAdmin.showWhenDropdown.val());
			switch (cfPopupAdmin.showWhenDropdown.val()) {
				case 'enter':
					cfPopupAdmin.showWaitTime();
					break;
				default:
					cfPopupAdmin.hideWaitTime();
					break;
			}
		},
		init : function() {
			cfPopupAdmin.initProps();
			cfPopupAdmin.showHideElements();
			cfPopupAdmin.showWhenDropdown
				.on('change', cfPopupAdmin.showHideElements);
		}
	};
	$(cfPopupAdmin.init);
})(jQuery);