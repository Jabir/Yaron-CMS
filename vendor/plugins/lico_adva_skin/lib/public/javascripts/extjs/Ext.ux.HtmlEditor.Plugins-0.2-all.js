Ext.ns("Ext.ux.form.HtmlEditor");
Ext.ux.form.HtmlEditor.Image = Ext.extend(Ext.util.Observable, {
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },
    onRender: function() {
        var btn = this.cmp.getToolbar().addButton({
            iconCls: 'x-edit-pictures',
            handler: this.selectImage,
            scope: this,
            tooltip: 'Insert Image'
        });
    },
    selectImage: function() {
      select_insert_image(this);
    },
    insertImage: function(img) {
      this.hash = img;
      this.cmp.execCmd('InsertImage', this.hash);

      var textarea = document.getElementById(this.cmp.getId());
      
      var iframe = textarea.parentNode.getElementsByTagName("iframe")[0];
      Ext.get(iframe.contentWindow.document.body).select('img').each(function(img) {
        if (img.getAttribute('src') == this.hash) {
          var data = img.getAttribute("src").split(/\?/);
          img.set({"src": data[0]});
          if (data.length > 1) {
            var obj = {};
            var params = data[1].split(/\&/);
            for (var c=0; c<params.length; c++) {
              var key = params[c].split(/\=/)[0];
              var value = params[c].split(/\=/)[1];
              obj[key] = value;
            }
            img.set(obj);
          }
        }
      }, this);
      this.cmp.syncValue();
    }
});