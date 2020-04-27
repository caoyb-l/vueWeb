/**
 * 2018-05-21
 * writer:zyk
 * 开始菜单的块以及处理逻辑
 */
'use strict';
goog.provide('Blockly.Blocks.lists');  // Deprecated
goog.provide('Blockly.Constants.Lists');
goog.require('Blockly.Blocks');
goog.require('Blockly');

var eventArray=[];
//动作


//事件
Blockly.Blocks['hand'] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() { 
    console.log(this);
    console.log(this.setPreviousStatement);    
    var TYPES = [
      ["双手", '0'],
      ["左手", '1'],
      ["右手", '2']
    ];
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput()        
        .appendField('机器人抬手动作：   ')
        .appendField(new Blockly.FieldDropdown(TYPES), 'TYPES');
    //this.appendField('length of');
    this.setOutput(true, 'event');
    this.setColour("#ee5858");
    //this.setPreviousStatement(true,null);
    //this.setNextStatement(true,null); 
    this.setTooltip('机器人动作-抬手');
  }
};

Blockly.JavaScript.hand=function(a)
{
  //console.log(a);
  //console.log(a.getFieldValue("TYPES"));
  //return"RobotJsBridge.app.tts("+(Blockly.JavaScript.valueToCode(a,"TEXT",Blockly.JavaScript.ORDER_NONE)||"''")+",function(resutl){alert(resutl)});\n";
  //return"window.alert("+(Blockly.JavaScript.valueToCode(a,"TEXT",Blockly.JavaScript.ORDER_NONE)||"''")+");\n"
 switch(a.getFieldValue("TYPES")){
  case '0':
  
    return ["hand({code:0,data:'0'})"];
    break;
  case '1':
 
   return  ["hand({code:0,data:'1'})"];
    break;
  case '2':
 
    return  ["hand({code:0,data:'2'})"];
    break;
 }
};
Blockly.JavaScript.text_print=function(a)
{
  return"RobotJsBridge.app.tts("+(Blockly.JavaScript.valueToCode(a,"TEXT",Blockly.JavaScript.ORDER_NONE)||"''")+",function(resutl){alert(resutl)});\n";
  //return"window.alert("+(Blockly.JavaScript.valueToCode(a,"TEXT",Blockly.JavaScript.ORDER_NONE)||"''")+");\n"
};

//说话




