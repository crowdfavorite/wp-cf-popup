<?php

/**
 * Dependent on the autothickbox plugin being active.  This allows customized
 * settings under "Newsletter Popup" for logic on when to show this popup.
 */

class PPA_Newsletter_Popup {
	static $i = null;
	public static function i() {
		if (self::$i == null) {
			self::$i = new PPA_Newsletter_Popup;
		}
		return self::$i;
	}

	public function add_actions() {
		add_action('wp_head', array($this, 'get_assets'));
		add_action('wp_footer', array($this, 'output_hidden_popup_content'));

		add_action('admin_menu', array($this, 'register_settings_page'));
		add_action('admin_init', array($this, 'settings_init'));
	}
	public function get_assets() {
		wp_register_script(
			'cookie',
			get_template_directory_uri() . '/js/cookie.js',
			array('jquery'),
			'1.3.1'
		);
		wp_enqueue_script(
			'ppa-popup',
			get_template_directory_uri() . '/plugins/ppa-newsletter-popup/ppa-popup.js',
			array('jquery', 'cookie'),
			CFCT_URL_VERSION
		);
		wp_localize_script(
			'ppa-popup',
			'_newsletterPopup',
			array(
				'showWhen' => $this->get_setting('show_when'),
				'interval' => $this->get_setting('interval'),
				'cookieName' => $this->get_setting('cookie_name'),
				'debug' => $this->get_setting('debug'),
				'pages' => $this->get_setting('pages'),
				'popupOnLinkClick' => $this->get_setting('on_link_click'),
				'domain' => home_url(),
			)
		);
	}
	public function get_settings() {
		return (array) get_option('newsletter_popup_settings');
	}
	public function get_setting($key) {
		$settings = $this->get_settings();
		$val = '';
		if (!empty($settings[$key])) {
			$val = $settings[$key];
		}
		return $val;
	}

