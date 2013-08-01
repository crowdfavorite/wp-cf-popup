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
		hideAllRemainingInputs : function() {
			$('.js_hide_on_never').parents('tr').hide();
		},
		showAllRemainingInputs : function() {
			$('.js_hide_on_never').parents('tr').show();
		},
		showHideElements : function() {
			console.log(cfPopupAdmin.showWhenDropdown);
			console.log('changing: ' + cfPopupAdmin.showWhenDropdown.val());
			switch (cfPopupAdmin.showWhenDropdown.val()) {
				case 'enter':
					cfPopupAdmin.showAllRemainingInputs();
					cfPopupAdmin.showWaitTime();
					break;
				case 'never':
					cfPopupAdmin.hideAllRemainingInputs();
					break;
				case 'exit':
					cfPopupAdmin.showAllRemainingInputs();
					cfPopupAdmin.hideWaitTime();
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