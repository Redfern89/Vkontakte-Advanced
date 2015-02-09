var vkAdv_Visual = {
	
	debug: false,
	
	load_css: function(css) {
		var h = $('head') || undefined;
		var _css = $('<link />', { rel: 'stylesheet', type: 'text/css', href: 'chrome-extension://' + vkAdv.vkadv_ext_id + '/css/'+css });
		h.prepend(_css);
		
		return _css;
		},
		
	addSideBar_Icon: function(elem, icon) {
		var icon = $('<i />', {
			'class': 'fa fa-'+icon,
			'id': 'vkadv_icon_'+icon
			});
		elem.prepend(icon);
		return icon;
		},
		
	repLike: function() {
		var like = $('.post_like_link, #pv_like_link, .like_link, .wl_post_like_label, .photo_like_post') || {};
		
		like.each(function(i) {
			var $like = $(this) || undefined;
			if (!$like.attr('chlen')) {
				$like.attr({ chlen: 'vstal' });
				$like.html(vkAdv_Settings.readSetting('replike_text'));
				}
			});
		},
		
	replaceVK_Logo: function() {
		var vk_logo = $('#page_header').find('.left') || null;
		var top_logo_down = $('#top_logo_down') || null;

		if (vk_logo && !vk_logo.attr('chlen')) {
			top_logo_down.attr({
				'style' : "background: #4e729a url('chrome-extension://"+vkAdv.vkadv_ext_id+"/images/hatf_vk.gif') -4px 0"
				});
			vk_logo.attr({
				'style' : "background: #4e729a url('chrome-extension://"+vkAdv.vkadv_ext_id+"/images/hatf_vk.gif') 0 -1px",
				'chlen' : 'vstal'
				});
			}
		},
		
	audioTo_Top: function() {
		var profile_audios = $('#profile_audios') || null;
		var photos_module = document.getElementsByClassName('photos_module')[0];
		
		if (profile_audios && !profile_audios.attr('chlen')) {
			var wide_column = $('.wide_column') || null;
			if (photos_module) {
				profile_audios.insertAfter($('.photos_module'));
				} else {
					profile_audios.insertAfter($('#profile_full_info'));
					}
			
			profile_audios.attr({ chlen: "vstal" });
			}		
		},
		
	blockAdv: function() {
		var ads = $('#left_ads');
		ads.remove();
		},
		
	enableIncons: function() {
		var h = $('head') || null;
		var pl = $('#page_layout') || null;
		var pb_w = parseInt($('#page_body').css( 'width' ));
		var sb_w = 154;
		var sb = $('#side_bar') || null;
		var incWidth = 19;

		/* "#page_layout" WIDTH bug fix !!!!! */
		if (!pl.attr('chlen')) {
			var new_page_width = sb_w + pb_w + incWidth;
			pl.css({ 'width' : new_page_width });
			pl.attr({ chlen: "vstal" });
			if (vkAdv.debug) console.log('VKADV_visual :: new_page_width='+new_page_width);
			}
				
		
		if (h && !h.attr('chlen')) {
			vkAdv_Visual.load_css('vkadv_iface.css');
			vkAdv_Visual.load_css('font-awesome.css');
			
			h.attr({ chlen: "vstal" });
				
			$('#side_bar').find('a').each(function() {
				var id = $(this).attr('id');
				var hr = $(this).attr('href');
				
				/* Знаю, по-идиотски, но умнее влом было придумывать */
				if (id == 'myprofile') vkAdv_Visual.addSideBar_Icon($(this), 'user');
				if ($(this).parent().attr('id') == 'l_fr') vkAdv_Visual.addSideBar_Icon($(this), 'star');
				if ($(this).parent().attr('id') == 'l_ph') vkAdv_Visual.addSideBar_Icon($(this), 'camera');
				if ($(this).parent().attr('id') == 'l_vid') vkAdv_Visual.addSideBar_Icon($(this), 'film');
				if ($(this).attr('href').indexOf('audios') != -1) vkAdv_Visual.addSideBar_Icon($(this), 'music');
				if ($(this).parent().attr('id') == 'l_msg') vkAdv_Visual.addSideBar_Icon($(this), 'envelope-o');
				if ($(this).parent().attr('id') == 'l_gr') vkAdv_Visual.addSideBar_Icon($(this), 'cubes');
				if ($(this).parent().attr('id') == 'l_nwsf') vkAdv_Visual.addSideBar_Icon($(this), 'comment');
				if ($(this).parent().attr('id') == 'l_nws') vkAdv_Visual.addSideBar_Icon($(this), 'comments-o');
				if ($(this).attr('href').indexOf('fave') != -1) vkAdv_Visual.addSideBar_Icon($(this), 'database');
				if ($(this).parent().attr('id') == 'l_set') vkAdv_Visual.addSideBar_Icon($(this), 'wrench');
				if ($(this).parent().attr('id') == 'l_ap') vkAdv_Visual.addSideBar_Icon($(this), 'futbol-o');
				if ($(this).attr('href').indexOf('docs') != -1) vkAdv_Visual.addSideBar_Icon($(this), 'cloud');
				if ($(this).parent().attr('id') == 'l_ads') vkAdv_Visual.addSideBar_Icon($(this), 'crop');
				});
			}
		}
	}