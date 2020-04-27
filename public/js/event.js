/**
 * 2018-05-21
 * writer:zyk
 * 开始菜单的块以及处理逻辑
 */
"use strict";
goog.provide("Blockly.Blocks.lists"); // Deprecated
goog.provide("Blockly.Constants.Lists");
goog.require("Blockly.Blocks");
goog.require("Blockly");

var codeArray = [];

//事件

// Block for if/elseif/else condition.
var hear = {
  message0: "如果机器人听到 %1",
  args0: [
    {
      type: "field_input",
      name: "IF0",
      text: "你好"
    }
  ],
  message1: "执行 %1",
  args1: [
    {
      type: "input_statement",
      name: "DO0"
    }
  ],
  colour: "%{BKY_LOGIC_HUE}",
  helpUrl: "%{BKY_CONTROLS_IF_HELPURL}"
};
Blockly.Blocks["hear"] = {
  init: function() {
    this.jsonInit(hear);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  },
  customContextMenu: function(options) {
    var option = {
      enabled: true,
      text: "Custom option",
      callback: function() {}.bind(this)
    };
    options.splice(0);
  }
};

Blockly.JavaScript.hear = function(a) {
  // codeArray
  var keywords = a.getFieldValue("IF0");
  // var event =Blockly.JavaScript.valueToCode(a, 'IF0') || '\'\'';
  var action = Blockly.JavaScript.statementToCode(a, "DO0");

 // console.log(keywords);
  //console.log(action);
  if (action) {
    action = action.substr(0, action.length - 1);
    //console.log(action);
  }
  var res =
    '{"event":{"code":"SOUND001","data":{"keywords":"' +
    keywords +
    '"}},"action":{"collectionName":"机器人动作集","circulation":1,"unit":[' +
    action +
    "]}}";

  //console.log(res);
  return res;
};

// Block touch
var touch = {
  message0: "如果触摸机器人 %1",
  args0: [
    {
      type: "field_dropdown",
      name: "IF0",
      options: [
        ["摸头", "HEAD001"],
        ["摸左手", "LEFT001"],
        ["摸右手", "RIGHT001"]
      ]
    }
  ],
  message1: "执行 %1",
  args1: [
    {
      type: "input_statement",
      name: "DO0"
    }
  ],
  colour: "%{BKY_LOGIC_HUE}",
  helpUrl: "%{BKY_CONTROLS_IF_HELPURL}"
  
};
Blockly.Blocks["touch"] = {
  init: function() {
    this.jsonInit(touch);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }  ,
  customContextMenu: function(options) {
    var option = {
      enabled: true,
      text: "Custom option",
      callback: function() {}.bind(this)
    };
    options.splice(0);
  }
};

Blockly.JavaScript.touch = function(a) {
  // codeArray
  var code = a.getFieldValue("IF0"); 
  var action = Blockly.JavaScript.statementToCode(a, "DO0");
 // console.log(code);
 // console.log(action);

  if (action) {
    action = action.substr(0, action.length - 1);
  //  console.log(action);
  }
  var res =
    '{"event":{"code":"'+code+'","data":{"keywords":""}},"action":{"collectionName":"机器人动作集","circulation":1,"unit":[' +
    action +
    "]}}";
  console.log(res); 
  return res;
};
