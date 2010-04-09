//
// http://www.extjs.com/deploy/dev/examples/ux/fileuploadfield/FileUploadField.js
//
/*!
 * Ext JS Library 3.1.1
 * Copyright(c) 2006-2010 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ns('Ext.ux.form');

/**
 * @class Ext.ux.form.FileUploadField
 * @extends Ext.form.TextField
 * Creates a file upload field.
 * @xtype fileuploadfield
 */
Ext.ux.form.FileUploadField = Ext.extend(Ext.form.TextField,  {
    /**
     * @cfg {String} buttonText The button text to display on the upload button (defaults to
     * 'Browse...').  Note that if you supply a value for {@link #buttonCfg}, the buttonCfg.text
     * value will be used instead if available.
     */
    buttonText: 'Browse...',
    /**
     * @cfg {Boolean} buttonOnly True to display the file upload field as a button with no visible
     * text field (defaults to false).  If true, all inherited TextField members will still be available.
     */
    buttonOnly: false,
    /**
     * @cfg {Number} buttonOffset The number of pixels of space reserved between the button and the text field
     * (defaults to 3).  Note that this only applies if {@link #buttonOnly} = false.
     */
    buttonOffset: 3,
    /**
     * @cfg {Object} buttonCfg A standard {@link Ext.Button} config object.
     */

    // private
    readOnly: true,

    /**
     * @hide
     * @method autoSize
     */
    autoSize: Ext.emptyFn,

    // private
    initComponent: function(){
        Ext.ux.form.FileUploadField.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event fileselected
             * Fires when the underlying file input field's value has changed from the user
             * selecting a new file from the system file selection dialog.
             * @param {Ext.ux.form.FileUploadField} this
             * @param {String} value The file value returned by the underlying file input field
             */
            'fileselected'
        );
    },

    // private
    onRender : function(ct, position){
        Ext.ux.form.FileUploadField.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'});
        this.el.addClass('x-form-file-text');
        this.el.dom.removeAttribute('name');
        this.createFileInput();

        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.wrap,
            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
        }));

        if(this.buttonOnly){
            this.el.hide();
            this.wrap.setWidth(this.button.getEl().getWidth());
        }

        this.bindListeners();
        this.resizeEl = this.positionEl = this.wrap;
    },
    
    bindListeners: function(){
        this.fileInput.on({
            scope: this,
            mouseenter: function() {
                this.button.addClass(['x-btn-over','x-btn-focus'])
            },
            mouseleave: function(){
                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
            },
            mousedown: function(){
                this.button.addClass('x-btn-click')
            },
            mouseup: function(){
                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
            },
            change: function(){
                var v = this.fileInput.dom.value;
                this.setValue(v);
                this.fireEvent('fileselected', this, v);    
            }
        }); 
    },
    
    createFileInput : function() {
        this.fileInput = this.wrap.createChild({
            id: this.getFileInputId(),
            name: this.name||this.getId(),
            cls: 'x-form-file',
            tag: 'input',
            type: 'file',
            size: 1
        });
    },
    
    reset : function(){
        this.fileInput.remove();
        this.createFileInput();
        this.bindListeners();
        Ext.ux.form.FileUploadField.superclass.reset.call(this);
    },

    // private
    getFileInputId: function(){
        return this.id + '-file';
    },

    // private
    onResize : function(w, h){
        Ext.ux.form.FileUploadField.superclass.onResize.call(this, w, h);

        this.wrap.setWidth(w);

        if(!this.buttonOnly){
            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
            this.el.setWidth(w);
        }
    },

    // private
    onDestroy: function(){
        Ext.ux.form.FileUploadField.superclass.onDestroy.call(this);
        Ext.destroy(this.fileInput, this.button, this.wrap);
    },
    
    onDisable: function(){
        Ext.ux.form.FileUploadField.superclass.onDisable.call(this);
        this.doDisable(true);
    },
    
    onEnable: function(){
        Ext.ux.form.FileUploadField.superclass.onEnable.call(this);
        this.doDisable(false);

    },
    
    // private
    doDisable: function(disabled){
        this.fileInput.dom.disabled = disabled;
        this.button.setDisabled(disabled);
    },


    // private
    preFocus : Ext.emptyFn,

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    }

});

Ext.reg('fileuploadfield', Ext.ux.form.FileUploadField);

// backwards compat
Ext.form.FileUploadField = Ext.ux.form.FileUploadField;

//
// http://www.extjs.com/forum/showthread.php?t=22661
//
/**
 * @class Ext.ux.form.DateTime
 * @extends Ext.form.Field
 *
 * DateTime field, combination of DateField and TimeField
 *
 * @author      Ing. Jozef Sakáloš
 * @copyright (c) 2008, Ing. Jozef Sakáloš
 * @version   2.0
 * @revision  $Id: Ext.ux.form.DateTime.js 787 2009-12-03 16:24:21Z jozo $
 *
 * @license Ext.ux.form.DateTime is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * <p>License details: <a href="http://www.gnu.org/licenses/lgpl.html"
 * target="_blank">http://www.gnu.org/licenses/lgpl.html</a></p>
 */
Ext.ns('Ext.ux.form');

/**
 * Creates new DateTime
 * @constructor
 * @param {Object} config A config object
 */
