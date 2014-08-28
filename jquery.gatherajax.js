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
  };

  $.gatherajax.defaults_trigger = {
    name         : null ,
    trigger_type : {
      /*add  : {
        seletor   : ".add" , String : for trigger dom select if null or no object selector is ".{name}_add" when trigger_dom_type is "class"
        event     : "click" , String : for trigger dom's hook event you can select from $(dom).on event
        pre_tri   : function(dom , method) , function : for function execute before ajax , dom is trigger dom
        data      : {
          id   : 1 ,
          name : function(){return $.gatherajax.this.val()} // $.gatherajax.this is triggered dom
        },
        success_func : function(res) ,
        error_func   : function(res) ,
      } ,
      edit : {} ,
      del  : {} ,
      */
    } ,
    trigger_dom_type   : "class" , // String : for trigger common dom type ["id" , "class" , other] 
    trigger_event_base : "click" , // String : for trigger common dom's hook event you can select from $(dom).on event
    pre_tri_base       : null    , // function(dom , method) : for function execute before ajax , dom is trigger dom , method is ajax_method_name eg.add,edit,del
  }

  $.gatherajax.defaults_after = {
    done     : false   ,
    fail     : false   ,
  };

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


          $(document).on(trigger_event , trigger_dom , function(e){
            e.preventDefault();
            $.gatherajax.this = $(this);
            if(type_obj.pre_tri){
              var result = type_obj.pre_tri($(this) , key);
            }
            if(!type_obj.pre_tri || result){
              if(type_obj.success_func){
                if(type_obj.error_func){
                  $.gatherajax[name][key]["execute"](type_obj.data , type_obj.success_func , type_obj.error_func);
                }else{
                  $.gatherajax[name][key]["execute"](type_obj.data , type_obj.success_func , null);
                }
              }else{
                if(type_obj.error_func){
                  $.gatherajax[name][key]["execute"](type_obj.data , null , type_obj.error_func);
                }else{
                  $.gatherajax[name][key]["execute"](type_obj.data , null , null);
                }
              }
              
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

  $.gatherajax.__construct = function(options){
    var settings = $.extend({} , $.gatherajax.defaults, options );
    if(!settings.name){
      console.error("no name");
      return false;
    }
    $.gatherajax[settings.name] = {};
    $.each(settings.add_type , function(key , type_obj){


      settings.add_type[key] = $.extend({} ,  $.gatherajax.defaults_type, type_obj );
      var tmp_obj    = settings.add_type[key];

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

      $.gatherajax[settings.name][key]["ajax_func"] = function(data , after_option){
        var after        = $.extend({} , $.gatherajax.defaults_after , after_option);
        var ajax_option  = $.extend({} , $.gatherajax[settings.name][key] , {data : data});
        if(after.done){
          if(after.fail){
            return $.ajax(ajax_option).done(settings.success_base).fail(settings.error_base);
          }else{
            return $.ajax(ajax_option).done(settings.success_base);
          }
        }else{
          if(after.fail){
            return $.ajax(ajax_option).fail(settings.error_base);
          }else{
            return $.ajax(ajax_option);
          }
        }
        
      }

      $.gatherajax[settings.name][key]["execute"] = function(data , done , fail){
        var ajax_func   = $.gatherajax[settings.name][key]["ajax_func"](data);
        if(done){
          if(fail){
            ajax_func.done(done).fail(fail);
          }else{
            ajax_func.done(done).fail(settings.error_base);
          }
        }else{
          if(fail){
            ajax_func.done(settings.success_base).fail(fail);
          }else{
            ajax_func.done(settings.success_base).fail(settings.error_base);
          }
        }
      }
    });
  };

  $.gatherajax.construct = $.gatherajax.__construct;

  $.gatherajax.set = function(name , key , param){
    if(!$.gatherajax[name]){
      console.error("no name");
    }
    $.gatherajax[name][key] = param;
  }

})(jQuery);