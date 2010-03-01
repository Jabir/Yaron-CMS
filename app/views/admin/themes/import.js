popup_body_items = new Ext.FormPanel({
    frame: false,
    labelWidth: 110,
    formId: "theme_upload_form",
    bodyStyle: 'padding:5px 10px 0;',
    fileUpload: true,
    errorReader: new Ext.data.CrudReader(),
    reader: new Ext.data.CrudReader(),
    items: [{
      xtype: 'fileuploadfield',
      id: 'form-file',
      emptyText: 'Selecteer een thema',
      fieldLabel: 'Zip-bestand',
      name: 'theme[file]'
    }],
    buttons: [{
      text: 'Annuleren',
      iconCls: 'silk-cancel',
			handler: function(btn, ev) {
        import_window.destroy();
      },
      scope: this
    },{
      text:'Importeren',
      iconCls: 'silk-add',
			handler: function(btn, ev) {
        if(popup_body_items.getForm().isValid()){
          popup_body_items.getForm().submit({
              url: '<%= import_admin_themes_path(@site) %>',
              waitMsg: 'Bezig met importeren thema...',
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
                    title: 'Thema importeren',
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
                    title: 'Thema importeren',
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