Ext.ux.form.DateTime = Ext.extend(Ext.form.Field, {
    /**
     * @cfg {Function} dateValidator A custom validation function to be called during date field
     * validation (defaults to null)
     */
     dateValidator:null
    /**
     * @cfg {String/Object} defaultAutoCreate DomHelper element spec
     * Let superclass to create hidden field instead of textbox. Hidden will be submittend to server
     */
    ,defaultAutoCreate:{tag:'input', type:'hidden'}
    /**
     * @cfg {String} dtSeparator Date - Time separator. Used to split date and time (defaults to ' ' (space))
     */
    ,dtSeparator:' '
    /**
     * @cfg {String} hiddenFormat Format of datetime used to store value in hidden field
     * and submitted to server (defaults to 'Y-m-d H:i:s' that is mysql format)
     */
    ,hiddenFormat:'Y-m-d H:i:s'
    /**
     * @cfg {Boolean} otherToNow Set other field to now() if not explicly filled in (defaults to true)
     */
    ,otherToNow:true
    /**
     * @cfg {Boolean} emptyToNow Set field value to now on attempt to set empty value.
     * If it is true then setValue() sets value of field to current date and time (defaults to false)
     */
    /**
     * @cfg {String} timePosition Where the time field should be rendered. 'right' is suitable for forms
     * and 'below' is suitable if the field is used as the grid editor (defaults to 'right')
     */
    ,timePosition:'right' // valid values:'below', 'right'
    /**
     * @cfg {Function} timeValidator A custom validation function to be called during time field
     * validation (defaults to null)
     */
    ,timeValidator:null
    /**
     * @cfg {Number} timeWidth Width of time field in pixels (defaults to 100)
     */
    ,timeWidth:100
    /**
     * @cfg {String} dateFormat Format of DateField. Can be localized. (defaults to 'm/y/d')
     */
    ,dateFormat:'m/d/y'
    /**
     * @cfg {String} timeFormat Format of TimeField. Can be localized. (defaults to 'g:i A')
     */
    ,timeFormat:'H:i'
    /**
     * @cfg {Object} dateConfig Config for DateField constructor.
     */
    /**
     * @cfg {Object} timeConfig Config for TimeField constructor.
     */

    // {{{
    /**
     * @private
     * creates DateField and TimeField and installs the necessary event handlers
     */
    ,initComponent:function() {
        // call parent initComponent
        Ext.ux.form.DateTime.superclass.initComponent.call(this);

        // create DateField
        var dateConfig = Ext.apply({}, {
             id:this.id + '-date'
            ,format:this.dateFormat || Ext.form.DateField.prototype.format
            ,width:this.timeWidth
            ,selectOnFocus:this.selectOnFocus
            ,validator:this.dateValidator
            ,listeners:{
                  blur:{scope:this, fn:this.onBlur}
                 ,focus:{scope:this, fn:this.onFocus}
            }
        }, this.dateConfig);
        this.df = new Ext.form.DateField(dateConfig);
        this.df.ownerCt = this;
        delete(this.dateFormat);

        // create TimeField
        var timeConfig = Ext.apply({}, {
             id:this.id + '-time'
            ,format:this.timeFormat || Ext.form.TimeField.prototype.format
            ,width:this.timeWidth
            ,selectOnFocus:this.selectOnFocus
            ,validator:this.timeValidator
            ,listeners:{
                  blur:{scope:this, fn:this.onBlur}
                 ,focus:{scope:this, fn:this.onFocus}
            }
        }, this.timeConfig);
        this.tf = new Ext.form.TimeField(timeConfig);
        this.tf.ownerCt = this;
        delete(this.timeFormat);

        // relay events
        this.relayEvents(this.df, ['focus', 'specialkey', 'invalid', 'valid']);
        this.relayEvents(this.tf, ['focus', 'specialkey', 'invalid', 'valid']);

        this.on('specialkey', this.onSpecialKey, this);

    } // eo function initComponent
    // }}}
    // {{{
    /**
     * @private
     * Renders underlying DateField and TimeField and provides a workaround for side error icon bug
     */
    ,onRender:function(ct, position) {
        // don't run more than once
        if(this.isRendered) {
            return;
        }

        // render underlying hidden field
        Ext.ux.form.DateTime.superclass.onRender.call(this, ct, position);

        // render DateField and TimeField
        // create bounding table
        var t;
        if('below' === this.timePosition || 'bellow' === this.timePosition) {
            t = Ext.DomHelper.append(ct, {tag:'table',style:'border-collapse:collapse',children:[
                 {tag:'tr',children:[{tag:'td', style:'padding-bottom:1px', cls:'ux-datetime-date'}]}
                ,{tag:'tr',children:[{tag:'td', cls:'ux-datetime-time'}]}
            ]}, true);
        }
        else {
            t = Ext.DomHelper.append(ct, {tag:'table',style:'border-collapse:collapse',children:[
                {tag:'tr',children:[
                    {tag:'td',style:'padding-right:4px', cls:'ux-datetime-date'},{tag:'td', cls:'ux-datetime-time'}
                ]}
            ]}, true);
        }

        this.tableEl = t;
        this.wrap = t.wrap({cls:'x-form-field-wrap'});
//        this.wrap = t.wrap();
        this.wrap.on("mousedown", this.onMouseDown, this, {delay:10});

        // render DateField & TimeField
        this.df.render(t.child('td.ux-datetime-date'));
        this.tf.render(t.child('td.ux-datetime-time'));

        // workaround for IE trigger misalignment bug
        // see http://extjs.com/forum/showthread.php?p=341075#post341075
//        if(Ext.isIE && Ext.isStrict) {
//            t.select('input').applyStyles({top:0});
//        }

        this.df.el.swallowEvent(['keydown', 'keypress']);
        this.tf.el.swallowEvent(['keydown', 'keypress']);

        // create icon for side invalid errorIcon
        if('side' === this.msgTarget) {
            var elp = this.el.findParent('.x-form-element', 10, true);
            if(elp) {
                this.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
            }

            var o = {
                 errorIcon:this.errorIcon
                ,msgTarget:'side'
                ,alignErrorIcon:this.alignErrorIcon.createDelegate(this)
            };
            Ext.apply(this.df, o);
            Ext.apply(this.tf, o);
//            this.df.errorIcon = this.errorIcon;
//            this.tf.errorIcon = this.errorIcon;
        }

        // setup name for submit
        this.el.dom.name = this.hiddenName || this.name || this.id;

        // prevent helper fields from being submitted
        this.df.el.dom.removeAttribute("name");
        this.tf.el.dom.removeAttribute("name");

        // we're rendered flag
        this.isRendered = true;

        // update hidden field
        this.updateHidden();

    } // eo function onRender
    // }}}
    // {{{
    /**
     * @private
     */
    ,adjustSize:Ext.BoxComponent.prototype.adjustSize
    // }}}
    // {{{
    /**
     * @private
     */
    ,alignErrorIcon:function() {
        this.errorIcon.alignTo(this.tableEl, 'tl-tr', [2, 0]);
    }
    // }}}
    // {{{
    /**
     * @private initializes internal dateValue
     */
    ,initDateValue:function() {
        this.dateValue = this.otherToNow ? new Date() : new Date(1970, 0, 1, 0, 0, 0);
    }
    // }}}
    // {{{
    /**
     * Calls clearInvalid on the DateField and TimeField
     */
    ,clearInvalid:function(){
        this.df.clearInvalid();
        this.tf.clearInvalid();
    } // eo function clearInvalid
    // }}}
    // {{{
    /**
     * Calls markInvalid on both DateField and TimeField
     * @param {String} msg Invalid message to display
     */
    ,markInvalid:function(msg){
        this.df.markInvalid(msg);
        this.tf.markInvalid(msg);
    } // eo function markInvalid
    // }}}
    // {{{
    /**
     * @private
     * called from Component::destroy. 
     * Destroys all elements and removes all listeners we've created.
     */
    ,beforeDestroy:function() {
        if(this.isRendered) {
//            this.removeAllListeners();
            this.wrap.removeAllListeners();
            this.wrap.remove();
            this.tableEl.remove();
            this.df.destroy();
            this.tf.destroy();
        }
    } // eo function beforeDestroy
    // }}}
    // {{{
    /**
     * Disable this component.
     * @return {Ext.Component} this
     */
    ,disable:function() {
        if(this.isRendered) {
            this.df.disabled = this.disabled;
            this.df.onDisable();
            this.tf.onDisable();
        }
        this.disabled = true;
        this.df.disabled = true;
        this.tf.disabled = true;
        this.fireEvent("disable", this);
        return this;
    } // eo function disable
    // }}}
    // {{{
    /**
     * Enable this component.
     * @return {Ext.Component} this
     */
    ,enable:function() {
        if(this.rendered){
            this.df.onEnable();
            this.tf.onEnable();
        }
        this.disabled = false;
        this.df.disabled = false;
        this.tf.disabled = false;
        this.fireEvent("enable", this);
        return this;
    } // eo function enable
    // }}}
    // {{{
    /**
     * @private Focus date filed
     */
    ,focus:function() {
        this.df.focus();
    } // eo function focus
    // }}}
    // {{{
    /**
     * @private
     */
    ,getPositionEl:function() {
        return this.wrap;
    }
    // }}}
    // {{{
    /**
     * @private
     */
    ,getResizeEl:function() {
        return this.wrap;
    }
    // }}}
    // {{{
    /**
     * @return {Date/String} Returns value of this field
     */
    ,getValue:function() {
        // create new instance of date
        return this.dateValue ? new Date(this.dateValue) : '';
    } // eo function getValue
    // }}}
    // {{{
    /**
     * @return {Boolean} true = valid, false = invalid
     * @private Calls isValid methods of underlying DateField and TimeField and returns the result
     */
    ,isValid:function() {
        return this.df.isValid() && this.tf.isValid();
    } // eo function isValid
    // }}}
    // {{{
    /**
     * Returns true if this component is visible
     * @return {boolean} 
     */
    ,isVisible : function(){
        return this.df.rendered && this.df.getActionEl().isVisible();
    } // eo function isVisible
    // }}}
    // {{{
    /** 
     * @private Handles blur event
     */
    ,onBlur:function(f) {
        // called by both DateField and TimeField blur events

        // revert focus to previous field if clicked in between
        if(this.wrapClick) {
            f.focus();
            this.wrapClick = false;
        }

        // update underlying value
        if(f === this.df) {
            this.updateDate();
        }
        else {
            this.updateTime();
        }
        this.updateHidden();

        this.validate();

        // fire events later
        (function() {
            if(!this.df.hasFocus && !this.tf.hasFocus) {
                var v = this.getValue();
                if(String(v) !== String(this.startValue)) {
                    this.fireEvent("change", this, v, this.startValue);
                }
                this.hasFocus = false;
                this.fireEvent('blur', this);
            }
        }).defer(100, this);

    } // eo function onBlur
    // }}}
    // {{{
    /**
     * @private Handles focus event
     */
    ,onFocus:function() {
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    }
    // }}}
    // {{{
    /**
     * @private Just to prevent blur event when clicked in the middle of fields
     */
    ,onMouseDown:function(e) {
        if(!this.disabled) {
            this.wrapClick = 'td' === e.target.nodeName.toLowerCase();
        }
    }
    // }}}
    // {{{
    /**
     * @private
     * Handles Tab and Shift-Tab events
     */
    ,onSpecialKey:function(t, e) {
        var key = e.getKey();
        if(key === e.TAB) {
            if(t === this.df && !e.shiftKey) {
                e.stopEvent();
                this.tf.focus();
            }
            if(t === this.tf && e.shiftKey) {
                e.stopEvent();
                this.df.focus();
            }
            this.updateValue();
        }
        // otherwise it misbehaves in editor grid
        if(key === e.ENTER) {
            this.updateValue();
        }

    } // eo function onSpecialKey
    // }}}
    // {{{
    /**
     * Resets the current field value to the originally loaded value 
     * and clears any validation messages. See Ext.form.BasicForm.trackResetOnLoad
     */
    ,reset:function() {
        this.df.reset(this.originalValue);
        this.tf.reset(this.originalValue);
    } // eo function reset
    // }}}
    // {{{
    /**
     * @private Sets the value of DateField
     */
    ,setDate:function(date) {
        this.df.setValue(date);
    } // eo function setDate
    // }}}
    // {{{
    /** 
     * @private Sets the value of TimeField
     */
    ,setTime:function(date) {
        this.tf.setValue(date);
    } // eo function setTime
    // }}}
    // {{{
    /**
     * @private
     * Sets correct sizes of underlying DateField and TimeField
     * With workarounds for IE bugs
     */
    ,setSize:function(w, h) {
        if(!w) {
            return;
        }
        if('below' === this.timePosition) {
            this.df.setSize(w, h);
            this.tf.setSize(w, h);
            if(Ext.isIE) {
                this.df.el.up('td').setWidth(w);
                this.tf.el.up('td').setWidth(w);
            }
        }
        else {
            this.df.setSize(w - this.timeWidth - 4, h);
            this.tf.setSize(this.timeWidth, h);

            if(Ext.isIE) {
                this.df.el.up('td').setWidth(w - this.timeWidth - 4);
                this.tf.el.up('td').setWidth(this.timeWidth);
            }
        }
    } // eo function setSize
    // }}}
    // {{{
    /**
     * @param {Mixed} val Value to set
     * Sets the value of this field
     */
    ,setValue:function(val) {
        if(!val && true === this.emptyToNow) {
            this.setValue(new Date());
            return;
        }
        else if(!val) {
            this.setDate('');
            this.setTime('');
            this.updateValue();
            return;
        }
        if ('number' === typeof val) {
          val = new Date(val);
        }
        else if('string' === typeof val && this.hiddenFormat) {
            val = Date.parseDate(val, this.hiddenFormat);
        }
        val = val ? val : new Date(1970, 0 ,1, 0, 0, 0);
        var da;
        if(val instanceof Date) {
            this.setDate(val);
            this.setTime(val);
            this.dateValue = new Date(Ext.isIE ? val.getTime() : val);
        }
        else {
            da = val.split(this.dtSeparator);
            this.setDate(da[0]);
            if(da[1]) {
                if(da[2]) {
                    // add am/pm part back to time
                    da[1] += da[2];
                }
                this.setTime(da[1]);
            }
        }
        this.updateValue();
    } // eo function setValue
    // }}}
    // {{{
    /**
     * Hide or show this component by boolean
     * @return {Ext.Component} this
     */
    ,setVisible: function(visible){
        if(visible) {
            this.df.show();
            this.tf.show();
        }else{
            this.df.hide();
            this.tf.hide();
        }
        return this;
    } // eo function setVisible
    // }}}
    //{{{
    ,show:function() {
        return this.setVisible(true);
    } // eo function show
    //}}}
    //{{{
    ,hide:function() {
        return this.setVisible(false);
    } // eo function hide
    //}}}
    // {{{
    /**
     * @private Updates the date part
     */
    ,updateDate:function() {

        var d = this.df.getValue();
        if(d) {
            if(!(this.dateValue instanceof Date)) {
                this.initDateValue();
                if(!this.tf.getValue()) {
                    this.setTime(this.dateValue);
                }
            }
            this.dateValue.setMonth(0); // because of leap years
            this.dateValue.setFullYear(d.getFullYear());
            this.dateValue.setMonth(d.getMonth(), d.getDate());
//            this.dateValue.setDate(d.getDate());
        }
        else {
            this.dateValue = '';
            this.setTime('');
        }
    } // eo function updateDate
    // }}}
    // {{{
    /**
     * @private
     * Updates the time part
     */
    ,updateTime:function() {
        var t = this.tf.getValue();
        if(t && !(t instanceof Date)) {
            t = Date.parseDate(t, this.tf.format);
        }
        if(t && !this.df.getValue()) {
            this.initDateValue();
            this.setDate(this.dateValue);
        }
        if(this.dateValue instanceof Date) {
            if(t) {
                this.dateValue.setHours(t.getHours());
                this.dateValue.setMinutes(t.getMinutes());
                this.dateValue.setSeconds(t.getSeconds());
            }
            else {
                this.dateValue.setHours(0);
                this.dateValue.setMinutes(0);
                this.dateValue.setSeconds(0);
            }
        }
    } // eo function updateTime
    // }}}
    // {{{
    /**
     * @private Updates the underlying hidden field value
     */
    ,updateHidden:function() {
        if(this.isRendered) {
            var value = this.dateValue instanceof Date ? this.dateValue.format(this.hiddenFormat) : '';
            this.el.dom.value = value;
        }
    }
    // }}}
    // {{{
    /**
     * @private Updates all of Date, Time and Hidden
     */
    ,updateValue:function() {

        this.updateDate();
        this.updateTime();
        this.updateHidden();

        return;
    } // eo function updateValue
    // }}}
    // {{{
    /**
     * @return {Boolean} true = valid, false = invalid
     * calls validate methods of DateField and TimeField
     */
    ,validate:function() {
        return this.df.validate() && this.tf.validate();
    } // eo function validate
    // }}}
    // {{{
    /**
     * Returns renderer suitable to render this field
     * @param {Object} Column model config
     */
    ,renderer: function(field) {
        var format = field.editor.dateFormat || Ext.ux.form.DateTime.prototype.dateFormat;
        format += ' ' + (field.editor.timeFormat || Ext.ux.form.DateTime.prototype.timeFormat);
        var renderer = function(val) {
            var retval = Ext.util.Format.date(val, format);
            return retval;
        };
        return renderer;
    } // eo function renderer
    // }}}

}); // eo extend