Blockly.Blocks['block_begin'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("点击开始运行");
    this.setNextStatement(true, null);
    this.setColour("#6388f1");
 this.setTooltip("开始");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript.block_begin=function(a){
  return "\n";
}
Blockly.Blocks['block_talktorobot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("你对创创说")
        .appendField(new Blockly.FieldTextInput("例如:你好"), "beginstring");
    this.setNextStatement(true, null);
    this.setColour("#6388f1");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript.block_talktorobot=function(a){
  var text_beginstring = a.getFieldValue('beginstring');
  console.log(text_beginstring);
  return "\n";
}
Blockly.Blocks['block_runsomewhere'] = {
  init: function() {
    //可以在这里写请求后台地图坐标点
    //this.setOutput(true, null);
    this.appendValueInput("somewhere")
        .setCheck(null)
        .appendField("机器人移动到")
        .appendField(new Blockly.FieldDropdown([["柜台","柜台"], ["大门","大门"], ["后门","后门"]]), "point");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
 this.setTooltip("需要先在后台添加地点");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_runsomewhere'] = function(block) {
  var dropdown_point = block.getFieldValue('point');
  var value_somewhere = Blockly.JavaScript.valueToCode(block, 'somewhere', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.Blocks['block_runbytime'] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendValueInput("time")
        .setCheck(null)
        .appendField("机器人向")
        .appendField(new Blockly.FieldDropdown([["前","前"], ["后","后"], ["左","左"],["右","右"]]), "direction")
        .appendField("移动")
        .appendField(new Blockly.FieldTextInput("10"), "time")
        .appendField(new Blockly.FieldDropdown([["秒","秒"], ["分","分"], ["时","时"]]), "time_unit");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_runbytime'] = function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var text_time = block.getFieldValue('time');
  var dropdown_time_unit = block.getFieldValue('time_unit');
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  console.log(dropdown_direction);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};
Blockly.Blocks['block_salute'] = {
  init: function() {
   // this.setOutput(true, null);
    this.appendDummyInput()
        .appendField("机器人敬礼");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_salute'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.Blocks['block_say'] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendDummyInput()
        .appendField("机器人说")
        .appendField(new Blockly.FieldTextInput("你好"), "say");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_say'] = function(block) {
  var text_hear = block.getFieldValue('say');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return "say('hello')";
};


Blockly.Blocks['block_whentem'] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendDummyInput()
        .appendField("温度达到")
        .appendField(new Blockly.FieldNumber(0, -10, 70), "temperature")
        .appendField("°");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#fb9a6f");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_whentem'] = function(block) {
  var number_temperature = block.getFieldValue('temperature');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};
Blockly.Blocks['block_touch'] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendDummyInput()
        .appendField("触摸机器人")
        .appendField(new Blockly.FieldDropdown([["摸头","摸头"], ["摸左手","摸左手"], ["摸右手","摸右手"]]), "part");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#fb9a6f");
 this.setTooltip("触摸机器人");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_touch'] = function(block) {
  var dropdown_part = block.getFieldValue('part');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};
Blockly.Blocks['block_hear'] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendDummyInput()
        .appendField("当机器人听到")
        .appendField(new Blockly.FieldTextInput("你好"), "hear");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#fb9a6f");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_hear'] = function(block) {
  var text_hear = block.getFieldValue('hear');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.Blocks['block_see'] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendDummyInput()
        .appendField("当机器人看到")
        .appendField(new Blockly.FieldDropdown([["张三","张三"], ["李四","李四"], ["王五","王五"]]), "someperson");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#fb9a6f");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['block_see'] = function(block) {
  var dropdown_someperson = block.getFieldValue('someperson');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};
Blockly.Blocks['block_time'] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendDummyInput()
        .appendField("设置时间点")
        .appendField(new Blockly.FieldDropdown([["今天","今天"], ["每天","每天"]]), "someperson")
        .appendField(new Blockly.FieldTextInput(""), "hour")
        .appendField("时")
        .appendField(new Blockly.FieldTextInput(""), "min")
        .appendField("分")
        .appendField(new Blockly.FieldTextInput(""), "second")
        .appendField("秒");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#fb9a6f");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_time'] = function(block) {
  var dropdown_express = block.getFieldValue('someperson');
  var text_hour = block.getFieldValue('hour');
  var text_min = block.getFieldValue('min');
  var text_second = block.getFieldValue('second');
  var code = '...;\n';
  return code;
};
// 设定计时器

Blockly.Blocks['block_setInterval'] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendValueInput("time")
        .setCheck(null)
        .appendField("机器人每隔")      
        .appendField(new Blockly.FieldTextInput("10"), "time")
        .appendField(new Blockly.FieldDropdown([["秒","秒"], ["分","分"], ["时","时"]]), "time_unit");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#fb9a6f");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_setInterval'] = function(block) {  
  var text_time = block.getFieldValue('time');
  var dropdown_time_unit = block.getFieldValue('time_unit');
  var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};



Blockly.Blocks['block_face'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("选择机器人面部表情")
        .appendField(new Blockly.FieldDropdown([["开心","开心"], ["哭泣","哭泣"], ["尴尬","尴尬"]]), "express");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['block_face'] = function(block) {
  var dropdown_express = block.getFieldValue('express');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

 // Block for if/elseif/else condition.
 var addevent={
  
  "message0": "当 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "IF0",
      "check": "event"
    }
  ],
  "message1": "执行 %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "DO0"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "%{BKY_LOGIC_HUE}",
  "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
  "mutator": "controls_if_mutator",
  "extensions": ["controls_if_tooltip"]
}
Blockly.Blocks['addevent'] = {
  init: function() {
    this.jsonInit(addevent);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this
  
  }
};

Blockly.JavaScript.addevent = function(a) {
  var b = 0,
    c = "";
   
 
    // codeArray
    var emitterCode;
    var d =Blockly.JavaScript.valueToCode(a, 'IF0') || '\'\'';
      emitterCode=d;
    var e = Blockly.JavaScript.statementToCode(a, "DO" + b);  
    console.log(d);
 
  return emitterCode+e;
};