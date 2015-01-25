/* User Script "main.js" */
var vkAdv = {
		/* Системные константы */
		vkadv_ext_id: chrome.i18n.getMessage("@@extension_id"),
		top_player_id: 'audio_global',
		downloadButton_text: 'D',
		mv_share_class: '.mv_share_actions_wrap',
	
		/* Тут всякие html-шаблоны */
		settings_link: '<div id="vkAdv_settings"><a class="vkadv" href="#"><span class="fl_r thumb"></span>[ Настройки VK Adv ]</a></div>',
		advert_link: '<div class="sm_wrap"><div class="small">Реклама</div></div><li id="vk_AdvancedPublic"><a href="https://vk.com/public79105698" class="left_row"><span class="left_label inl_bl">Сообщество vkAdv</span></a></li>',
		video_download_btn: '<div class="idd_wrap mv_more fl_l" id="dw_wrap"><div id="dw_menu" class="idd_selected_value idd_arrow">Скачать</div></div>',
		video_download_popup: '<div style="margin-left: -10px; margin-top: 0; width: 151px; opacity: 0;" class="idd_popup" id="idd_mv_dw"><div id="idd_header_wrap"><div class="idd_header idd_arrow" id="_onDownload">Скачать</div> <div class="idd_items_wrap"><div class="idd_items_content" id="idd_items_dw"></div></div>',
		video_download_item: '<div class="idd_item vkadv_hvr_idd_item"><div class="idd_item_name">video_chlen</div></div>',
		
		/* Dialogs */
		vkAdv_box_html: '<div class="vkAdv_box" id="id_vkadv_box"><div id="id_vkadv_box_title_wrap" class="vkAdv_boxTitleWrap"><div id="id_vkadv_box_title_wrap2" class="vkAdv_boxTitleWrap2 clear_fix"><div id="id_vkadv_box_title" class="vkAdv_boxTitle fl_l"></div><div class="vkAdv_boxXButton fl_r" id="id_vkadv_box_x_button">Закрыть</div></div></div><div class="vkAdv_boxCotentWrap" id="vkadv_box_content_wrap"><div class="vkAdv_boxContent" id="vkadv_box_content"></div></div></div>',
		vkAdv_checkBox: '<div class="checkBoxControl_wrap clear_fix"><div class="checkBox_wrap fl_l"><span class="checkBox  clear_fix"><span class="chSlider"></span><span class="chState">Выкл.</span></span></div><div class="checkBoxLabel_wrap fl_l"><div class="checkBox_Label"></div></div></div>'
	}
	
function cancelEvent(event) {
	event = (event || window.event);
	if (!event) return false;
	while (event.originalEvent) event = event.originalEvent;
	if (event.preventDefault) event.preventDefault();
	if (event.stopPropagation) event.stopPropagation();
	event.cancelBubble = true;
	event.returnValue = false;
	return false;
	}
	
function rs(s) { return vkAdv_Settings.readSetting(s); }
function ss(p, v) { return vkAdv_Settings.saveSetting(p, v); }

function setDefault() {
	if (!rs('dw_audio')) ss('dw_audio', 'on');
	if (!rs('dw_video')) ss('dw_video', 'on');
	if (!rs('video_name_fmt')) ss('video_name_fmt', '{video} ({hd}).mp4');
	if (!rs('replike_text')) ss('replike_text', 'Мне нравится');
	if (!rs('bad_bitrate')) ss('bad_bitrate', '320');
	}

/* основное */
setInterval(function(){
	
	/* Ссылка на настройки */
	var profile_counts = $('#profile_counts') || {};
	if (profile_counts.length && !profile_counts.attr('chlen')) {
		profile_counts.attr({ chlen: 'vstal' });
		profile_counts.append(vkAdv.settings_link);
		var settings_link_obj = $('#vkAdv_settings');
		settings_link_obj.on('click', function(e) {
			cancelEvent(e);
			vkAdv_Settings.show_SettingsBox();
			});
		}
	
	/* Ссылка на сообщество */
	var sideBar = $('#side_bar').find('ol') || {};
	if (sideBar.length && !sideBar.attr('chlen')) {
		sideBar.attr({ chlen: 'vstal' });
		sideBar.append(vkAdv.advert_link);
		setDefault();
		}
	
	if (rs('dw_audio') == 'on') vkAdv_audio.audio_processing();
	if (rs('dw_video') == 'on') vkAdv_video.video_processing();
	if (rs('new_interface') == 'on') vkAdv_Visual.enableIncons();
	if (rs('replike') == 'on') vkAdv_Visual.repLike();
	if (rs('en_logo') == 'on') vkAdv_Visual.replaceVK_Logo();
	if (rs('audio_to_top') == 'on') vkAdv_Visual.audioTo_Top();
	
	}, 1000);