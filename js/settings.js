/*
	Это ебучий модуль настроек....Чует моя жопа, долго я с тобой проебусь..
	и тааааак, понеслась!
*/
var vkAdv_Settings = {
	
	saveSetting: function(param, val) {
		localStorage[param] = val;
		},
	
	readSetting: function(param) {
		return localStorage[param];
		},
	
	showBox: function(options, content, dark) {
		var defaults = {
			title: false,
			width: 410,
			height: 185,
			dark: false,
			buttons: {}
			};
		
		$.extend(defaults, options);
		if (dark) { options.dark = 1; }
		
		/* Глобальные параметры */
		var buttonsCount = 0,
			boxContainerWrap, boxBG, boxLayout;
		var boxTitleWrap, boxTitle, boxCloseButton, boxBody;
		var boxControlsWrap, boxControls, boxButtons, boxControlsText;
		var pageBody, darkBG;
		
		/* Снова достаем бубен */
		boxContainerWrap = $('<div />', {
			'class': 'vkAdv_boxContainerWrap',
			'id': 'vkAdv_box',
			}).css({
				width: options.width,
				height: options.height +33
				});
		boxContainerWrap.html(vkAdv.vkAdv_box_html);
		
		// представляем каждый элемент в виде объекта jQuery
		boxTitleWrap = boxContainerWrap.find('#id_vkadv_box_title_wrap');
		boxTitle = boxContainerWrap.find('#id_vkadv_box_title');
		boxBody = boxContainerWrap.find('#vkadv_box_content');
		boxCloseButton = boxContainerWrap.find('#id_vkadv_box_x_button');
		pageBody = $('body');
		
		// Задаем параметры
		boxBody.css({ height: options.height });
		boxTitle.text(options.title);
		
		if (options.dark)
			pageBody.css({ 'overflow-y': 'hidden' });
		
		// Переопределим положение окна по ширине и высоте документа по отношению к самому окну
		var pageBody_height = $( window ).height();
		var pageBody_width = $(window).width();
		var newLeft = ((pageBody_width / 2) - (boxContainerWrap.width() / 2));
		var newTop = ((pageBody_height / 2) - (boxContainerWrap.height() / 2));
		boxContainerWrap.css({ left: newLeft, top: newTop });
		
		// Темный фон сзади
		darkBG = $('<div />', {
			left: 0,
			top: 0,
			width: pageBody_width,
			height: pageBody_height
			}).css({
				position: 'fixed',
				left: 0,
				top: 0,
				background: '#000',
				opacity: '0.3',
				'z-index': '9998'
				});		
		
		// по нажатию на фон, зкрываем окно настроек
		darkBG.on('click', function(e) {
			if (options.dark)
				pageBody.css({ 'overflow-y': 'scroll' });
			
			boxContainerWrap.remove();
			$(this).remove();
			});
		
		// тоже самое при нажатии на кнопку "закрыть"
		boxCloseButton.on('click', function(e) {
			if (options.dark)
				pageBody.css({ 'overflow-y': 'scroll' });
			
			boxContainerWrap.remove();
			darkBG.remove();
			});

		if (dark) pageBody.append(darkBG);

		boxBody.html(content);

		// Вставим окно в тело документа
		pageBody.append(boxContainerWrap);

		},

	createSettings_Tabs: function(id) {
		var ul = $('<ul />', {
			'class': 'vkAdv_SettingsTabs clear_fix',
			'id': 'vkadv_settings_tabs'+id
			});

		return ul;
		},

	createSettings_Tab: function(ul, id, name, active) {
		// Создаем саму вкладку
		var a = $('<a />', {
			'class': 'vkAdv_SettingsLink',
			'id': 'vkadv_settings_link',
			'href': '#'
			}).text(name);

		if (active) a.addClass('active');

		var li = $('<li />', {
			'class': 'vkAdv_SettingsTab',
			'id': 'vkadv_settings_tab'+id
			}).append(a);

		ul.append(li);

		// создаем контент под нее
		var content = $('<div />', {
			'class': 'vkAdv_SettingsContent',
			'id': 'vkadv_settings_content'+id
			});
		if (active) content.show();

		$('#vkadv_box_content').append(content);
			
		a.on('click', function(e) {
			$('.vkAdv_SettingsLink').removeClass('active');
			$(this).addClass('active');
			
			$('.vkAdv_SettingsContent').hide();
			content.show();
			
			cancelEvent(e);
			});
		
		return content;
		},
	
	/* Ебучие блять костыли идите в жопу */
	forceContents: function(tabs) {
		var contents = $('<div />');
		for (var i=0; i < tabs.length; i++) {
			var tab = tabs[i];
			contents.append(tab);
			}
		return contents;
		},
		
	createSettings_Header: function(tab, id, text) {
		var header = $('<div />', {
			'class': 'vkAdv_SettingsHeader',
			'id': 'vkadv_settings_header'+id
			}).html(text);
		
		tab.append(header);
		
		return header;
		},
		
	createSettings_CheckBox: function(id, setting, label) {
		var checkbox = $('<div />', {
			'class': 'checkBox_row',
			'id': 'checkbox'+id
			});
		checkbox.append(vkAdv.vkAdv_checkBox);
		
		var $label = checkbox.find('.checkBox_Label');
		var $check = checkbox.find('.checkBox');
		var $state = checkbox.find('.chState');
		
		var val = vkAdv_Settings.readSetting(setting);
		if (val == 'on') {
			$check.addClass('on');
			$state.text('Вкл.');
			}
		
		checkbox.on('click', function(e) {
			$check.toggleClass('on');
			if ($check.hasClass('on')) {
				vkAdv_Settings.saveSetting(setting, 'on');
				$state.text('Вкл.');
				} else {
					vkAdv_Settings.saveSetting(setting, 'off');
					$state.text('Выкл.');
					}
			});
			
		$label.text(label);
		
		return checkbox;
		},
		
	createSettings_title: function(tab, id, name) {
		var inner = '<div class="vkAdv_SettingsTitle">'+name+'</div>';
		var sTitle = $('<div />', {
			'class': 'vkAdv_SettingsTitle_Wrap',
			'id': 'vkadv_settings_title_wrap'+id
			}).append(inner);
		
		tab.append(sTitle);
		
		return sTitle;
		},
		
	/* EPIC WIN!!!! */
	createSettings_Group: function(tab, cells, id, objects) {
		var row = 0, cell = 0;
		var table = $('<table />', { 'class': 'vkAdv_SettingsTable', 'id': 'vkadv_settings_table'+id });
		var rows_count = Math.ceil(objects.length / cells);
		var cell_width = Math.round((100 / cells)) + '%';
		var obj_len = objects.length;
		
		for (var i = 0; i < rows_count; i++) {
			row++;
			var tr = $('<tr />', { 'id': 'vkadv_row'+id+'_'+row });
			for (var k = 0; k < cells; k++) {
				cell++;	
				var td = $('<td />', { 'width': cell_width, 'id': 'vkadv_cell'+id+'_'+cell });
				td.append(objects[cell -1]);
				tr.append(td);
				}
			table.append(tr);
			}
		
		tab.append(table);		
		return table;
		},
	
	createSettings_Edit: function(id, options, setting, label) {
		var defaults = {
			width: 200,
			numberOnly: false,
			minValue: 0,
			maxValue: 32655,
			defVal: 10
			};
		$.extend(defaults, options);
		
		var inner = '<label for="edit'+id+'">'+label+'</label><input type="text" id="edit'+id+'" />';
		var wrap = $('<div />', {
			'class': 'vkAdv_Settings_Wrap',
			'id': 'vkadv_settings_edit_wrap'+id
			});
		wrap.append(inner);
		
		var validNuber;
		var edit_input = wrap.find('input#edit'+id);
		var val = edit_input.val() || undefined;
		 if (options.numberOnly) {
			edit_input.ForceNumericOnly(); 
			if (val) {
				var numberVal = parseInt(val);
				if (numberVal > options.maxValue || numberVal < options.value) validNuber = true;
				if (!numberVal) numberVal = options.defVal;
				}
			}
		
		edit_input.css({ width: options.width });
		edit_input.keyup(function(e) {
			if (!options.numberOnly)
				vkAdv_Settings.saveSetting(setting, $(this).val());			
			if (options.numberOnly && validNuber)
				vkAdv_Settings.saveSetting(setting, numberVal);
			});
		edit_input.val(vkAdv_Settings.readSetting(setting));
		
		return wrap;
		},
		
	createSettings_AudioPreeview: function(id, options, label) {
		var defaults = {
			sound: null
			};
		var player_wrap = $('<div />', {
			'class': 'vkAdv_SettingsPlayerWrap clear_fix',
			'id': 'vkadv_settings_player_wrap'+id
			});
		var tpl = '<div class="vkAdv_SettingsPlayBtn"></div><div class="vkAdv_SettingsPlayerLabel" id="player_label'+id+'"></div>';
		player_wrap.append(tpl);
		var $label = player_wrap.find('#player_label'+id);
		$label.text(label);
		var theme = vkAdv_Settings.readSetting('vkadv_sounds');
		
		player_wrap.on('click', function(e) {
			$this = $(this) || undefined;
			$this.jWebAudio('addSoundSource', {
				'url': '',
				'preLoad': true,
				'callback': function() {
					player_wrap.jWebAudio('play');
					}
				});
			});

		return player_wrap;
		},
		
	createSettings_ComboBox: function(id, options, items, setting, label) {
		var defaults = {
			width: 200
			};
		$.extend(defaults, options);

		var inner = '<label for="select'+id+'">'+label+'</label><select id="select'+id+'"></select>';
		var wrap = $('<div />', {
			'class': 'vkAdv_Settings_Wrap',
			'id': 'vkadv_settings_combobox_wrap'+id
			});

		wrap.append(inner);

		var select = wrap.find('select#select'+id);
		select.css({ width: options.width });

		select.on('change', function() {
			vkAdv_Settings.saveSetting(setting, $(this).val());
			});

		var val = vkAdv_Settings.readSetting(setting);

		for (var i=0; i < items.length; i++) {
			var item = items[i];
			var option = $('<option />');
			if (val == item) option.attr({ selected: '' });
			option.text(item);
			select.append(option);
			};

		return wrap;
		},
		
	createSettings_Text: function(tab, id, params, text) {
		var defaults = {
			appendToTab: true
			};
		$.extend(defaults, params);
		
		var wrap = $('<div />', {
			'class': 'vkAdv_SettingsTextWrap',
			'id': 'vkadv_settings_text_wrap'+id
			});
			
		wrap.html(text);
		
		if (params.appendToTab) tab.append(wrap);
		
		return wrap;
		},
		
	createSettings_Link: function(tab, id, params, name) {
		var defaults = {
			triggerClcik: false,
			blockButton: false,
			href: '#'
			};
			
		$.extend(defaults, params);
		
		var a = $('<a />', {
			'class': 'vkAdv_SettingsLink',
			'id': 'vkadv_settings_link'+id,
			'href': params.href,
			'target': '_blank'
			}).text(name);
			
		if (params.blockButton) {
			var wrap = $('<div />', {
				'class': 'vkAdv_SettingsLink_Wrap',
				'id:': 'vkadv_settings_link_wrap'+id
				});
			wrap.append(a);
			}
		
		if (params.triggerClcik) {
			a.on('click', function(e) { params.triggerClcik(); cancelEvent(e); } );
			}
		
		if (!params.blockButton) return a;
		if (params.blockButton) return wrap;
		},
		
	listenerHandler: function(tabId) {
		var vkAccessToken,
			vkAccessTokenExpiredFlag;
			
			console.log(tabId);
		},

	/* Показать окно настроек */
	show_SettingsBox: function() {		
		var tabs = vkAdv_Settings.createSettings_Tabs(1);
		var tabMedia = vkAdv_Settings.createSettings_Tab(tabs, 1, 'Мультимедиа', true);
		var tabIface = vkAdv_Settings.createSettings_Tab(tabs, 2, 'Интерфейс');
		//var tabSounds = vkAdv_Settings.createSettings_Tab(tabs, 3, 'Звуки');
		var tabAbout = vkAdv_Settings.createSettings_Tab(tabs, 4, 'Коротко о...');
		
		var contents = vkAdv_Settings.forceContents([ tabs, tabMedia, tabIface, tabAbout ]);
		
		/* Задаем настройки мультимедиа */
		vkAdv_Settings.createSettings_Header(tabMedia, 1, '<b>Настройки мультимедиа</b>. Всякое скачивание аудио, видео, битрейты и прочая, мало кому нужная х**та');
		vkAdv_Settings.createSettings_title(tabMedia, 1, 'Настройки аудио');
		
		var dw_audio = vkAdv_Settings.createSettings_CheckBox(1, 'dw_audio', 'Возможность скачивать музыку');
		var show_bitrate = vkAdv_Settings.createSettings_CheckBox(2, 'show_bitrate', 'Показывать битрейт');
		var strict_search = vkAdv_Settings.createSettings_CheckBox(3, 'strict_search', 'Строгий поиск по исполнителям');
		var show_size_on_hover = vkAdv_Settings.createSettings_CheckBox(4, 'show_size_on_hover', 'Показать размер при наведении на битрейт');
		var remove_bad_bitrate = vkAdv_Settings.createSettings_CheckBox(5, 'remove_bad_bitrate', 'Удалять трэки с низким битрейтом из поиска');
		//id, options, items, setting, label
		var bad_bitrate = vkAdv_Settings.createSettings_ComboBox(1, { width: 100 }, [ 32, 64, 96, 128, 160, 192, 256, 320 ], 'bad_bitrate', 'Удалять, если битрейт ниже:');
		
		var audioSection = vkAdv_Settings.createSettings_Group(tabMedia, 2, 1, [dw_audio, show_bitrate, strict_search, show_size_on_hover, remove_bad_bitrate, bad_bitrate]);
		
		vkAdv_Settings.createSettings_title(tabMedia, 2, 'Настройки видео');
		
		var dw_video = vkAdv_Settings.createSettings_CheckBox(6, 'dw_video', 'Возможность скачивать видео');
		var video_name_fmt = vkAdv_Settings.createSettings_Edit(7, { width: 150 }, 'video_name_fmt', 'Формат названия:');
		
		var videoSection = vkAdv_Settings.createSettings_Group(tabMedia, 2, 1, [dw_video, video_name_fmt]);
		
		vkAdv_Settings.createSettings_title(tabMedia, 5, 'Всякое разное');
		var slow_inet = vkAdv_Settings.createSettings_CheckBox(12, 'slow_inet', 'У меня медленный инет');
		var bitrate_timeout = vkAdv_Settings.createSettings_ComboBox(3, { width: 100 }, [ 60, 200, 500, 1000, 2500, 4500, 8000, 10000 ], 'bitrate_timeout', 'Таймаут определения битрейта (мс)');
		
		var otherSection = vkAdv_Settings.createSettings_Group(tabMedia, 2, 1, [ slow_inet, bitrate_timeout ]);
		
		/* Задаем настройки интерфейса */
		vkAdv_Settings.createSettings_Header(tabIface, 2, '<b>Настройки интерфейса</b>, такие как лайки всякие там иконки и тд');
		
		vkAdv_Settings.createSettings_title(tabIface, 3, 'Основные настройки');
		
		var replike = vkAdv_Settings.createSettings_CheckBox(7, 'replike', 'Заменить текст лайка на свой');
		var replike_text = vkAdv_Settings.createSettings_Edit(2, { width: 200 }, 'replike_text', 'Текст лайка');
		var new_interface = vkAdv_Settings.createSettings_CheckBox(8, 'new_interface', 'Иконки в меню');
		var en_logo = vkAdv_Settings.createSettings_CheckBox(9, 'en_logo', 'Международный логотип');
		var audio_to_top = vkAdv_Settings.createSettings_CheckBox(10, 'audio_to_top', 'Перенести аудиозаписи наверх');
		var ad_block = vkAdv_Settings.createSettings_CheckBox(11, 'ad_block', 'Заблочить рекламу');		
		
		var genIface_section = vkAdv_Settings.createSettings_Group(tabIface, 2, 1, [replike, replike_text, new_interface, en_logo, audio_to_top, ad_block]);
		
		vkAdv_Settings.createSettings_Header(tabAbout, 4, '<b>Коротко о...</b> Разаработчиках! О тех самых святых людях...');
		
		vkAdv_Settings.createSettings_title(tabAbout, 5, 'О Программе');
		vkAdv_Settings.createSettings_Text(tabAbout, 1, { appendToTab: true }, vkAdv.aboutText);
		
		vkAdv_Settings.createSettings_title(tabAbout, 6, 'Версия и номер сборки');
		vkAdv_Settings.createSettings_Text(tabAbout, 2, { appendToTab: true }, '<b>Версия: </b>'+vkAdv.version+'<br />'+'<b>Сборка: </b>' + vkAdv.build)
		
		vkAdv_Settings.createSettings_title(tabAbout, 7, 'Полезные сслыки & разарботчики');
		var links_tpl = '<ul class="vkAdv_SettingsLinksList"><li><a href="https://vk.com/public79105698">Сообщество Vkontakte Advanced</a></li><li><a href="https://addons.opera.com/ru/extensions/details/vkontakte-downloader-advanced/?display=ru">Vkontakte Advanced для Opera</a></li><li><a href="https://chrome.google.com/webstore/detail/vkontakte-downloader-adva/dippnhhkiiicildmbcdaaiodiekekblc?hl=ru">Vkontakte Advanced для Google Chrome</a></li><li><a href="https://github.com/Redfern89/Vkontakte-advanced">Репозиторий на GitHub</a></li><li><a href="https://vk.com/vk.com_89"><b> Вадим Алиев</b> - Разаработчик JS</a></li><li><a href="https://vk.com/padonak_vbg"><b>Денис Кораблев</b> - Дизайнер и идейный вдохновитель</a></li></ul>';
		
		vkAdv_Settings.createSettings_Text(tabAbout, 3, { appendToTab: true }, links_tpl);
		
		vkAdv_Settings.showBox({ height: 400, width: 700, title: 'Настройки Vkontakte Advanced v'+vkAdv.version+' (build '+vkAdv.build+')' }, contents, true);
		}

	}