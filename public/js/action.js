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

var expressShow = [
  ["微笑", "00160000071000000000"],
  ["说话", "00160000072000000000"],
  ["惊讶", "00160000073000000000"],
  ["哭", "00160000074000000000"],
  ["难过", "00160000075000000000"],
  ["喜欢", "00160000076000000000"],
  ["晕", "00160000077000000000"],
  ["休息", "00160000078000000000"],
  ["飞吻", "00160000079000000000"],
  ["卖萌", "00160000070100000000"],
  ["调皮", "00160000071100000000"],
  ["委屈", "00160000072100000000"],
  ["惊喜", "00160000073100000000"],
  ["闭嘴", "0016000007410000000"],
  ["生气", "0016000007510000000"],
  ["害羞", "0016000007610000000"],
  ["叹气", "0016000007710000000"],
  ["尴尬", "00160000078100000000"]
];
var async = [];

var TYPES = [["左手", "1"], ["右手", "2"]],
  async = [["同步", "0"], ["异步", "1"]];

//动作
//放手
Blockly.Blocks["block_doreleaseleft"] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput().appendField("机器人放下左手");

    //this.appendField('length of');
    // this.setOutput(true, 'event');
    this.setColour("#ee5858");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("机器人动作-放手");
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

Blockly.JavaScript.block_doreleaseleft = function(a) {
  // console.log(hand);
  return '{"unit":10204,"params":"","isWaitFinish":"0","remark":"放左手"},';
};

//放手
Blockly.Blocks["block_doreleaseright"] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput().appendField("机器人放下右手");
    //this.appendField('length of');
    // this.setOutput(true, 'event');
    this.setColour("#ee5858");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("机器人动作-放手");
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

Blockly.JavaScript.block_doreleaseright = function(a) {
  // console.log(hand);
  return '{"unit":10205,"params":"","isWaitFinish":"0","remark":"放右手"},';
};

//抬手
Blockly.Blocks["block_dohandleft"] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput().appendField("机器人抬一下左手");
    //this.appendField('length of');
    // this.setOutput(true, 'event');
    this.setColour("#ee5858");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("机器人动作-抬手");
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

Blockly.JavaScript.block_dohandleft = function(a) {
  //var async=a.getFieldValue("async");
  // console.log(hand);
  return '{"unit":10202,"params":"","isWaitFinish":"0","remark":"抬左手"},';
};

//放手
Blockly.Blocks["block_dohandright"] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput().appendField("机器人抬一下右手");
    //this.appendField('length of');
    // this.setOutput(true, 'event');
    this.setColour("#ee5858");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("机器人动作-抬手");
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

Blockly.JavaScript.block_dohandright = function(a) {
  //var async=a.getFieldValue("async");
  // console.log(hand);
  return '{"unit":10203,"params":"","isWaitFinish":"0","remark":"抬右手"},';
};

