/**
 * Created by Ayalala on 2015/9/18.
 */
var lyp = $.extend({},lyp);

$(function(){
    lyp.sp = function(){
        var curPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curPath.indexOf(pathName);
        var localhostPath = curPath.substring(0,pos);
        var projectPath = pathName.substring(0,pathName.substr(1).indexOf('/') + 1);
        return (localhostPath + projectPath);
    };

    /**
     * 增加formatString功能
     * @author Ayalala
     * @example sy.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
     * @returns 格式化后的字符串
     */
    lyp.formatString = function(str) {
        for (var i = 0; i < arguments.length - 1; i++) {
            str = str.replace("{" + i + "}", arguments[i + 1]);
        }
        return str;
    };

    /**
     * 更换主题
     *
     * @author 孙宇
     * @requires jQuery,EasyUI
     * @param themeName
     */
    lyp.changeTheme = function(themeName) {
        var $easyuiTheme = $('#easyuiTheme');
        var url = $easyuiTheme.attr('href');
        var href = url.substring(0, url.indexOf('themes')) + 'themes/' + themeName + '/easyui.css';
        $easyuiTheme.attr('href', href);

        var $iframe = $('iframe');
        if ($iframe.length > 0) {
            for (var i = 0; i < $iframe.length; i++) {
                var ifr = $iframe[i];
                try {
                    $(ifr).contents().find('#easyuiTheme').attr('href', href);
                } catch (e) {
                    try {
                        ifr.contentWindow.document.getElementById('easyuiTheme').href = href;
                    } catch (e) {
                    }
                }
            }
        }

        lyp.cookie('easyuiTheme', themeName, {
            expires : 7
        });
    };

    lyp.cookie = function(key, value, options) {
        if (arguments.length > 1 && (value === null || typeof value !== "object")) {
            options = $.extend({}, options);
            if (value === null) {
                options.expires = -1;
            }
            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }
            return (document.cookie = [ encodeURIComponent(key), '=', options.raw ? String(value) : encodeURIComponent(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : '' ].join(''));
        }
        options = value || {};
        var result, decode = options.raw ? function(s) {
            return s;
        } : decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    };

    lyp.getCookie= function(cookie_name)
    {
        var allcookies = document.cookie;
        var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度
        // 如果找到了索引，就代表cookie存在，
        // 反之，就说明不存在。
        if (cookie_pos != -1)
        {
            // 把cookie_pos放在值的开始，只要给值加1即可。
            cookie_pos += cookie_name.length + 1;      //这里我自己试过，容易出问题，所以请大家参考的时候自己好好研究一下。。。
            var cookie_end = allcookies.indexOf(";", cookie_pos);
            if (cookie_end == -1)
            {
                cookie_end = allcookies.length;
            }
            var value = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到你想要的cookie的值了。。。
        }
        return value;
    };

    /**
     * @author Ayalala
     * 增加命名空间功能
     * 使用方法：sy.ns('jQuery.bbb.ccc','jQuery.eee.fff');
     */
    lyp.ns = function() {
        var o = {}, d;
        for (var i = 0; i < arguments.length; i++) {
            d = arguments[i].split(".");
            o = window[d[0]] = window[d[0]] || {};
            for (var k = 0; k < d.slice(1).length; k++) {
                o = o[d[k + 1]] = o[d[k + 1]] || {};
            }
        }
        return o;
    };

    /**
     * 创建一个模式化的dialog
     * @author Ayalala
     * @requires jQuery,EasyUI
     */
    lyp.modalDialog = function(options) {
        var opts = $.extend({
            title : '&nbsp;',
            width : 640,
            height : 480,
            modal : true,
            onClose : function() {
                $(this).dialog('destroy');
            }
        }, options);
        opts.modal = true;// 强制此dialog为模式化，无视传递过来的modal参数
        if (options.url) {
            opts.content = '<iframe id="" src="' + options.url + '" allowTransparency="true" scrolling="auto" width="100%" height="98%" frameBorder="0" name=""></iframe>';
        }
        return $('<div/>').dialog(opts);
    };

    /**
     * 将form表单元素的值序列化成对象
     * @example sy.serializeObject($('#formId'))
     * @author Ayalala
     * @requires jQuery
     * @returns object
     */
    lyp.serializeObject = function(form) {
        var o = {};
        $.each(form.serializeArray(), function(index) {
            if (this['value'] != undefined && this['value'].length > 0) {// 如果表单项的值非空，才进行序列化操作
                if (o[this['name']]) {
                    o[this['name']] = o[this['name']] + "," + this['value'];
                } else {
                    o[this['name']] = this['value'];
                }
            }
        });
        return o;
    };

    /**
     * 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
     * @author Ayalala
     * @returns list
     */
    lyp.stringToList = function(value) {
        if (value != undefined && value != '') {
            var values = [];
            var t = value.split(',');
            for (var i = 0; i < t.length; i++) {
                values.push('' + t[i]);/* 避免他将ID当成数字 */
            }
            return values;
        } else {
            return [];
        }
    };

    /**
     * JSON对象转换成String
     * @param o
     * @returns
     */
    lyp.jsonToString = function(o) {
        var r = [];
        if (typeof o == "string")
            return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o == "object") {
            if (!o.sort) {
                for ( var i in o)
                    r.push(i + ":" + sy.jsonToString(o[i]));
                if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}";
            } else {
                for (var i = 0; i < o.length; i++)
                    r.push(sy.jsonToString(o[i]));
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString();
    };

    /**
     * 去字符串空格
     * @author Ayalala
     */
    lyp.trim = function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    };
    lyp.ltrim = function(str) {
        return str.replace(/(^\s*)/g, '');
    };
    lyp.rtrim = function(str) {
        return str.replace(/(\s*$)/g, '');
    };

    /**
     * 判断开始字符是否是XX
     * @author Ayalala
     */
    lyp.startWith = function(source, str) {
        var reg = new RegExp("^" + str);
        return reg.test(source);
    };

    /**
     * 判断结束字符是否是XX
     * @author 孙宇
     */
    lyp.endWith = function(source, str) {
        var reg = new RegExp(str + "$");
        return reg.test(source);
    };

    /**
     * iframe自适应高度
     * @author Ayalala
     * @param iframe
     */
    lyp.autoIframeHeight = function(iframe) {
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
    };

    /**
     * 滚动条
     *
     * @author 孙宇
     * @requires jQuery,EasyUI
     */
    lyp.progressBar = function(options) {
        if (typeof options == 'string') {
            if (options == 'close') {
                $('#syProgressBarDiv').dialog('destroy');
            }
        } else {
            if ($('#syProgressBarDiv').length < 1) {
                var opts = $.extend({
                    title : '&nbsp;',
                    closable : false,
                    width : 300,
                    height : 60,
                    modal : true,
                    content : '<div id="syProgressBar" class="easyui-progressbar" data-options="value:0"></div>'
                }, options);
                $('<div id="syProgressBarDiv"/>').dialog(opts);
                $.parser.parse('#syProgressBarDiv');
            } else {
                $('#syProgressBarDiv').dialog('open');
            }
            if (options.value) {
                $('#syProgressBar').progressbar('setValue', options.value);
            }
        }
    };
    /**
     * 设置iframe高度
     * @author Ayalala
     * @param iframe
     */
    lyp.setIframeHeight = function(iframe, height) {
        iframe.height = height;
    };
    /**
     * 扩展datagrid的datetimebox
     * @author Ayalala
     */
    $.extend($.fn.datagrid.defaults.editors, {
        datetimebox: {
            init: function(container, options){
                var editor = $('<input />').appendTo(container);
                options.editable = false;
                editor.datetimebox(options);
                return editor;
            },
            getValue: function(target){
                return $(target).datetimebox('getValue');
            },
            setValue: function(target, value){
                $(target).datetimebox('setValue',value);
            },
            resize: function(target, width){
                $(target).datetimebox('resize',width);
            },
            destroy:function(target){
                $(target).datetimebox('destroy');
            }
        }
    });
    /**
     * 扩展datagrid的方法: 某列增加/移除编辑状态
     * @author Ayalala
     */
    $.extend($.fn.datagrid.methods, {
       addEditor:function(jq,param)
       {
            if(param instanceof Array)
            {
                $.each(param,function(index,item){
                    var e = $(jq).datagrid('getColumnOption',item.field);
                    e.editor = item.editor;
                });
            }else{
                var e = $(jq).datagrid('getColumnOption',param.field);
                e.editor = param.editor;
            }
       },
       removeEditor:function(jq,param)
       {
           if(param instanceof Array)
           {
               $.each(param,function(index,item){
                   var e = $(jq).datagrid('getColumnOption',item);
                   e.editor = {};
               });
           }else{
               var e = $(jq).datagrid('getColumnOption',param);
               e.editor = {};
           }
       }
    });
});
