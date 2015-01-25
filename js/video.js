var vkAdv_video = {
	
	/* Ебля с плясками... Попытаемся раскодировать flashvars */
	decode_flashVars: function(fl) {
		var fl_Obj = {},
			data = fl.split('&');
			
		for (var i = 0; i < data.length; i++) {
			var s = data[i];
			var param = s.substr(0, s.indexOf('=', 0));
			var val = s.substr(s.indexOf('=', 0) +1, s.length);
			
			fl_Obj[param] = decodeURIComponent(val);
			}
		return fl_Obj;
		},
	
	/* Добавляем ссылку на скачивание видео */
	add_video_link: function( elem, name, download, link ) {
		if (elem) {
			var item = vkAdv.video_download_item.replace(/video_chlen/g, name);
			var div = $('<div />').on("click", function(e) {
					cancelEvent(event);
					var JS = [];
					JS.push({ url: link, name: download });
					chrome.runtime.sendMessage({
						action: "download_file", data: JSON.stringify(JS)
						});
					}).html(item).appendTo(elem);
			}
		},
	
	/* Тут обрабатываем видеозапись в момент ее открытия */
	video_processing: function() {
		var mv_actions = $(vkAdv.mv_share_class) || {};
		if (mv_actions.length && !mv_actions.attr('chlen')) {
			mv_actions.attr({ chlen: 'vstal' });
			
			var embed = $('embed#video_player') || {};
			if (embed.length) var flashVars_str = embed.attr('flashvars');
			
			var flashVars_obj = vkAdv_video.decode_flashVars(flashVars_str);
			
			// Теперь видео точно найдено и оно не со стороннего источника..
			if (flashVars_str && flashVars_obj.md_title) {
				// Придется снова достать бубен и продолжать
				// Добавляем меню на загрузку
				mv_actions.append(vkAdv.video_download_btn);
				mv_actions.find('#dw_wrap').append(vkAdv.video_download_popup);
				
				// Пытаемся обработать появление и скрытие менюшки
				var dwMenu_obj = mv_actions.find('#dw_menu');
				var dwPopup_obj = mv_actions.find('#idd_mv_dw');
				
				dwMenu_obj.on('mouseenter', function() {
					$('#idd_mv_dw').css({opacity: '1', 'margin-top': '-19px'});
					});
				dwPopup_obj.on('mouseleave', function() {
					$('#idd_mv_dw').css({opacity: '0', 'margin-top': '0'});
					});	
					
				// Прочая хуета
				var title = flashVars_obj.md_title.replace(/[|:*?<>/\\\"\']/g, '');
				var post = mv_actions.find('#idd_items_dw');
				
				// Добавляем доступные видеозаписи в меню загрузки
				if (flashVars_obj.url240) vkAdv_video.add_video_link(post, 'Скачать видео 240.mp4', title + ' (240).mp4', flashVars_obj.url240); 
				if (flashVars_obj.url360) vkAdv_video.add_video_link(post, 'Скачать видео 360.mp4', title + ' (360).mp4', flashVars_obj.url360);
				if (flashVars_obj.url480) vkAdv_video.add_video_link(post, 'Скачать видео 480.mp4', title + ' (480).mp4', flashVars_obj.url480);
				if (flashVars_obj.url720) vkAdv_video.add_video_link(post, 'Скачать видео 720.mp4', title + ' (720).mp4', flashVars_obj.url720);
				} else {
					// Тут если видео с постороннего источника...
					// В скором времени может и появится )))
					}
			} 
		}
	
	}