// register xtype
Ext.reg('xdatetime', Ext.ux.form.DateTime);

//
// Patch http://www.extjs.com/forum/showthread.php?p=364787
//
Ext.lib.Anim = function() {
    var createAnim = function(cb, scope) {
        var animated = true;
        return {
            stop: function(skipToLast) {
                },
            isAnimated: function() {
                return animated;
            },
            proxyCallback: function() {
                animated = false;
                Ext.callback(cb, scope);
            }
        };
    };
    return {
        scroll: function(el, args, duration, easing, cb, scope) {
            var anim = createAnim(cb, scope);
            el = Ext.getDom(el);
            if (typeof args.scroll.to[0] == 'number') {
                el.scrollLeft = args.scroll.to[0];
            }
            if (typeof args.scroll.to[1] == 'number') {
                el.scrollTop = args.scroll.to[1];
            }
            anim.proxyCallback();
            return anim;
        },
        motion: function(el, args, duration, easing, cb, scope) {
            return this.run(el, args, duration, easing, cb, scope);
        },
        color: function(el, args, duration, easing, cb, scope) {
            var anim = createAnim(cb, scope);
            anim.proxyCallback();
            return anim;
        },
        run: function(el, args, duration, easing, cb, scope, type) {
            var anim = createAnim(cb, scope),
            e = Ext.fly(el, '_animrun');
            var o = {};
            for (var k in args) {
                switch (k) {
                case 'points':
                    var by,
                    pts;
                    e.position();
                    if (by = args.points.by) {
                        var xy = e.getXY();
                        pts = e.translatePoints([xy[0] + by[0], xy[1] + by[1]]);
                    } else {
                        pts = e.translatePoints(args.points.to);
                    }
                    o.left = pts.left;
                    o.top = pts.top;
                    if (!parseInt(e.getStyle('left'), 10)) {
                        e.setLeft(0);
                    }
                    if (!parseInt(e.getStyle('top'), 10)) {
                        e.setTop(0);
                    }
                    if (args.points.from) {
                        e.setXY(args.points.from);
                    }
                    break;
                case 'width':
                    o.width = args.width.to;
                    if (args.width.from)
                    e.setWidth(args.width.from);
                    break;
                case 'height':
                    o.height = args.height.to;
                    if (args.height.from)
                    e.setHeight(args.height.from);
                    break;
                case 'opacity':
                    o.opacity = args.opacity.to;
                    if (args.opacity.from)
                    e.setOpacity(args.opacity.from);
                    break;
                case 'left':
                    o.left = args.left.to;
                    if (args.left.from)
                    e.setLeft(args.left.from);
                    break;
                case 'top':
                    o.top = args.top.to;
                    if (args.top.from)
                    e.setTop(args.top.from);
                    break;
                case 'callback':
                case 'scope':
                    // jQuery can't handle callback and scope arguments
                    break;
                default:
                    o[k] = args[k].to;
                    if (args[k].from)
                    e.setStyle(k, args[k].from);
                    break;
                }
            }
            jQuery(el).animate(o, duration * 1000, undefined, anim.proxyCallback);
            return anim;
        }
    };
} ();

