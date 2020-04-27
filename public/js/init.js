// 这个不能动blocylay调用后台的地址！！！
var url = "http://robot.lovechuangchuang.com:8085";
// var url = "http://localhost:54321";
var getParam = decodeURI(location.search).substr(1);
var keymap = getParam.split("&");
for(var i=0;i<keymap.length;i++){
  var item=keymap[i].split("=");
  window[item[0]]=item[1];
}
var point = [["暂无数据", ""]];
var luzhilujing = [["暂无数据", ""]];
var shouhuilujing = [["暂无数据", ""]];
// var picture= [["暂无数据，请在文件管理模块上传数据",""]];
// var audio= [["暂无数据，请在文件管理模块上传数据",""]];
// var video= [["暂无数据，请在文件管理模块上传数据",""]];
var XML = {};

// 获取地图数据
function getMapPoint() {
  let mapId = window.mapId
  if(mapId > 0){
    let data =  {mapId:mapId}
    $.ajax({
      url: url + "/mapGsPoint/list",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(data),
      success(res) {
        if(JSON.parse(res).point.length > 0){
          point = JSON.parse(res).point
        }
        if(JSON.parse(res).luzhilujing.length > 0){
          luzhilujing = JSON.parse(res).luzhilujing
        }
        if(JSON.parse(res).shouhuilujing.length > 0){
          shouhuilujing = JSON.parse(res).shouhuilujing
        }
          initTour(point)
          luzhi(luzhilujing)
          shouhui(shouhuilujing)
      },
      error(err) {
        console.log(err)
        initTour(point)
        luzhi(luzhilujing)
        shouhui(shouhuilujing)
      }
    });
  }else{
    initTour(point)
    luzhi(luzhilujing)
    shouhui(shouhuilujing)
  }
}
// // 获取单位媒体文件
// function getOrgMedia() {
//   let orgId = window.orgId
//   if(orgId > 0){
//     let data =  {orgId:orgId}
//     $.ajax({
//       url: url + "/skillOptionFile/blocklyFileList",
//       type: "post",
//       contentType: "application/json",
//       data: JSON.stringify(data),
//       success(res) {
//         if(JSON.parse(res).picture.length > 0){
//           picture = JSON.parse(res).picture
//           // audio = JSON.parse(res).audio
//           // video = JSON.parse(res).video
//         }else{
//           tupian(picture)
//         }
//         },
//         error(err) {
//           console.log(err);
//         }
//     });
//   }else{
//     tupian(picture)
//   }
// }
// 获取blockly
function getCmdBlockStr() {
  let cmd = window.cmd
  if(cmd > 0){
    let data =  {entityId: cmd}
    $.ajax({
      url: url + "/cmdCollection/getCmdJson",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(data),
      success(res) {
        var res=JSON.parse(res)
        if(res.code== 0){
          strtoblockly(res.result)
        }
        },
        error(err) {
          console.log(err);
        }
    });
  }else{
    strtoblockly(XML)
  }
}
// function tupian(picture){
//   var block_img_fullScreen = {
//     message0: "%1显示图片  链接%2   延时   %3秒",
//     args0: [
//       {
//         type: 'field_dropdown',
//         name: 'typeId',
//         options:[
//           ["全屏", "10237"],
//           ["内容区", "10239"],
//         ]
//       },{
//         type: 'field_dropdown',
//         name: 'param',
//         options : picture
//       }, {
//         type: 'field_input',
//         name: 'secs',
//         text: '0'
//       }
//     ],
//     "colour": '330',
//     "nextStatement": "Action",
//     "previousStatement": "Action",
// };

// Blockly.Blocks["block_img_fullScreen"] = {
//     init: function () {
//         this.jsonInit(block_img_fullScreen)
//     }
// };
// Blockly.JavaScript.block_img_fullScreen = function (a) {
//     var param = a.getFieldValue("param");
//     var secs = a.getFieldValue("secs");
//     var typeId = a.getFieldValue("typeId");
//     var res =
//         '{"code":"' + typeId + '","unitName":"图片显示","waitingTime":"'+
//         secs+'","params":"' + param + '","type":"8"},';
//     console.log(res);
//     return res;
// };
// }

// 初始化地图点
function initTour(e){
  //导航 10216
  var blockly_moveTo_point = {
    message0: "机器人导航到 %1",
    args0: [
        {
            type: "field_dropdown",
            name: "param",
            options: e
        }
    ],
    message1: "执行 %1",
    args1: [
        {
          type: "input_statement",
          name: "DO0"
        }
      ],
    "colour": "#B430E5",
    "nextStatement": "Action",
    "previousStatement": "Action",
  };
  Blockly.Blocks["blockly_moveTo_point"] = {
    init: function () {
        this.jsonInit(blockly_moveTo_point);
    }
  };

  Blockly.JavaScript.blockly_moveTo_point = function (a) {
    var param = a.getFieldValue("param");
    var param2 = '';
    if (param == '') {
      return alert('移动路径信息有误，请检查坐标')
    }else{
      param2 = param.substr(param.lastIndexOf("_")+1 , param.length)
    }
    var action = Blockly.JavaScript.statementToCode(a, "DO0");
    // 去掉action内最后一个逗号
    if (action) {
        action = action.substr(0, action.length - 1);
    }
    var res =
    '{"code":"10216","unitName":"导航_'+ param +'","params":"'+ param2 +'","type":"7","unit":['+ action + ']},';
    console.log(res);
    return res;
  };
}

