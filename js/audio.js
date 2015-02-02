var vkAdv_audio = {
	
	/* Из hh:mm:ss в SSSSS */
	time2seconds: function(arr) {
		if (arr.length == 1) return parseInt(arr[1]);
		if (arr.length == 2) return (parseInt(arr[0]) * 60) + parseInt(arr[1]);
		if (arr.length == 2) return (parseInt(arr[0]) * 3600) + (parseInt(arr[2]) * 60) + parseInt(arr[3]);
		},
		
	/* Добавляем ссылку на скачивание */
	add_download_link: function(post, mp3_url, name_track) {
		// play_btn_wrap set new Padding
		var play_btn_wrap = $('.play_btn_wrap') || {};
		
		if (play_btn_wrap.length) {
			switch (play_btn_wrap.parent()[0].tagName) {
				case 'DIV':
					play_btn_wrap.css({ padding: "9px 5px 9px 9px" });
					break;
				case 'TD':
					play_btn_wrap.css({ padding: "6px 5px 6px 6px" });
					break;
				}
			}
			
		if (post.length) {
			var title_wrap = post.find('.title_wrap');
			var dwButton = $('<a />', {
				'class': 'download_button fl_l',
				'html': vkAdv.downloadButton_text,
				'onclick': 'event.cancelBubble = true;',
				'href': mp3_url,
				'download': name_track,
				}).prependTo(title_wrap);
				
			var JS = [];
			JS.push({ 'url': mp3_url, 'name': name_track });
			dwButton.on("click", function(e) {
				cancelEvent(e);
				chrome.runtime.sendMessage({
					action: 'download_file',
					data: JSON.stringify(JS)
					});
				});			
			}
		},
	
	add_bitrate_label: function(post, kbps) {
		if (post.length) {
			var title_wrap = post.find('.title_wrap');
			var bLabel = $('<div />', {
				'class': 'bitrate fl_l',
				'html': kbps,
				}).prependTo(title_wrap);
			
			if (vkAdv_Settings.readSetting('show_size_on_hover') == 'on') {
				bLabel.on('mouseenter', function(e) {
					var size = post.attr('size');
					$(this).text(vkAdv.formatBytes(size));
					});
				bLabel.on('mouseleave', function(e) {
					var kbps = post.attr('bitrate');
					$(this).text(kbps);
					});
				}
			}
		},
		
	/* Обрабатываем битрейт */
	calc_bitrate: function(size, duration) {
		var kbps = Math.ceil(Math.round((size / 128) / duration) / 16) * 16; // ololo
		
		if ((kbps >= 288)) kbps = 320; else
		if ((kbps >= 224) && (kbps < 288)) kbps = 256; else
		if ((kbps >= 176) && (kbps < 224)) kbps = 192; else
		if ((kbps >= 144) && (kbps < 176)) kbps = 160; else
		if ((kbps >= 112) && (kbps < 144)) kbps = 128; else
		if ((kbps >= 80) && (kbps < 112))kbps = 96; else
		if ((kbps >= 48) && (kbps < 80)) kbps = 64; else
		if ((kbps >= 20) && (kbps < 48)) kbps = 32;
		
		return kbps;
		},
		
	remove_bad_bitrate: function() {
		var audio = $('.audio') || undefined;
		var is_search = top.location.href.indexOf('q=');
		
		if (audio.length) {
			audio.each(function(i) {
				var $audio = $(this) || undefined;
				var cur_bitrate = parseInt($audio.attr('bitrate'));
				var bad_bitrate = parseInt(vkAdv_Settings.readSetting('bad_bitrate'));
				
				if ((is_search != -1) && (bad_bitrate > cur_bitrate)) {
					console.log('VK Advanced :: ( post #' + $audio.attr('id') + ' removed, bitrate=' + cur_bitrate + ')');
					$audio.remove();
					}
				});
			}
		},
	
	strict_search: function() {
		var s_search = $('#s_search').val();
		var audio = $('.audio') || undefined;
		var is_search = top.location.href.indexOf('q=');
		
		if (audio.length) {
			audio.each(function(i) {
				$audio = $(this) || undefined;
				var author = $.trim($audio.find('b').find('a').text());
				
				/* Жесть, условие */
				if ((is_search != -1) && (author != s_search) && ($audio.attr('chlen') == 'vstal')) {
					$audio.remove();
					console.log('current="'+author+'", is="'+s_search+'", id: "'+$audio.attr('id') + '"');
					}
				});
			}
		},
	
	/* Обработка аудиозаписей везде, где только можно */
	audio_processing: function() {
		
		var audio = $('.audio') || {};
		if (audio.length) {
			audio.each(function(i) {
				var $audio = $(this) || undefined;
				if (!$audio.attr('chlen') && $audio.attr('id') != vkAdv.top_player_id) {
					// Собираем всевозможную инфу
					var audio_id = $audio.attr('id').replace(/audio/g, '');
					var mp3_url = $audio.find('input[type="hidden"]#audio_info'+audio_id).attr('value');
					var dur_Arr = $audio.find('div.duration').text();
					var duration = vkAdv_audio.time2seconds(dur_Arr.split(':'));
					var author = $.trim($audio.find('b').find('a').text());
					var title = $.trim($audio.find('span.title').text());
					
					// Проверки на правильность
					var name_track = 'audio' + audio_id + '.mp3';
					if (author) {
						if (title) name_track = author + ' - ' + title + '.mp3';
						if (!title) name_track = author + '.mp3';
						}
					if (name_track) name_track = name_track.replace(/[|:*?<>/\\\"\']/g, '');
				
				if (vkAdv_Settings.readSetting('show_bitrate') == 'on') {
					if (mp3_url && name_track) {
						var aj = $.ajax({
							type: "HEAD",
							async: true,
							url: mp3_url,
							success: function(message) {
								var size = aj.getResponseHeader('Content-Length');
								var kbps = vkAdv_audio.calc_bitrate(size, duration);

								$audio.find('.bitrate').text(kbps);
								$audio.attr({ bitrate: kbps, size: size });
								
								// Знаю, по идиотски, но умнее влом было придумывать
								if (kbps == '320') $audio.find('.bitrate').css({ opacity: '1' });
								if (kbps == '256') $audio.find('.bitrate').css({ opacity: '0.9' });
								if (kbps == '192') $audio.find('.bitrate').css({ opacity: '0.8' });
								if (kbps == '160') $audio.find('.bitrate').css({ opacity: '0.7' });
								if (kbps == '128') $audio.find('.bitrate').css({ opacity: '0.6' });
								if (kbps == '96') $audio.find('.bitrate').css({ opacity: '0.5' });
								if (kbps == '64') $audio.find('.bitrate').css({ opacity: '0.4' });
								if (kbps <= '32') $audio.find('.bitrate').css({ opacity: '0.3' });
								
								if (vkAdv_Settings.readSetting('remove_bad_bitrate') == 'on')
									vkAdv_audio.remove_bad_bitrate($audio);
								
								},
							error: function(errorMessage) {
								$audio.find('.bitrate').addClass('err').text('error');
								$audio.attr({ bitrate: 'error', size: 'error' });
								}
							});
						}
					
					vkAdv_audio.add_bitrate_label($audio, 'load');
					}
					vkAdv_audio.add_download_link($audio, mp3_url, name_track);
					
					$audio.attr({ chlen: 'vstal' });
					}
				});
			}
		
		}
	
	}