	public function register_settings_page() {
		//create new top-level menu
		add_submenu_page(
			'options-general.php',
			__('Newsletter Popup Settings', 'ppa'),
			__('Newsletter Popup', 'ppa'),
			'manage_options',
			'ppa_newsletter_settings_page',
			array($this, 'output_settings_page')
		);
	}
	public function output_settings_page() {
		?>
		<div class="wrap">
			<?php screen_icon('options-general'); ?>
			<h2><?php _e('Newsletter Popup Settings', 'ppa'); ?></h2>

			<form method="post" action="options.php">
				<?php settings_fields('ppa_newsletter_settings_page'); ?>
				<?php do_settings_sections('ppa_newsletter_settings_page'); ?>
				<?php submit_button(); ?>
			</form>

		</div><!-- /wrap -->
		<?php
	}
	public function settings_init() {
		$settings_page = 'ppa_newsletter_settings_page';
		$settings_section = 'newsletter_popup_settings';
		add_settings_section(
			$settings_section,
			__('Newsletter Popup Settings', 'ppa'),
			array($this, 'settings_section_intro'),
			$settings_page
		);

		add_settings_field(
			'newsletter_popup_when_settings', // actual option name
			__('Show Popup When?', 'ppa'),
			array($this, 'show_popup_when_field'),
			$settings_page,
			$settings_section
		);
		add_settings_field(
			'newsletter_popup_content_settings', // actual option name
			__('Popup Content', 'ppa'),
			array($this, 'show_popup_content_field'),
			$settings_page,
			$settings_section
		);
		add_settings_field(
			'newsletter_popup_interval_settings', // actual option name
			__('Popup Interval', 'ppa'),
			array($this, 'show_popup_interval_field'),
			$settings_page,
			$settings_section
		);
		add_settings_field(
			'newsletter_popup_page_settings', // actual option name
			__('Popup Page(s)', 'ppa'),
			array($this, 'show_popup_page_field'),
			$settings_page,
			$settings_section
		);
		add_settings_field(
			'newsletter_popup_cookie_settings', // actual option name
			__('Cookie Name', 'ppa'),
			array($this, 'show_popup_cookie_field'),
			$settings_page,
			$settings_section
		);
		add_settings_field(
			'newsletter_popup_on_link_click_settings', // actual option name
			__('Show on Link Click', 'ppa'),
			array($this, 'show_popup_onlinkclick_field'),
			$settings_page,
			$settings_section
		);
		add_settings_field(
			'newsletter_popup_debug_settings', // actual option name
			__('Debug', 'ppa'),
			array($this, 'show_popup_debug_field'),
			$settings_page,
			$settings_section
		);
		register_setting(
			$settings_page,
			'newsletter_popup_settings',
			array($this, 'sanitize_settings')
		);
	}
	public function settings_section_intro() {
		?>
		<p>Various settings for the Newsletter Popup.</p>
		<?php
	}
	public function show_popup_when_field() {
		$options = array(
			'never' => 'Never (i.e., Turn Off)',
			'enter' => 'On Enter',
			'exit' => 'On Exit',
		);
		$settings = $this->get_settings();
		$show_when = 'never';
		if (!empty($settings['show_when']) && in_array($settings['show_when'], array_keys($options))) {
			$show_when = $settings['show_when'];
		}
		?>
		<select name="newsletter_popup_settings[show_when]">
			<?php
			foreach ($options as $val => $friendly) {
				?>
				<option value="<?php echo esc_attr($val); ?>"<?php selected($show_when, $val); ?>><?php echo esc_html($friendly); ?></option>
				<?php
			}
			?>
		</select>
		<?php
	}
	public function show_popup_content_field() {
		$settings = $this->get_settings();
		$content = '';
		if (!empty($settings['content'])) {
			$content = $settings['content'];
		}
		?>
		<textarea name="newsletter_popup_settings[content]" style="width: 500px; height: 200px;"><?php echo esc_textarea($content); ?></textarea>
		<?php
	}
	public function show_popup_interval_field() {
		$settings = $this->get_settings();
		$interval = 1;
		if (!empty($settings['interval'])) {
			$interval = $settings['interval'];
		}
		?>
		<input name="newsletter_popup_settings[interval]" value="<?php echo esc_attr($interval); ?>"> <?php echo _n('Day', 'Days', $interval, 'ppa'); ?>
		<p class="help">Number of days between someone seeing the popup again.</p>
		<?php
	}
	public function show_popup_page_field() {
		$pages = $this->get_setting('pages');
		?>
		<input name="newsletter_popup_settings[pages]" value="<?php echo esc_attr($pages); ?>" type="text" placeholder="all" />
		<p class="help">Page IDs separated by comma.  Leave empty for all pages.</p>
		<?php
	}
	public function show_popup_cookie_field() {
		$settings = $this->get_settings();
		$cookie_name = 'newsletter_popup';
		if (!empty($settings['cookie_name'])) {
			$cookie_name = $settings['cookie_name'];
		}
		?>
		<input name="newsletter_popup_settings[cookie_name]" value="<?php echo esc_attr($cookie_name); ?>">
		<?php
	}
	public function show_popup_onlinkclick_field() {
		$$on_link_click = $this->get_setting('on_link_click');
		?>
		<input type="checkbox" name="newsletter_popup_settings[on_link_click]" id="newsletter_popup_settings_onlinkclick" value="1"<?php checked(1, $$on_link_click); ?> /> <label for="newsletter_popup_settings_onlinkclick">Display on any PPA link click?</label>
		<p class="help">Displays the popup when a visitor clicks a link within the theppa.org domain.</p>
		<?php
	}
	public function show_popup_debug_field() {
		$debug = $this->get_setting('debug');
		?>
		<input type="checkbox" name="newsletter_popup_settings[debug]" id="newsletter_popup_settings_debug" value="1"<?php checked(1, $debug); ?> /> <label for="newsletter_popup_settings_debug">Debug?</label>
		<p class="help">Ignore the cookie entirely, and show popup at each interaction</p>
		<?php
	}
	public function sanitize_settings($settings) {
		// Pages
		$pages = $settings['pages'];
		if (!empty($pages)) {
			$_pages = explode(',', $pages);
			$_pages = array_filter(array_map('intval', $_pages));
			$pages = implode(',', $_pages);
			$settings['pages'] = $pages;
		}
		return $settings;
	}
	public function output_hidden_popup_content() {
		?>
		<div id="hiddenModalContent" style="display:none">
			<?php echo $this->get_setting('content'); ?>
		</div>
		<?php
	}
}
PPA_Newsletter_Popup::i()->add_actions();
