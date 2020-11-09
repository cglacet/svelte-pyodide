define("ace/theme/Material-Theme",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace--material--theme";
exports.cssText = ".ace--material--theme .ace_gutter {\
background: #263238;\
color: rgb(138,153,156)\
}\
.ace--material--theme .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace--material--theme {\
background-color: #263238;\
color: #EEFFFF\
}\
.ace--material--theme .ace_cursor {\
color: #FFCC00\
}\
.ace--material--theme .ace_marker-layer .ace_selection {\
background: rgba(128, 203, 196, 0.13)\
}\
.ace--material--theme.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #263238;\
border-radius: 2px\
}\
.ace--material--theme .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace--material--theme .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #65737E\
}\
.ace--material--theme .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.31)\
}\
.ace--material--theme .ace_gutter-active-line {\
background-color: rgba(0, 0, 0, 0.31)\
}\
.ace--material--theme .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(128, 203, 196, 0.13)\
}\
.ace--material--theme .ace_fold {\
background-color: #82AAFF;\
border-color: #EEFFFF\
}\
.ace--material--theme .ace_entity.ace_other.ace_attribute-name,\
.ace--material--theme .ace_keyword {\
color: #C792EA\
}\
.ace--material--theme .ace_constant.ace_character.ace_escape,\
.ace--material--theme .ace_keyword.ace_operator,\
.ace--material--theme .ace_meta.ace_tag,\
.ace--material--theme .ace_string.ace_regexp {\
color: #89DDFF\
}\
.ace--material--theme .ace_constant.ace_character,\
.ace--material--theme .ace_constant.ace_language,\
.ace--material--theme .ace_constant.ace_numeric,\
.ace--material--theme .ace_keyword.ace_other.ace_unit,\
.ace--material--theme .ace_support.ace_constant,\
.ace--material--theme .ace_variable.ace_parameter {\
color: #F78C6C\
}\
.ace--material--theme .ace_entity.ace_name.ace_function,\
.ace--material--theme .ace_support.ace_function {\
color: #82AAFF\
}\
.ace--material--theme .ace_support.ace_class,\
.ace--material--theme .ace_support.ace_type {\
color: #FFCB6B\
}\
.ace--material--theme .ace_storage.ace_type {\
font-style: italic\
}\
.ace--material--theme .ace_invalid,\
.ace--material--theme .ace_invalid.ace_illegal {\
color: #FFFFFF;\
background-color: #FF5370\
}\
.ace--material--theme .ace_invalid.ace_deprecated {\
color: #FFFFFF;\
background-color: #C792EA\
}\
.ace--material--theme .ace_markup.ace_heading,\
.ace--material--theme .ace_string {\
color: #C3E88D\
}\
.ace--material--theme .ace_comment {\
font-style: italic;\
color: #546E7A\
}\
.ace--material--theme .ace_variable {\
color: #EEFFFF\
}\
.ace--material--theme .ace_variable.ace_language {\
font-style: italic;\
color: #FF5370\
}\
.ace--material--theme .ace_entity.ace_name.ace_tag {\
color: #F07178\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    window.require(["ace/theme/Material-Theme"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            