Blockly.Blocks["block_dorunsomewhere"] = {
  init: function() {
    //可以在这里写请求后台地图坐标点
    //this.setOutput(true, null);
    this.appendDummyInput()
      .appendField("机器人移动到")
      .appendField(new Blockly.FieldDropdown(mapPoint), "point")
      .appendField(new Blockly.FieldDropdown(async), "async");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
    this.setTooltip("需要先在后台添加地点");
    this.setHelpUrl("");
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
Blockly.JavaScript["block_dorunsomewhere"] = function(block) {
  var dropdown_point = block.getFieldValue("point");
  var async = block.getFieldValue("async");
  return (
    '{"unit":10216,"params":"' +
    dropdown_point +
    '","isWaitFinish":"' +
    async +
    '","remark":"移动到某点"},'
  );
};

Blockly.Blocks["block_dosalute"] = {
  init: function() {
    // this.setOutput(true, null);
    this.appendDummyInput()
      .appendField("机器人敬礼")
      .appendField(new Blockly.FieldDropdown(async), "async");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
    this.setTooltip("");
    this.setHelpUrl("");
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
Blockly.JavaScript["block_dosalute"] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var async = block.getFieldValue("async");
  return (
    '{"unit":10227,"params":"","isWaitFinish":"' + async + '","remark":"敬礼"},'
  );
};
Blockly.Blocks["block_dohug"] = {
  init: function() {
    // this.setOutput(true, null);
    this.appendDummyInput()
      .appendField("机器人拥抱")
      .appendField(new Blockly.FieldDropdown(async), "async");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
    this.setTooltip("");
    this.setHelpUrl("");
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
Blockly.JavaScript["block_dohug"] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var async = block.getFieldValue("async");
  return (
    '{"unit":10250,"params":"","isWaitFinish":"' + async + '","remark":"拥抱"},'
  );
};

Blockly.Blocks["block_dosay"] = {
  init: function() {
    //this.setOutput(true, null);
    this.appendDummyInput()
      .appendField("机器人说")
      .appendField(new Blockly.FieldTextInput("你好"), "say")
      .appendField(new Blockly.FieldDropdown(async), "async");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
    this.setTooltip("");
    this.setHelpUrl("");
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
Blockly.JavaScript["block_dosay"] = function(block) {
  var text_hear = block.getFieldValue("say");
  var async = block.getFieldValue("async");
  // TODO: Assemble JavaScript into code variable.
  return (
    '{"unit":10200,"params":"' +
    text_hear +
    '","isWaitFinish":"' +
    async +
    '","remark":"说话"},'
  );
};

Blockly.Blocks["block_doface"] = {
  init: function() {
    this.appendDummyInput()
      .appendField("选择机器人面部表情")
      .appendField(new Blockly.FieldDropdown(expressShow), "express");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ee5858");
    this.setTooltip("");
    this.setHelpUrl("");
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
Blockly.JavaScript["block_doface"] = function(block) {
  var dropdown_express = block.getFieldValue("express");
  // TODO: Assemble JavaScript into code variable.

  return (
    '{"unit":10226,"params":"' +
    dropdown_express +
    '","isWaitFinish":"0","remark":"表情"},'
  );
};

Blockly.Blocks["block_dorunright"] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput()
      .appendField("机器人右转")
      .appendField(new Blockly.FieldDropdown(async), "async");
    //this.appendField('length of');
    // this.setOutput(true, 'event');
    this.setColour("#ee5858");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("机器人动作-右转");
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

Blockly.JavaScript.block_dorunright = function(a) {
  var async = a.getFieldValue("async");
  // console.log(hand);
  return (
    '{"unit":10215,"params":"","isWaitFinish":"' + async + '","remark":"右转"},'
  );
};

Blockly.Blocks["block_dorunleft"] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput()
      .appendField("机器人左转")
      .appendField(new Blockly.FieldDropdown(async), "async");
    //this.appendField('length of');
    // this.setOutput(true, 'event');
    this.setColour("#ee5858");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("机器人动作-左转");
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

Blockly.JavaScript.block_dorunleft = function(a) {
  var async = a.getFieldValue("async");
  // console.log(hand);
  return (
    '{"unit":10214,"params":"","isWaitFinish":"' + async + '","remark":"左转"},'
  );
};

Blockly.Blocks["block_doruntop"] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput()
      .appendField("机器人前进")
      .appendField(new Blockly.FieldDropdown(async), "async");
    //this.appendField('length of');
    // this.setOutput(true, 'event');
    this.setColour("#ee5858");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("机器人动作-前进");
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

Blockly.JavaScript.block_doruntop = function(a) {
  var async = a.getFieldValue("async");
  // console.log(hand);
  return (
    '{"unit":10212,"params":"","isWaitFinish":"' + async + '","remark":"前进"},'
  );
};

Blockly.Blocks["block_dorunbottom"] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function(newOp) {
      thisBlock.updateType(newOp);
    });
    this.appendDummyInput()
      .appendField("机器人后退")
      .appendField(new Blockly.FieldDropdown(async), "async");
    //this.appendField('length of');
    // this.setOutput(true, 'event');
    this.setColour("#ee5858");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("机器人动作-后退");
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

Blockly.JavaScript.block_dorunbottom = function(a) {
  var async = a.getFieldValue("async");
  // console.log(hand);
  return (
    '{"unit":10213,"params":"","isWaitFinish":"' + async + '","remark":"后退"},'
  );
};
