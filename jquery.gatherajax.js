;
(function ($) {
    $.gatherajax = {};

    $.gatherajax.defaults = {
        name: null, // String : for method_name
        url_base: "", // String : for all_ajax url base
        add_type: {
            add: {},
            edit: {},
            del: {}
        }, // Object for add execute method name and inside type you can add option for $.ajax
        type_base: "POST", // String : for all_ajax request method
        dataType_base: "JSON", // String : for return dataType
        success_base: null, // function(res) : for all_ajax success callback method without set by inside add_type
        error_base: null                         // function() : for all_ajax error callback method without set by inside add_type
    };

    $.gatherajax.defaults_type = {
        url: "",
        type: "",
        data: null,
        dataType: null
    };

    $.gatherajax.defaults_trigger = {
        name: null,
        trigger_type: {
            /*add  : {
             seletor   : ".add" , String : for trigger dom select if null or no object selector is ".{name}_add" when trigger_dom_type is "class"
             event     : "click" , String : for trigger dom's hook event you can select from $(dom).on event
             pre_tri   : function(dom , method) , function : for function execute before ajax , dom is trigger dom
             data      : {
             id   : 1 ,
             name : function(){return $.gatherajax.this_dom.val()} // $.gatherajax.this is triggered dom
             },
             success_func : function(res) ,
             error_func   : function(res) ,
             } ,
             edit : {} ,
             del  : {} ,
             */
        },
        trigger_dom_type: "class", // String : for trigger common dom type ["id" , "class" , other]
        trigger_event_base: "click", // String : for trigger common dom's hook event you can select from $(dom).on event
        pre_tri_base: null     // function(dom , method) : for function execute before ajax , dom is trigger dom , method is ajax_method_name eg.add,edit,del
    }

    $.gatherajax.add_trigger = function (options) {
        var tri_settings = $.extend({}, $.gatherajax.defaults_trigger, options);
        var name = tri_settings["name"];
        if (!name) {
            console.error("no name");
            throw new Error();
        }
        $.each(tri_settings.trigger_type, function (key, type_obj) {
            if (!$.gatherajax[name][key]) {
                console.error(key + " method is not defined!");
                throw new Error();
            }
            var defaultSetting = {
                selector : function() {
                    switch (tri_settings.trigger_dom_type) {
                        case "class":
                            return "." + name + "_" + key;
                        case "id":
                            return "#" + name + "_" + key;
                        default:
                            return "[" + tri_settings.trigger_dom_type + "='" + name + "_" + key + "']";
                    }
                }(),
                event : tri_settings.trigger_event_base,
                pre_tri : null,
                success_func : null,
                error_func : null,
                data : null
            };
            var tmp_obj = $.extend({}, defaultSetting, type_obj);

            if (tri_settings.pre_tri_base && !tmp_obj.pre_tri) {
                tmp_obj.pre_tri = tri_settings.pre_tri_base;
            }

            $(document).on(tmp_obj.event, tmp_obj.selector, function (e) {
                e.preventDefault();
                $.gatherajax.this_dom = $(this);
                var result = true;
                if (tmp_obj.pre_tri) {
                    result = tmp_obj.pre_tri($(this), key);
                }
                var data = tmp_obj.data;
                if (typeof(data) == "function") {
                    data = data();
                }
                if (result) {
                    $.gatherajax[name][key]["execute"](data, tmp_obj.success_func, tmp_obj.error_func);
                }
            });
        });
    };

    $.gatherajax.__construct = function (options) {
        var settings = $.extend({}, $.gatherajax.defaults, options);
        if (!settings.name) {
            console.error("no name");
            return false;
        }
        $.gatherajax[settings.name] = {};
        $.each(settings.add_type, function (key, type_obj) {
            settings.add_type[key] = $.extend({}, $.gatherajax.defaults_type, type_obj);
            var tmp_obj = settings.add_type[key];

            if (settings.type_base && !tmp_obj.type) {
                tmp_obj.type = settings.type_base;
            }
            if (settings.type_base && !tmp_obj.dataType) {
                tmp_obj.dataType = settings.dataType_base;
            }
            if (!tmp_obj.url) {
                tmp_obj.url = settings.url_base + "/" + key;
            }

            $.gatherajax[settings.name][key] = tmp_obj;

            $.gatherajax[settings.name][key]["execute"] = function (data, done, fail) {
                var ajax_option = $.extend({}, $.gatherajax[settings.name][key], {data: data});
                if (settings.success_base && !done) {
                    done = settings.success_base;
                }
                if (settings.error_base && !fail) {
                    fail = settings.error_base;
                }
                return $.ajax(ajax_option).done(done).fail(fail);
            };
        });
    };

    $.gatherajax.construct = $.gatherajax.__construct;

    $.gatherajax.set = function (name, key, param) {
        if (!$.gatherajax[name]) {
            console.error("no name");
        }
        $.gatherajax[name][key] = param;
    };

})(jQuery);