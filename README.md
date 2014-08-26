jquery_gatherajax
=================

this plugin gathering $.ajax method by each data eg.) add edit del

# construct gatherajax
'''
  var options = {
    name          : "opt"                              ,
    url_base      : "/option"                          , // String : for all_ajax url base
    add_type      : {
      add     : {
        url : "/add_option"
      } ,
      get     : {
        success : function(res){
          $("#opt").html(res);
        }
      } ,
      edit    : {} ,
    }                                               , // Object for add ajax name and inside type you can add option for $.ajax                                
    dataType_base     : "html"                      , // String : for return dataType
    success_base      : function(res){
      if(res == 0){
        alert("failuer");
        return false;
      }
    }                        , // function : for all_ajax success callback method without set by inside add_type
    error_base        : function(){
      alert("error");
    }                        , // function : for all_ajax error callback method without set by inside add_type
  }

  $.gatherajax.construct(options);
'''

# Usage
'''
  $.gatherajax.opt.get.execute(); //this method send ajax request to /option/get and with no data
  $.gatherajax.opt.add.execute({id : 1}); // this method send ajax request to /add_option and with id = 1 data by POST
'''
