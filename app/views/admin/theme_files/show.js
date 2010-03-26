popup_body_items = new Ext.FormPanel({
	frame: false,
	labelWidth: 1,
	formId: "theme_file_upload_form",
	bodyStyle: 'padding:5px 10px 0; <%= @file.respond_to?(:text) ? "padding: 0px; padding-top: 5px" : "" %>',
	fileUpload: true,
	errorReader: new Ext.data.CrudReader(),
	reader: new Ext.data.CrudReader(),
	items: [{
		<% if @file.respond_to?(:text) %>
			xtype: 'textarea',
			name: 'file[data]',
			id: 'file_data',
			width: 475,
			height: 420,
			value: <%= @file.text.to_json %>
		<% elsif @file.respond_to?(:base_url) and @file.base_url %>
			border: false,
			html: <%= theme_image_tag(@theme.theme_id, @file.base_url).to_json %>
		<% end %>
	}],
	buttons: [{
		text: 'Annuleren',
		iconCls: 'silk-delete',
		handler: function(btn, ev) {
			import_window.destroy();
		},
		scope: this
	},{
		text:'Verwijderen',
		iconCls: 'silk-delete',
		handler: function(btn, ev) {
			Ext.Msg.show({
				id: 'delete_confirm',
				title: 'Bestand verwijderen',
				msg: 'Weet je zeker dat je dit bestand wilt verwijderen?',
				buttons: {
					ok: t['delete_text'],
					cancel: t['cancel_text']
				},
				icon: Ext.MessageBox.WARNING,
				fn: function(btn) {
					if (btn == "ok") {
						import_window.destroy();
						generic_loader.show();
						$.ajax({
							url: '<%= admin_theme_file_path(@site, @theme, @file) %>',
							cache: false,
							data: {
								authenticity_token: window._auth_token,
								_method: 'delete'
							},
							type: 'POST',
							success: function(html) {
								generic_loader.hide();
							    grid.getSelectionModel().clearSelections();
							    store.reload();
							}
						});
					}
				}
			});
		}
	<% if @file.respond_to?(:text) %>
	},{
		text:'Opslaan',
		iconCls: 'silk-add',
		handler: function(btn, ev) {
			generic_loader.show();
			import_window.hide();
			$.ajax({
				url: '<%= admin_theme_file_path(@site, @theme, @file) %>',
				cache: false,
				data: {
					authenticity_token: window._auth_token,
					_method: 'put',
					'file[data]': document.getElementById('file_data').value
				},
				type: 'POST',
				success: function(html) {
					import_window.destroy();
					generic_loader.hide();
				    grid.getSelectionModel().clearSelections();
				    store.reload();
				}
			});
		}
	<% end %>
	}]
});