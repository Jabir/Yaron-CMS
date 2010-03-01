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
      name: 'asset[title]',
      value: <%= @asset.title.to_json %>
    },{
      xtype: 'textfield',
      fieldLabel: '<%= t(:'adva.assets.labels.upload.tags') %>',
      name: 'asset[tag_list]',
      value: <%= @asset.tag_list.to_json %>
    },{
      xtype: 'fileuploadfield',
      id: 'form-file',
      emptyText: 'Selecteer een bestand',
      fieldLabel: '<%= t(:'adva.assets.labels.upload.files') %>',
      name: 'asset[data]'
    }],
    buttons: [{
      text: 'Annuleren',
      iconCls: 'silk-cancel',
			handler: function(btn, ev) {
        import_window.destroy();
      },
      scope: this
    },{
      text: 'Verwijderen',
      iconCls: 'silk-delete',
      handler: function(btn, ev) {
        Ext.Msg.show({
            id: 'delete_confirm',
            title: 'Asset verwijderen',
            msg: 'Asset verwijderen?',
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
                        url: '<%= admin_asset_path(@site, "asset_id") %>'.replace(/asset_id/,asset_edit_id),
                        cache: false,
                        data: {
                            authenticity_token: window._auth_token,
                            _method: 'delete'
                        },
                        type: 'POST',
                        success: function(html) {
                          assets_data.reload();
                          generic_loader.hide();
                        }
                    });
                }
            }
        });
      },
      scope: this
    },{
      text:'Opslaan',
      iconCls: 'silk-add',
			handler: function(btn, ev) {
        if(popup_body_items.getForm().isValid()){
          popup_body_items.getForm().submit({
              url: '<%= admin_asset_path %>',
              waitMsg: 'Bezig met opslaan asset...',
              params: {
                authenticity_token: window._auth_token,
                _method: 'put'
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
                    title: 'Asset bewerken',
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
                    title: 'Asset bewerken',
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