//
// Crud JS
//
var document_ready_for_tab_change = false;
var main_view;
var crud_panel;

var generic_loader = null;
var retain_generic_loder = false;
Ext.onReady(function() {
  generic_loader = new Ext.LoadMask(Ext.getBody(), { msg: t['loader_text'] });
  generic_loader.show();
  
    //
    // 1) Top tabs
    //
    var top_left_active_tab = false;
    var top_left_tabs = [];
    var top_right_active_tab = false;
    var top_right_tabs = [];
    $("#top ul > li ul").each(function(index, ul) {
        $(ul).remove();
    });
    $("#top .main > li ").each(function(index, li) {
        if (/active/.test(li.className)) {
            top_left_active_tab = index;
        }
        top_left_tabs[index] = {
            border: false,
            id: "main_" + index,
            title: li.getElementsByTagName("A")[0].innerHTML
        }
    });
    $("#top .right > li ").each(function(index, li) {
        if (/active/.test(li.className)) {
            top_right_active_tab = index;
        }
        top_right_tabs[index] = {
            border: false,
            id: "right_" + index,
            title: li.getElementsByTagName("A")[0].innerHTML
        }
    });

    //
    // 2) Main menu
    //
    var main_menu_left_active_tab = false;
    var main_menu_left_tabs = [];
    var main_menu_right_active_tab = false;
    var main_menu_right_tabs = [];
    var main_menu_left_text = "";

    $("#page #main_menu ul > li ul").each(function(index, ul) {
        $(ul).remove();
    });
    $("#page #main_menu .left > li ").each(function(index, li) {
        if (li.getElementsByTagName("A").length > 0) {
            if (/active/.test(li.className)) {
                main_menu_left_active_tab = main_menu_left_tabs.length;
            }
            main_menu_left_tabs[main_menu_left_tabs.length] = {
                border: false,
                id: "main_" + index,
                title: li.getElementsByTagName("A")[0].innerHTML
            }
        } else {
            main_menu_left_text += li.innerHTML.replace(/:$/,"");
        }
    });
    $("#page #main_menu .actions > li ").each(function(index, li) {
        if (li.getElementsByTagName("A").length > 0) {
            if (/active/.test(li.className)) {
                main_menu_right_active_tab = main_menu_right_tabs.length;
            }
            main_menu_right_tabs[main_menu_right_tabs.length] = {
                border: false,
                id: "right_" + index,
                title: li.getElementsByTagName("A")[0].innerHTML
            }
        }
    });
    $("#page #main_menu").each(function(index, menu) {
        $(menu).css("display", "none");
    });

    if (typeof(modify_main_menu) != "undefined") {
        main_menu_left_tabs = modify_main_menu(main_menu_left_tabs);
        main_menu_right_tabs = modify_main_menu(main_menu_right_tabs);
    }

    //
    // 3) Page content
    //
    var page_contents = {
        layout: 'hbox',
        flex: 1,
        border: false,
        bodyStyle: 'padding:15px',
        layoutConfig: {
            align: 'stretch',
            pack: 'start'
        },
        items: [{
            id: 'page-container',
            bodyStyle: main_menu_left_tabs.length + main_menu_right_tabs.length == 0 ? "" : "border-top: 0px",
            contentEl: 'page',
            flex: 1
        }]
    };

    if (typeof(extjs_body_items) != "undefined") {
        crud_panel = new Ext.Panel({
            layout: 'border',
            border: false,
            items: extjs_body_items(),
            flex: 1
        });

        page_contents = {
            id: "extjs_body_items",
            bodyStyle: 'padding:15px;',
            layout: 'hbox',
            flex: 1,
            border: false,
            layoutConfig: {
                align: 'stretch',
                pack: 'start'
            },
            items: [crud_panel]
        };
    }

    //
    // 4) Sidebar
    //
    if (typeof(extjs_sidebar_items) != "undefined") {
        page_contents.items[page_contents.items.length] = {
          html: '',
          border: false,
          width: 10,
          minSize: 10,
          maxSize: 10,
          bodyStyle: "background-color: rgb(223, 232, 246)",
        }
        page_contents.items[page_contents.items.length] = extjs_sidebar_items();
    } else if ($('#sidebar').html().replace(/[\r\n\s\t]/g, "").replace(/<.*?\>/g, "") != "") {
        page_contents.items[page_contents.items.length] = {
          html: '',
          border: false,
          width: 10,
          minSize: 10,
          maxSize: 10,
          bodyStyle: "background-color: rgb(223, 232, 246)",
        }
        page_contents.items[page_contents.items.length] = {
            border: false,
            margins: '2 0 5 5',
            width: 344,
            minSize: 344,
            maxSize: 344,
            id: 'sb',
            contentEl: 'sidebar'
        };
    }

    //
    // 5) Create main menu tabs
    //
    var main_menu_left_tab = new Ext.TabPanel({
        border: false,
        baseCls: 'x-tab-panel left',
        renderTo: 'top',
        activeTab: main_menu_left_active_tab,
        items: main_menu_left_tabs,
        listeners: {
            beforetabchange: function(tp, newTab, currentTab) {
                if (document_ready_for_tab_change) {
                    var mask = new Ext.LoadMask(Ext.getBody(), {
                        msg: t['loader_text']
                    });
                    mask.show();
                    var target_index = newTab.id.replace(/^main_/, "");
                    $("#page #main_menu .left > li ").each(function(index, li) {
                        if (index == target_index) {
                            window.location = li.getElementsByTagName("A")[0].href;
                        }
                    });
                    return false;
                }
            }
        }
    });

    var main_menu_right_tab = new Ext.TabPanel({
        border: false,
        baseCls: 'x-tab-panel right',
        renderTo: 'top',
        activeTab: main_menu_right_active_tab,
        items: main_menu_right_tabs,
        listeners: {
            beforetabchange: function(tp, newTab, currentTab) {
                if (document_ready_for_tab_change) {
                    var target_index = newTab.id.replace(/^right_/, "");
                    $("#page #main_menu .actions > li ").each(function(index, li) {
                        if (index == target_index) {
                          if (li.getElementsByTagName("A")[0].id == 'reorder_sections') {
                            TableTree.toggle($('table.list'), 'sections', li.getElementsByTagName("A")[0].href);
                            event.preventDefault();
                            return false;
													} else if (li.getElementsByTagName("A")[0].id == 'cache_clear_all') {
														generic_loader.show();
														var f = document.createElement('form'); 
														f.style.display = 'none'; 
														this.parentNode.appendChild(f); 
														f.method = 'POST'; 
														f.action = li.getElementsByTagName("A")[0].href;
														var m = document.createElement('input'); 
														m.setAttribute('type', 'hidden'); 
														m.setAttribute('name', '_method'); 
														m.setAttribute('value', 'delete'); 
														f.appendChild(m);
														var s = document.createElement('input'); 
														s.setAttribute('type', 'hidden'); 
														s.setAttribute('name', 'authenticity_token'); 
														s.setAttribute('value', window._auth_token); 
														f.appendChild(s);
														f.submit();
														return false;
                          } else {
                            var mask = new Ext.LoadMask(Ext.getBody(), {
                                msg: t['loader_text']
                            });
                            mask.show();
                            window.location = li.getElementsByTagName("A")[0].href;
                          }
                        }
                    });
                    return false;
                }
            }
        }
    });

    if (main_menu_left_text != "" || main_menu_left_tabs.length > 0 || main_menu_right_tabs.length > 0) {
        var column_items = [];
        // if (main_menu_left_text != "") {
        //     column_items[column_items.length] = {
        //         columnWidth: .1,
        //         id: 'main_menu_left_text',
        //         // bodyStyle: "height: 24px; overflow: hidden; background-color: rgb(223, 232, 246)",
        //         border: false,
        //         html: main_menu_left_text
        //     };
        // }
        if (main_menu_left_tabs != "") {
            column_items[column_items.length] = {
                // columnWidth: (main_menu_left_text != "" ? .9: 1),
                columnWidth: 1,
                border: false,
                items: main_menu_left_tab
            };
        }
        if (main_menu_right_tabs != "") {
            if (column_items.length > 0) {
                column_items[column_items.length - 1].columnWidth = .5;
                column_items[column_items.length] = {
                    // columnWidth: (main_menu_left_text != "" ? .4: .5),
                    columnWidth: .5,
                    border: false,
                    items: main_menu_right_tab
                };
            } else {
                column_items[column_items.length] = {
                    columnWidth: 1,
                    border: false,
                    items: main_menu_right_tab
                };
            }
        }

        if (main_menu_left_text!="") {
          page_contents.items[0] = {
              layout: 'vbox',
              flex: 1,
              title: main_menu_left_text,
              border: true,
              bodyStyle: "padding: 10px; background-color: rgb(223, 232, 246);",
              layoutConfig: {
                  align: 'stretch',
                  pack: 'start'
              },
              items: [{
                  minSize: 25,
                  maxSize: 25,
                  border: false,
                  items: [{
                      bodyStyle: "background-color: rgb(223, 232, 246);",
                      border: false,
                      layout: 'column',
                      items: column_items
                  }]
              },
              page_contents.items[0]
              ]
          };
        } else {
          page_contents.items[0] = {
              layout: 'vbox',
              flex: 1,
              border: false,
              layoutConfig: {
                  align: 'stretch',
                  pack: 'start'
              },
              items: [{
                  minSize: 25,
                  maxSize: 25,
                  border: false,
                  items: [{
                      bodyStyle: "background-color: rgb(223, 232, 246)",
                      border: false,
                      layout: 'column',
                      items: column_items
                  }]
              },
              page_contents.items[0]
              ]
          };
        }
    }

    //
    // 6) Combine it all
    //
    main_view = new Ext.Viewport({
        layout: 'border',
        title: t['page']['title'],
        items: [{
            border: false,
            xtype: 'box',
            region: 'north',
            contentEl: 'headerding',
            height: 30
        }, {
            border: false,
            layout: 'vbox',
            region: 'center',
            layoutConfig: {
                align: 'stretch',
                pack: 'start'
            },
            items: [{
                border: false,
                contentEl: 'header'
            },{
                border: false,
                layout: 'column',
                items: [{
                    columnWidth: .70,
                    border: false,
                    items: [
                    new Ext.TabPanel({
                        border: false,
                        baseCls: 'x-tab-panel left',
                        renderTo: 'top',
                        activeTab: top_left_active_tab,
                        items: top_left_tabs,
                        listeners: {
                            beforetabchange: function(tp, newTab, currentTab) {
                                if (document_ready_for_tab_change) {
                                    var mask = new Ext.LoadMask(Ext.getBody(), {
                                        msg: t['loader_text']
                                    });
                                    mask.show();
                                    var target_index = newTab.id.replace(/^main_/, "");
                                    $("#top .main > li ").each(function(index, li) {
                                        if (index == target_index) {
                                            window.location = li.getElementsByTagName("A")[0].href;
                                        }
                                    });
                                    return false;
                                }
                            }
                        }
                    })
                    ]
                }, {
                    columnWidth: .30,
                    border: false,
                    items: [
                    new Ext.TabPanel({
                        border: false,
                        baseCls: 'x-tab-panel right',
                        renderTo: 'top',
                        activeTab: top_right_active_tab,
                        items: top_right_tabs,
                        listeners: {
                            beforetabchange: function(tp, newTab, currentTab) {
                                if (document_ready_for_tab_change) {
                                    var mask = new Ext.LoadMask(Ext.getBody(), {
                                        msg: t['loader_text']
                                    });
                                    mask.show();
                                    var target_index = newTab.id.replace(/^right_/, "");
                                    $("#top .right > li ").each(function(index, li) {
                                        if (index == target_index) {
                                            window.location = li.getElementsByTagName("A")[0].href;
                                        }
                                    });
                                    return false;
                                }
                            }
                        }
                    })
                    ]
                }]
            },
            page_contents
            ]
        }],
        renderTo: Ext.getBody()
    });
    
    var form = document.getElementsByTagName("form");
    if (form.length == 1) {
      var form = form[0];
      
      //
      // Form overnemen in body
      //
      var f2 = document.body.appendChild(document.createElement("form"));
      for( var x = 0; x < form.attributes.length; x++ ) {
        f2.setAttribute(form.attributes[x].nodeName, form.attributes[x].nodeValue);
      }

      //
      // Form verwijderen en child-elementen uit form verplaatsen
      //
      var cnt = $(form).contents();
      $(form).replaceWith(cnt);
      
      //
      // Body in nieuw form zetten
      //
      $.each(
        $("body > div"),
        function(index, item) {
          f2.appendChild(item);
        }
      );
    }
    
    document_ready_for_tab_change = true;
    if (!retain_generic_loder) {
      generic_loader.hide();
    }
});

