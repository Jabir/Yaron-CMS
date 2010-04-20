popup_body_items = new Ext.FormPanel({
    frame: false,
    labelWidth: 140,
    formId: "asset_upload_form",
    bodyStyle: 'padding:5px 10px 0;',
    fileUpload: true,
    errorReader: new Ext.data.CrudReader(),
    reader: new Ext.data.CrudReader(),
    items: [{
      xtype: 'textfield',
      fieldLabel: '<%= t(:'adva.assets.labels.upload.title') %>',
      name: 'assets[][title]'
    },{
      xtype: 'textfield',
      fieldLabel: '<%= t(:'adva.assets.labels.upload.tags') %>',
      name: 'assets[][tag_list]'
    },{
      xtype: 'fileuploadfield',
      id: 'form-file',
      emptyText: 'Selecteer een bestand',
      fieldLabel: '<%= t(:'adva.assets.labels.upload.files') %>',
      name: 'assets[][data]'
    }],
    buttons: [{
      text: '<%= t(:'Yaron-CMS.common.cancel') %>',
      iconCls: 'silk-cancel',
			handler: function(btn, ev) {
        import_window.destroy();
      },
      scope: this
    },{
      text:'<%= t(:'Yaron-CMS.common.add') %>',
      iconCls: 'silk-add',
			handler: function(btn, ev) {
        if(popup_body_items.getForm().isValid()){
          popup_body_items.getForm().submit({
              url: '<%= admin_assets_path %>',
              waitMsg: 'Bezig met toevoegen asset...',
              params: {
                authenticity_token: window._auth_token
              },
              success: function(fp, o){
                if (__last_xhr_result=="OK") {
                  assets_data.reload();
                  import_window.destroy();
                  generic_loader.hide();
                } else {
                 import_window.show();
                  generic_loader.hide();
                  Ext.MessageBox.show({
                    title: '<%= t(:'Yaron-CMS.titles.asset_add') %>',
                    msg: __last_xhr_result,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                  });
                }
              },
              failure: function(fp, o) {
                if (__last_xhr_result=="OK") {
                  assets_data.reload();
                  import_window.destroy();
                  generic_loader.hide();
                } else {
                 import_window.show();
                  generic_loader.hide();
                  Ext.MessageBox.show({
                    title: '<%= t(:'Yaron-CMS.titles.asset_add') %>',
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