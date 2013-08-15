(function($) {
	cfPopupAdmin = {
		initProps : function() {
			cfPopupAdmin.wrapper = $('#wpbody-content');
			cfPopupAdmin.showWhenDropdown = $('#js_cf_popup_settings__show_when');
			cfPopupAdmin.waitTimeElems = $('#js_cf_popup_settings__wait_time, #js_cf_popup_settings__secondary_wait_time');
			cfPopupAdmin.hideOnNevers = $('.js_hide_on_never');
		},
		hideRows : function(elems) {
			elems.each(function(index) {
				$(this).parents('tr').first().hide();;
			});
		},
		showRows : function(elems) {
			elems.each(function(index) {
				$(this).parents('tr').first().show();;
			});
		},
		hideWaitTime : function() {
			cfPopupAdmin.hideRows(cfPopupAdmin.waitTimeElems);
		},
		showWaitTime : function() {
			cfPopupAdmin.showRows(cfPopupAdmin.waitTimeElems);
		},
		hideAllRemainingInputs : function() {
			cfPopupAdmin.hideRows(cfPopupAdmin.hideOnNevers);
		},
		showAllRemainingInputs : function() {
			cfPopupAdmin.showRows(cfPopupAdmin.hideOnNevers);
		},
		showHideElements : function() {
			switch (cfPopupAdmin.showWhenDropdown.val()) {
				case 'enter':
					cfPopupAdmin.showAllRemainingInputs();
					cfPopupAdmin.showWaitTime();
					break;
				case 'exit':
				case 'link_click':
					cfPopupAdmin.showAllRemainingInputs();
					cfPopupAdmin.hideWaitTime();
					break;
				case 'never':
					cfPopupAdmin.hideAllRemainingInputs();
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