var store;
var grid;
var editor;

var record_definition;
var article_add_mode = false;
var empty_crud_detail;
var crud_columns;
var crud_options;
var add_record_path;
var page_size = 10;
var selected_record;
var pagingtoolbar;
var initial_load_started = false;

function init_lico_adva_crud(options) {
    retain_generic_loder = true;
    crud_columns = options["columns"];
    crud_options = options;
    add_record_path = options["add_record_path"];

    init_crud_store();
    init_crud_editor();
    init_record_definition();

    Ext.onReady(function() {
        if (!initial_load_started) {
            initial_load_started = true;
            store.load({
                params: {
                    start: 0,
                    limit: page_size
                }
            });
        }
    });

    return init_crud_grid();
}

//
// Store
//
function init_crud_store() {
    store = new Ext.data.GroupingStore({
        // url: crud_options["store"]["url"],
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            prettyUrls: false,
            url: crud_options["store"]["url"]
        }),
        baseParams: {
            // authenticity_token: window._auth_token
            },
        remoteSort: false,
		remoteGroup: false,
		groupField: crud_options["store"]["group"],
        reader: new Ext.data.XmlReader(
        {
            id: 'id',
            record: 'record',
            totalRecords: 'results'
        },
        store_columns()
        ),
        sortInfo: {
            field: crud_options["store"]["sort"]["by"],
            direction: crud_options["store"]["sort"]["order"]
        }
    });
    store.on('load', function() {
      generic_loader.hide();
      parse_action();
    });
}

