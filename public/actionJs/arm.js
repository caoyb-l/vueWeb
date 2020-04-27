/**
 * 2019-08-13
 * writer:lzy
 * 手臂
 */
"use strict";
goog.provide("Blockly.Blocks.lists"); // Deprecated
goog.provide("Blockly.Constants.Lists");
goog.require("Blockly.Blocks");
goog.require("Blockly");

/**
 * 机器人手臂
 * arm
 *  10203  右手抬    
    10232  右手最高
    10233  右手复位
    10202  左手抬
    10229  左手最高
    10230  左手复位
    10231  左手最低

    10227  敬礼
    10249  握手
    10250  拥抱
 */

// 右手抬 10203
var arms_right_raise = {
    message0: "抬起右手   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '2'
        }
    ],
    "colour": '#8080FF',
    "nextStatement": "Action",
    "previousStatement": "Action",
};
Blockly.Blocks["arms_right_raise"] = {
    init: function () {
        this.jsonInit(arms_right_raise)
    }
};
Blockly.JavaScript.arms_right_raise = function (a) {
    var secs = a.getFieldValue("secs");

    if (secs == '') {
        return alert('请输入正确的时间')
    }
    var res =
        '{"code":"10203","unitName":"抬右手","waitingTime":"' +
        secs +
        '","type":"4"},';

    return res;
};

// 右手最高10232
var arms_right_top = {
    message0: "右手最高   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '3'
        }
    ],
    "colour": '#8080FF',
    "nextStatement": "Action",
    "previousStatement": "Action",
};
Blockly.Blocks["arms_right_top"] = {
    init: function () {
        this.jsonInit(arms_right_top)
    }
};
Blockly.JavaScript.arms_right_top = function (a) {
    var secs = a.getFieldValue("secs");

    if (secs == '') {
        return alert('请输入正确的时间')
    }
    var res =
        '{"code":"10232","unitName":"右手最高","waitingTime":"' +
        secs +
        '","type":"4"},';

    return res;
};

//右手复位10233
var arms_right_down = {
    message0: "右手复位   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '2'
        }
    ],
    "colour": '#8080FF',
    "nextStatement": "Action",
    "previousStatement": "Action",
};
Blockly.Blocks["arms_right_down"] = {
    init: function () {
        this.jsonInit(arms_right_down)
    }
};
Blockly.JavaScript.arms_right_down = function (a) {
    var secs = a.getFieldValue("secs");

    if (secs == '') {
        return alert('请输入正确的时间')
    }
    var res =
        '{"code":"10233","unitName":"右手复位","waitingTime":"' +
        secs +
        '","type":"4"},';

    return res;
};

//左手抬 10202
var arms_left_raise = {
    message0: "抬起左手   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '2'
        }
    ],
    "colour": '#1EAC41',
    "nextStatement": "Action",
    "previousStatement": "Action",
};
Blockly.Blocks["arms_left_raise"] = {
    init: function () {
        this.jsonInit(arms_left_raise)
    }
};
Blockly.JavaScript.arms_left_raise = function (a) {
    var secs = a.getFieldValue("secs");

    if (secs == '') {
        return alert('请输入正确的时间')
    }
    var res =
        '{"code":"10202","unitName":"左手抬","waitingTime":"' +
        secs +
        '","type":"4"},';

    return res;
};

//左手最高 10229
var arms_left_top = {
    message0: "左手最高   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '3'
        }
    ],
    "colour": '#1EAC41',
    "nextStatement": "Action",
    "previousStatement": "Action"
}
Blockly.Blocks["arms_left_top"] = {
    init: function () {
        this.jsonInit(arms_left_top)
    }
};
Blockly.JavaScript.arms_left_top = function (a) {
    var secs = a.getFieldValue("secs");

    if (secs == '') {
        return alert('请输入正确的时间')
    }
    var res =
        '{"code":"10229","unitName":"左手最高","waitingTime":"' +
        secs +
        '","type":"4"},';

    return res;
};

//左手复位 10230
var arms_left_down = {
    message0: "左手复位   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '2'
        }
    ],
    "colour": '#1EAC41',
    "nextStatement": "Action",
    "previousStatement": "Action"
}
Blockly.Blocks["arms_left_down"] = {
    init: function () {
        this.jsonInit(arms_left_down)
    }
};
Blockly.JavaScript.arms_left_down = function (a) {
    var secs = a.getFieldValue("secs");

    if (secs == '') {
        return alert('请输入正确的时间')
    }
    var res =
        '{"code":"10230","unitName":"左手复位","waitingTime":"' +
        secs +
        '","type":"4"},';

    return res;
};

//左手最低 10231
var arms_left_low = {
    message0: "左手最低   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '0'
        }
    ],
    "colour": '#1EAC41',
    "nextStatement": "Action",
    "previousStatement": "Action",
};
Blockly.Blocks["arms_left_low"] = {
    init: function () {
        this.jsonInit(arms_left_low)
    }
};
Blockly.JavaScript.arms_left_low = function (a) {
    var secs = a.getFieldValue("secs");

    if (secs == '') {
        return alert('请输入正确的时间')
    }
    var res =
        '{"code":"10231","unitName":"左手最低","waitingTime":"' +
        secs +
        '","type":"4"},';

    return res;
};

//敬礼 10227
var salute = {
    message0: "敬礼   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '3'
        }
    ],
    "colour": '#02C874',
    "nextStatement": "Action",
    "previousStatement": "Action"
}
Blockly.Blocks["salute"] = {
    init: function () {
        this.jsonInit(salute)
    }
};
Blockly.JavaScript.salute = function (a) {
    var secs = a.getFieldValue("secs");
    if (secs == '') {
        return alert('请输入正确的时间')
    }
    var res =
        '{"code":"10227","unitName":"敬礼","waitingTime":"' +
        secs +
        '","type":"5"},';
    return res;
};

//握手 10249
var shake_hands = {
    message0: "握手   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '2'
        }
    ],
    "colour": '#02C874',
    "nextStatement": "Action",
    "previousStatement": "Action"
}
Blockly.Blocks["shake_hands"] = {
    init: function () {
        this.jsonInit(shake_hands)
    }
};
Blockly.JavaScript.shake_hands = function (a) {
    var secs = a.getFieldValue("secs");
    var res =
        '{"code":"10249","unitName":"握手","waitingTime":"' +
        secs +
        '","type":"5"},';

    return res;
};

//拥抱 10250
var embrace = {
    message0: "拥抱   延迟   %1秒",
    args0: [
        {
            type: 'field_input',
            name: 'secs',
            text: '4'
        }
    ],
    "colour": '#02C874',
    "nextStatement": "Action",
    "previousStatement": "Action"
}
Blockly.Blocks["embrace"] = {
    init: function () {
        this.jsonInit(embrace)
    }
};
Blockly.JavaScript.embrace = function (a) {
    var secs = a.getFieldValue("secs");
    var res =
        '{"code":"10250","unitName":"拥抱","waitingTime":"' +
        secs +
        '","type":"5"},';

    return res;
};