// 录制路径行走10277
function luzhi(e){
  var blockly_luzhi_point = {
    message0: "录制路径行走 %1",
    args0: [
        {
            type: "field_dropdown",
            name: "param",
            options: e
        }
    ],
    message1: "执行 %1",
    args1: [
        {
          type: "input_statement",
          name: "DO0"
        }
      ],
    "colour": "330",
    "nextStatement": "Action",
    "previousStatement": "Action",
  };
  Blockly.Blocks["blockly_luzhi_point"] = {
    init: function () {
        this.jsonInit(blockly_luzhi_point);
    }
  };
  Blockly.JavaScript.blockly_luzhi_point = function (a) {
    var param = a.getFieldValue("param");
    if (param == '') {
      return alert('移动路径信息有误，请检查坐标')
    }
    var action = Blockly.JavaScript.statementToCode(a, "DO0");
    // 去掉action内最后一个逗号
    if (action) {
        action = action.substr(0, action.length - 1);
    }
    var res =
    '{"code":"10277","unitName":"录制_'+ param +'","params":"'+ param +'","type":"7","unit":['+ action + ']},';
    return res;
  };
}

// 手绘路径行走10278
function shouhui(e){
  var blockly_shouhui_point = {
    message0: "手绘路径行走 %1",
    args0: [
        {
            type: "field_dropdown",
            name: "param",
            options: e
        }
    ],
    message1: "执行 %1",
    args1: [
        {
          type: "input_statement",
          name: "DO0"
        }
      ],
    "colour": "330",
    "nextStatement": "Action",
    "previousStatement": "Action",
  };
  Blockly.Blocks["blockly_shouhui_point"] = {
    init: function () {
        this.jsonInit(blockly_shouhui_point);
    }
  };
  Blockly.JavaScript.blockly_shouhui_point = function (a) {
    var param = a.getFieldValue("param");
    if (param == '') {
      return alert('移动路径信息有误，请检查坐标')
    }
    var action = Blockly.JavaScript.statementToCode(a, "DO0");
    // 去掉action内最后一个逗号
    if (action) {
        action = action.substr(0, action.length - 1);
    }
    var res =
    '{"code":"10278","unitName":"手绘_'+ param +'","params":"'+ param +'","type":"7","unit":['+ action + ']},';
    return res;
  };
}
//blockly块转换为xml文档，然后转换为字符串
function blocklytostr(demoWorkspace){
  var xml = Blockly.Xml.workspaceToDom(window.demoWorkspace);
  var data = Blockly.Xml.domToText(xml);
  return data;
}
//加载xml转换为blockblocklytostrly块
function strtoblockly(data){
  var xml = Blockly.Xml.textToDom(data);
  // Clear the workspace to avoid merge.
  window.demoWorkspace.clear();
  Blockly.Xml.domToWorkspace(xml, window.demoWorkspace);
}

getMapPoint();
// getOrgMedia();

$(function() {
  window.demoWorkspace = Blockly.inject("blocklyDiv", {
    media: "./media/",
    toolbox: document.getElementById("toolbox")
  });
  // Blockly.Xml.domToWorkspace("", demoWorkspace);
  $(".blocklyTreeRow").unbind("mousedown");
  getCmdBlockStr();
  var save = document.getElementsByClassName("blocklyTreeRow");
  //保存
  save[save.length - 1].addEventListener("click", function() {

    // 标识新增命令集,需要输入命令集名称
    if (window.cmd == 0 || window.cmd == '') {
      var cmdName = prompt('输入命令集名称（注：必填项）');
      if (cmdName) {
        console.log('命令集名称：' + cmdName)
      } else if (cmdName === '') {
        console.log('未输入内容')
        alert('请输入命令集名称')
        return
      } else {
        console.log('点击取消')
        return
      }
    }
    //$(".robotShadow").show();
    var code = Blockly.JavaScript.workspaceToCode(window.demoWorkspace);
    if (code) {
      code = code.substr(0, code.length - 1);
    }
    codeData = '{"data":[' + code + ']}';
    var data =  JSON.parse(codeData)
    data.blocklyCode = blocklytostr(code);

    let mapId = window.mapId;
    let circulation = 1;
    let orgId = window.orgId;
    let createBy = window.createBy;
    let cmd = window.cmd;
    var param = "{}";
    var paramObj = JSON.parse(param);
    paramObj.mapId=mapId;
    paramObj.entityId=cmd;//解开则为在原基础上进行修改

    paramObj.circulation = circulation;//循环次数
    paramObj.orgId = orgId;//单位id
    paramObj.createBy = createBy;//操作人
    paramObj.title = cmdName;//令集名称
    paramObj.json = data;// blocly区块代码
    //console.log("保存修改命令集参数",JSON.stringify(paramObj));
    // 保存修改命令集
    try {
      $.ajax({
        url: url + "/cmdCollection/saveOrUpdate",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(paramObj),
        success(res) {
          let json = JSON.parse(res)
          if (json.code == 0) {
            document.getElementById('cmd').innerHTML = json.cmd;
            // 向父页面传值，父页面通过添加监听获取
            window.parent.postMessage(json.cmd, '*')
            alert(json.message);
          } else {
            cmd.innerHTML = 0;
            alert(json.message);
          }
        },
        error(err) {
          console.log(err);
          alert("失败")
        }
      });
    } catch (err) {
      alert("代码编程错误，请修改！");
    }
  });
});