function parse_action () {
  var hash = window.location.hash;
  if (hash == "#new") {
    add_record();
  } else if (/#\d*/.test(hash)) {
    target_id = hash.replace(/\#/,"");
    target_row = 0;
    target_record = false;
    store.each(function(obj, index) {
        if (parseInt(obj.id) == target_id) {
            target_row = index;
            target_record = obj;
        }
    });
    grid.getSelectionModel().selectRecords([target_record]);
  }
}

function store_columns() {
    //
    // De kolommen die we kunnen gebruiken in de store
    // bevatten een naam en een type zoals deze in de
    // XML voorkomen. Een type 'combo' heeft hier dus
    // geen zin
    //
    var _columns = new Array();
    $.each(
    crud_columns,
    function(index, column) {
        var columndef = {
            name: column["name"]
        };
        if (jQuery.inArray(column["type"], ['date', 'boolean']) > -1) {
            columndef["type"] = column["type"];
        }
        _columns[_columns.length] = columndef;
    }
    );
    return _columns;
}

//
// Inline editor
//
function init_crud_editor() {
    editor = new Ext.ux.grid.RowEditor({
        saveText: t['save_text'],
        cancelText: t['cancel_text']
    });

    editor.on({
        'validateedit': {
            fn: function() {
                save_new_record();
            }
        },
        'afteredit': {
            fn: function() {
                if (!article_add_mode) {
                    store.reload();
                }
            }
        }
    });
}
var hidden_columns = new Array();

function add_record() {
    var record = new record_definition({});
    editor.stopEditing();
    hidden_columns = new Array();
    store.insert(0, record);
    $.each(
    grid.getColumnModel().columns,
    function(index, column) {
        if (grid.getColumnModel().isCellEditable(index, 0) && grid.getColumnModel().isHidden(index)) {
            hidden_columns[hidden_columns.length] = index;
            grid.getColumnModel().setHidden(index, false);
        }
    }
    );
    grid.getView().refresh(false);
    editor.startEditing(0);
}

function save_new_record() {
    article_add_mode = true;

    var mask = new Ext.LoadMask(Ext.getBody(), {
        msg: t['loader_text']
    });
    mask.show();

    //
    // Parameters submit verzamelen op basis
    // van submit_value in options
    //
    var parameters = {
        authenticity_token: window._auth_token
    }
    $.each(
    crud_columns,
    function(index, column) {
        if (column["submit_value"] + "" != "undefined") {
            var elementid = "add_" + column["submit_value"].replace(/\]/g, "").replace(/\[/g, "_");
            if (document.getElementById(elementid) && document.getElementById(elementid).value != "" && document.getElementById(elementid).value != "undefined") {
                parameters[column["submit_value"]] = document.getElementById(elementid).value;
            }
        }
    }
    );
    if (crud_options['add_record_post']) {
        $.each(
        crud_options['add_record_post'],
        function(index, item) {
            parameters[item.key] = item.value;
        }
        );
    }

    $.post(add_record_path, parameters,
    function(responseText) {
        article_add_mode = false;
        responseText = responseText.replace(/[\r\n]/g, "").replace(/.*?(<div class="errorExplanation".*?<\/div>).*/, "$1");
        if (/errorExplanation/.test(responseText)) {
            //
            // Submit mislukt
            //
            mask.hide();
            Ext.Msg.show({
                title: t['error_title'],
                msg: responseText,
                buttons: {
                    ok: t['ok_text']
                },
                icon: Ext.MessageBox.WARNING
            });
            editor.startEditing(0);
        } else {
            //
            // Submit gelukt
            //
            if (typeof(post_submit) != "undefined") {
                post_submit("add",
                function() {
                    store.reload({
                        callback: function() {
                            mask.hide();

                            //
                            // Nieuwste record in grid selecteren
                            //
                            target_row = 0;
                            max_id = 0;
                            target_record = false;
                            store.each(function(obj, index) {
                                if (parseInt(obj.id) > max_id) {
                                    max_id = parseInt(obj.id);
                                    target_row = index;
                                    target_record = obj;
                                }
                            });
                            grid.getSelectionModel().selectRecords([target_record]);
                        }
                    });
                });
            } else {
                store.reload({
                    callback: function() {
                        mask.hide();

                        //
                        // Nieuwste record in grid selecteren
                        //
                        target_row = 0;
                        max_id = 0;
                        target_record = false;
                        store.each(function(obj, index) {
                            if (parseInt(obj.id) > max_id) {
                                max_id = parseInt(obj.id);
                                target_row = index;
                                target_record = obj;
                            }
                        });
                        grid.getSelectionModel().selectRecords([target_record]);
                    }
                });
            }
        }
    });
}

function save_current_record() {
    var mask = new Ext.LoadMask(Ext.getBody(), {
        msg: t['loader_text']
    });
    mask.show();

    var cell = grid.getSelectionModel().getSelected();
    var id = cell.id;

    //
    // Parameters submit verzamelen op basis
    // van submit_value in options
    //
    var parameters = {
        authenticity_token: window._auth_token,
        _method: 'put'
    }

    parameters = crud_options.show["custom_form_values"](parameters),

    $.post(crud_options.edit.url.replace(/\!recordid\!/, id), parameters,
    function(responseText) {
        article_add_mode = false;
        responseText = responseText.replace(/[\r\n]/g, "").replace(/.*?(<div class="errorExplanation".*?<\/div>).*/, "$1");
        if (/errorExplanation/.test(responseText)) {
            //
            // Submit mislukt
            //
            mask.hide();
            Ext.Msg.show({
                title: t['error_title'],
                msg: responseText,
                buttons: {
                    ok: t['ok_text']
                },
                icon: Ext.MessageBox.WARNING
            });
        } else {
            //
            // Submit gelukt
            //
            if (typeof(post_submit) != "undefined") {
                post_submit("edit",
                function() {
                    document.getElementById('crud_detail').innerHTML = empty_crud_detail;
                    crud_panel.setSize("99%", "99%");
                    crud_panel.setSize("100%", "100%");
                    selected_record = null;
                    grid.getSelectionModel().clearSelections();
                    store.reload({
                        callback: function() {
                            mask.hide();
                        }
                    });
                });
            } else {
                document.getElementById('crud_detail').innerHTML = empty_crud_detail;
                crud_panel.setSize("99%", "99%");
                crud_panel.setSize("100%", "100%");
                selected_record = null;
                grid.getSelectionModel().clearSelections();
                store.reload({
                    callback: function() {
                        mask.hide();
                    }
                });
            }
        }
    });
}

function init_record_definition() {
    var _columns = new Array();
    $.each(
    crud_columns,
    function(index, column) {
        var columndef = {
            name: column["name"],
            type: column["type"]
        };
        _columns[_columns.length] = columndef
    }
    );
    record_definition = Ext.data.Record.create(_columns);
}

//
// Grid
//
function init_crud_grid() {
    var toolbar_items = [];
    if (add_record_path) {
        toolbar_items[toolbar_items.length] = {
            text: t['new_text'],
            iconCls: 'silk-add',
            handler: function(btn, ev) {
                add_record();
            },
            scope: this
        };
    }
    if (typeof(extjs_toolbar_items) != "undefined") {
      $.each(
        extjs_toolbar_items(),
        function(index, item) {
          toolbar_items[toolbar_items.length] = item;
        }
      )
    }

    pagingtoolbar = new Ext.PagingToolbar({
        pageSize: page_size,
        store: store,
        hidden: true
    }),
    grid = new Ext.grid.EditorGridPanel({
        store: store,
        loadMask: true,
        iconCls: 'silk-grid',
        plugins: [editor],
        tbar: toolbar_items.length > 0 ? toolbar_items : null,

        view: new Ext.grid.GroupingView({
            forceFit: true,
			startCollapsed: crud_options["grid"].start_collapsed
        }),

        colModel: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true,
                groupable: true
            },

            columns: grid_columns()
        }),

        viewConfig: {
            forceFit: true
            //,
            // getRowClass: function(record, index) {
            //  var c = record.get('change');
            //  if (c < 0) {
            //    return 'price-fall';
            //  } else if (c > 0) {
            //    return 'price-rise';
            //  }
            // }
        },

        bbar: pagingtoolbar,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        bodyStyle: toolbar_items.length > 0 ? "border-top: 0px" : "",
        region: 'center'
    });

    grid.getSelectionModel().on('rowselect',
    function(sm, rowIdx, r) {
        if (editor.editing) {
            editor.stopEditing(false);
            store.reload();
        } else {
            show_record_details(r.id);
        }
    });

	if (crud_options["grid"]["show_detail_panel"] === false) {
	    return [
	    	grid
	    ];
	} else {
		return [
	    grid,
	    {
	        id: 'crud_detail',
	        region: 'south',
	        bodyStyle: {
	            background: '#ffffff',
	            padding: '7px'
	        },
	        html: crud_options["grid"].empty_details
	    }
	    ];
	}
}

