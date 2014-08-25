;(function($) {
  $.gatherajax = {};

  $.gatherajax.defaults = {
    name          : null                          , // String : for method_name
    url_base      : ""                          , // String : for all_ajax url base
    add_type      : {
      add  : {} ,
      edit : {} ,
      del  : {} , 
    }                                           , // Object for add execute method name and inside type you can add option for $.ajax                                
    type_base         : "POST"                      , // String : for all_ajax request method
    dataType_base     : "JSON"                      , // String : for return dataType
    success_base      : null                        , // function(res) : for all_ajax success callback method without set by inside add_type
    error_base        : null                        , // function() : for all_ajax error callback method without set by inside add_type
  };

  $.gatherajax.defaults_type = {
    url     : ""   ,
    type    : ""   ,
    data    : null ,
    dataType: null ,
    success : null ,
    error   : null ,
  };

  $.gatherajax.defaults_trigger = {
    name         : null ,
    trigger_type : {
      /*add  : {
        seletor   : ".add" , String : for trigger dom select if null or no object selector is ".{name}_add" when trigger_dom_type is "class"
        event     : "click" , String : for trigger dom's hook event you can select from $(dom).on event
        pre_tri   : function(dom , method) , function : for function execute before ajax , dom is trigger dom
        after_tri : function(dom , method) , function : for function execute after ajax , dom is trigger dom
        data      : {
          id   : 1 ,
          name : function(){return $.gatherajax.this.val()} // $.gatherajax.this is triggered dom
        }
      } ,
      edit : {} ,
      del  : {} ,
      */
    } ,
    trigger_dom_type   : "class" , // String : for trigger common dom type ["id" , "class" , other] 
    trigger_event_base : "click" , // String : for trigger common dom's hook event you can select from $(dom).on event
    pre_tri_base       : null    , // function(dom , method) : for function execute before ajax , dom is trigger dom , method is ajax_method_name eg.add,edit,del if return false then ajax is not executed and return some value (maybe true) ajax is executed
    after_tri_base     : null    , // function(dom , method) : for function execute after ajax , dom is trigger dom
  }

  $.gatherajax.add_trigger = function(options){
    var tri_settings = $.extend({} , $.gatherajax.defaults_trigger, options );
    if(tri_settings["name"]){
      var name = tri_settings["name"];
      $.each(tri_settings.trigger_type , function(key , type_obj){
        var trigger_dom , trigger_event;
        if($.gatherajax[name][key]){
          if(!type_obj.selector){
            switch(tri_settings.trigger_dom_type){
              case "class":
                trigger_dom = "." + name + "_" + key;
                break;
              case "id":
                trigger_dom = "#" + name + "_" + key;
                break;
              default:
                trigger_dom = "[" + trigger_dom_type + "='" + name + "_" + key + "']";
                break;
            }
          }else{
            trigger_dom = type_obj.selector;
          }



          if(!type_obj.event){
            trigger_event = tri_settings.trigger_event_base;
          }else{
            trigger_event = type_obj.event;
          }

          if(!type_obj.pre_tri && tri_settings.pre_tri_base){
            type_obj.pre_tri = tri_settings.pre_tri_base;
          }

          if(!type_obj.after_tri && tri_settings.after_tri_base){
            type_obj.after_tri = tri_settings.after_tri_base;
          }

          $(document).on(trigger_event , trigger_dom , function(e){
            e.preventDefault();
            $.gatherajax.this = $(this);
            if(type_obj.pre_tri){
              type_obj.pre_tri($(this) , key);
            }
            if(type_obj.pre_tri){
              var result = type_obj.pre_tri($(this) , key);
            }
            if(!type_obj.pre_tri || result){
              $.gatherajax[name][key]["execute"](type_obj.data);
            }
            if(type_obj.after_tri){
              type_obj.after_tri($(this) , key);
            }
          })

        }else{
          console.error(key + " method is not defined!");
        }
      })
    }else{
      console.error("no name");
    }
  }

  $.gatherajax.construct = function(options){
    var settings = $.extend({} , $.gatherajax.defaults, options );
    if(!settings.name){
      console.error("no name");
      return false;
    }
    $.gatherajax[settings.name] = {};
    $.each(settings.add_type , function(key , type_obj){


      settings.add_type[key] = $.extend({} ,  $.gatherajax.defaults_type, type_obj );
      var tmp_obj = settings.add_type[key];

      if(settings.success_base && !tmp_obj.success){
        tmp_obj.success = settings.success_base;
      }

      if(settings.error_base && !tmp_obj.error){
        tmp_obj.error = settings.error_base;
      }

      if(settings.type_base && !tmp_obj.type){
        tmp_obj.type = settings.type_base;
      }

      if(settings.type_base && !tmp_obj.dataType){
        tmp_obj.dataType = settings.dataType_base;
      }

      if(!tmp_obj.url){
        tmp_obj.url = settings.url_base + "/" + key;
      }

      $.gatherajax[settings.name][key] = tmp_obj;

      $.gatherajax[settings.name][key]["execute"] = function(data){
        var ajax_option = $.extend({} , $.gatherajax[settings.name][key] , {data : data});
        $.ajax(ajax_option);
      }
    });
  };

	$.gatherajax.set = function(name , key , param){
    if(!$.autoajax[name]){
      console.error("no name");
    }
    $.gatherajax[name][key] = param;
  }

})(jQuery);