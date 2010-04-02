popup_body_items = new Ext.FormPanel({
    frame: false,
    labelWidth: 110,
    bodyStyle: 'padding:5px 10px 0;',
    errorReader: new Ext.data.CrudReader(),
    reader: new Ext.data.CrudReader(),
    items: [{
      xtype: 'textfield',
      fieldLabel: 'Bestandsnaam',
      name: 'file[base_path]'
	},{
		xtype: 'textarea',
		name: 'file[data]',
		fieldLabel: 'Data',
		id: 'file_data',
		width: 355,
		height: 190
    }],
    buttons: [{
		text: 'Annuleren',
		iconCls: 'silk-cancel',
		handler: function(btn, ev) {
        	import_window.destroy();
      	},
		scope: this
    },{
      text:'Toevoegen',
      iconCls: 'silk-add',
		handler: function(btn, ev) {
        if(popup_body_items.getForm().isValid()){
          popup_body_items.getForm().submit({
              url: '<%= admin_theme_files_path(@site, @theme) %>',
              waitMsg: 'Bezig met toevoegen bestand...',
              params: {
                authenticity_token: window._auth_token
              },
              success: function(fp, o){
                if (__last_xhr_result=="OK") {
                  store.reload();
                  import_window.destroy();
                  generic_loader.hide();
                } else {
                 import_window.show();
                  generic_loader.hide();
                  Ext.MessageBox.show({
                    title: 'Bestand toevoegen',
                    msg: __last_xhr_result,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                  });
                }
              },
              failure: function(fp, o) {
                if (__last_xhr_result=="OK") {
                  store.reload();
                  import_window.destroy();
                  generic_loader.hide();
                } else {
                 import_window.show();
                  generic_loader.hide();
                  Ext.MessageBox.show({
                    title: 'Bestand toevoegen',
                    msg: __last_xhr_result,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                  });
                }
              }
          });
        }
      },
    }]
  });