function grid_columns() {
    var _columns = new Array();
    $.each(
    crud_columns,
    function(index, column) {
        var columndef = {
            header: column["label"],
            dataIndex: column["name"],
			hidden: column["hidden"]
        };

        if (column["submit_value"] + "" != "undefined") {
            columndef.editor = {
                fieldLabel: columndef.name,
                name: columndef.dataIndex,
                id: "add_" + column["submit_value"].replace(/\]/g, "").replace(/\[/g, "_")
            }
        }

        if (column["type"] + "" == "date") {
            columndef.xtype = 'datecolumn';
            columndef.format = 'd M Y';

            if (columndef.editor) {
                columndef.editor.xtype = 'datefield'
                columndef.editor.format = 'd M Y';
            }
        }

        if (column["type"] + "" == "datetime") {
            column.xtype = 'textfield';
            if (columndef.editor) {
              columndef.editor.xtype = 'xdatetime';
              columndef.editor.timeFormat = 'H:i';
              columndef.editor.timeConfig = {
                altFormats:'H:i',
                allowBlank:true    
              };
              columndef.editor.dateFormat = 'd.n.Y';
              columndef.editor.dateConfig = {
                altFormats:'Y-m-d|Y-n-d',
                allowBlank:true    
              };
            }
        }

        if (column["type"] + "" == "password") {
            columndef.hidden = true;
            columndef.renderer = function(value, metaData, record, rowIndex, colIndex, store) {
                return "";
            }
            if (columndef.editor) {
                columndef.editor.inputType = 'password'
            }
        }

        if (column["type"] + "" == "boolean") {
            columndef.renderer = function(value, metaData, record, rowIndex, colIndex, store) {
                return value == "1" ? t['boolean_true'] : t['boolean_false'];
            }
        }

        if (column["type"] + "" == "combo" && columndef.editor) {
            columndef.editor.id = "add_combo_" + column["submit_value"].replace(/\]/g, "").replace(/\[/g, "_");
            columndef.editor.xtype = 'combo';
            columndef.editor.fieldLabel = 'Redacteur';
            columndef.editor.name = column["submit_value"].replace(/\]/g, "").replace(/\[/g, "_");
            columndef.editor.valueField = column.combo.value;
            columndef.editor.displayField = column.combo.label;
            columndef.editor.store = column.combo.store;
            columndef.editor.mode = 'local';
            columndef.editor.hiddenName = "add_" + column["submit_value"].replace(/\]/g, "").replace(/\[/g, "_");
            columndef.editor.hiddenId = "add_" + column["submit_value"].replace(/\]/g, "").replace(/\[/g, "_");
        }

        _columns[_columns.length] = columndef
    }
    );
    return _columns;
}

