(function($) {
	cfPopupAdmin = {
		initProps : function() {
			cfPopupAdmin.wrapper = $('#wpbody-content');
			cfPopupAdmin.showWhenDropdown = $('#js_cf_popup_settings__show_when');
			cfPopupAdmin.waitTimeElems = $('#js_cf_popup_settings__wait_time, #js_cf_popup_settings__secondary_wait_time');
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
			cfPopupAdmin.hideRows($('.js_hide_on_never'));
		},
		showAllRemainingInputs : function() {
			cfPopupAdmin.showRows($('.js_hide_on_never'));
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