//
// Details
//
function show_record_details(id) {
	if (crud_options.show["custom_show_action"] + "" != "undefined") {
        if (!crud_options.show["custom_show_action"](id)) {
			return;
		}
    }
    if (!empty_crud_detail && document.getElementById('crud_detail')) {
        empty_crud_detail = document.getElementById('crud_detail').innerHTML;
    }

    var mask = new Ext.LoadMask('crud_detail', {
        msg: t['loader_text']
    });
    mask.show();

    $.get(crud_options.show.url.replace(/\!recordid\!/, id) + ".xml",
    function(doc) {

        var record = doc.getElementsByTagName("record")[0];

        if (typeof(load_custom_stores) != "undefined") {
            load_custom_stores();
        }

        var form_buttons = [];
				var allow_save = true;
        if (crud_options && crud_options.edit && crud_options.edit.allow_save) {
					allow_save = crud_options.edit.allow_save(record);
				}
				
				if (allow_save) {
					var form_buttons = [
	        {
	            text: 'Opslaan',
	            iconCls: 'silk-accept',
	            handler: function(btn, ev) {
	                if (grid.getSelectionModel().hasSelection()) {
	                    save_current_record();
	                }
	            },
	            scope: this
	        }
	        ];
				}

        if (crud_options.edit && crud_options.edit.custom_actions) {
            $.each(
	            crud_options.edit.custom_actions(doc),
	            function(index, action) {
	                form_buttons[form_buttons.length] = action
	            }
            );
        }

        if (crud_options && crud_options.destroy && crud_options.destroy.url) {
            form_buttons[form_buttons.length] = {
                text: 'Verwijderen',
                iconCls: 'silk-delete',
                handler: function(btn, ev) {
                    if (grid.getSelectionModel().hasSelection()) {
                        var cell = grid.getSelectionModel().getSelected();
                        delete_record(cell.id);
                    }
                },
                scope: this
            };
        }

        var form = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'record_edit_form',
            title: t['edit_text'],
            border: false,
            bodyStyle: 'padding: 5px; padding-bottom: 0px;',

            items: form_items(record),

            buttons: form_buttons
        });

        document.getElementById('crud_detail').innerHTML = '';
        form.render('crud_detail');
        crud_panel.setSize("99%", "99%");
        crud_panel.setSize("100%", "100%");
        mask.hide();
    },
    "xml");
}

function form_items(record) {
    selected_record = record;
    if (crud_options.show["custom_form"] + "" != "undefined") {
        return crud_options.show["custom_form"](record);
    } else {

    }
}

// function crud_show_height () {
//   return 420;
// }
function xmlvalue(element, value) {
  if (element.getElementsByTagName(value).length > 0 && element.getElementsByTagName(value)[0].childNodes.length > 0) {
    var target = element.getElementsByTagName(value)[0];
    var data = "";
    for (var c=0; c<target.childNodes.length; c++) {
      data += target.childNodes[c].nodeValue;
    }
    return data;
  }
}

//
// Delete
//
function delete_record(id) {
    Ext.Msg.show({
        id: 'delete_confirm',
        title: t['delete_title'],
        msg: crud_options.destroy.message,
        buttons: {
            ok: t['delete_text'],
            cancel: t['cancel_text']
        },
        icon: Ext.MessageBox.WARNING,
        fn: function(btn) {
            if (btn == "ok") {
                var mask = new Ext.LoadMask(Ext.getBody(), {
                    msg: t['loader_text']
                });
                mask.show();

                $.ajax({
                    url: crud_options.destroy.url.replace(/!recordid!/, id),
                    cache: false,
                    data: {
                        authenticity_token: window._auth_token,
                        _method: 'delete'
                    },
                    type: 'POST',
                    success: function(html) {
											if (crud_options.destroy.reload_page_after_destroy) {
												window.location = window.location
											} else {
                        document.getElementById('crud_detail').innerHTML = empty_crud_detail;
                        crud_panel.setSize("99%", "99%");
                        crud_panel.setSize("100%", "100%");
                        selected_record = null;
                        store.reload();
                        mask.hide();
											}
                    }
                });
            }
        }
    });
}

Ext.data.CrudReader = function() {
    Ext.data.XmlReader.superclass.constructor.call(this);
};
var __last_xhr_result = false;
Ext.extend(Ext.data.CrudReader, Ext.data.DataReader, {
  read: function(response) {
    var errormessage = strip_error_from_response(response);
    __last_xhr_result = response.responseText ? response.responseText : response;
    return {
      success: errormessage == "",
      failure: errormessage != "",
      records: [],
    };
  }
});
function strip_error_from_response (response) {
  if (response.responseText) {
    return response.responseText.replace(/[\r\n]/g,"").replace(/^.*<div id="error_messages_for">/,"").replace(/<\/div>.*$/,"</div>").replace(/^<\/div>$/,"")
  } else {
    return response.replace(/[\r\n]/g,"").replace(/^.*(<div.*?id="errorExplanation">)/,"$1").replace(/<\/div>.*$/,"</div>").replace(/^<\/div>$/,"")
  }
}