<template>
<!-- :destroyOnClose="true":关闭时销毁 Modal 里的子元素 -->
  <a-modal
    title="新增闲聊"
    style="top: 40px;"
    :width="600"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable = "false"
  >
  <a-form :form="form">
   <a-form-item
        label="关键字"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
        v-decorator="[
        'title',
        {rules: [{ required: true,message: '请输入' }]}
        ]"
        placeholder="请输入标题" />
   </a-form-item>
   <a-form-item
        label="别名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
        v-decorator="[
        'depict',
        {rules: [{message: '请输入' }]}
        ]"
        placeholder="用英文“,”隔开" />
   </a-form-item>
   <a-form-item
        label="回答内容"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea
        v-decorator="[
        'contents',
        {rules: [{  required: true,message: '请输入' }]}

        ]"
        row="2" />
   </a-form-item>
   <a-form-item label="地图" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
            placeholder="如需使用导航请先选择地图"
            optionFilterProp="children"
            v-decorator="[
        'mapId',
        {rules: []}]"
        >
          <a-select-option v-for="(item ,key) in mapList" :key="key" :value="item.id">
              {{item.mapName}}
            </a-select-option>
        </a-select>
    </a-form-item>
   <a-form-item label="动作集" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
            showSearch
            placeholder="选择动作集"
            optionFilterProp="children"
            @change="changeCmd($event)"
             v-decorator="['cmd',{initialValue: cmd}]">
            <a-select-option
            v-for="(item ,key) in cmdList"
            :key="key"
            :value = "item.id">
              {{item.name}}
            </a-select-option>
        </a-select>
     <a-button type="primary"  @click="addCmd()">新增动作集</a-button>
     <a-divider type="vertical"/>
     <a-button id="chgCmd" type="primary" @click="editCmd()" v-if="showEditCmd">修改当前动作集</a-button>

   </a-form-item>
   <a-form-item
        label="内外网"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-radio-group v-decorator="['netType']">
          <a-radio :value="0">内网</a-radio>
          <a-radio :value="1">外网</a-radio>
        </a-radio-group>
   </a-form-item>
    <a-form-item
        label="网址"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
        v-decorator="[
        'url',
        {rules: [{ message: '请输入' }]}

        ]"
        placeholder="请输入" />
   </a-form-item>

      <a-form-item
        label="是否启用"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-switch
         v-decorator="[
            'isAble'
          ]"
         checkedChildren="是" unCheckedChildren="否" v-model="isAble"/>
      </a-form-item>
   </a-form>
   <cmd-list @getCmdId="getCmdId" ref="cmd"></cmd-list>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
// 新增闲聊已经不需要这个编辑动作集的组件了
import CmdList from '../../Cmd'
export default {
  components: {
    CmdList
  },
  data() {
    return {
      showEditCmd: false,
      headers: {
        authorization: 'authorization-text'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      cmdList:[],
      visible: false,
      isAble: true,
      skillList: [],
      selectSkills: [],
      form: this.$form.createForm(this),
      mapList: [],
      cmd: ''
    }
  },
  methods: {
    changeCmd(event) {
      this.cmd = event
      this.showEditCmd = true
    },
    // 修改动作集
    editCmd () {
      let formData = this.form.getFieldsValue();
      let mapId = formData.mapId == undefined ? 0 : formData.mapId
      this.$refs.cmd.show('编辑闲聊令集', mapId, this.cmd)
    },
    // 新增动作集
    addCmd () {
      let formData = this.form.getFieldsValue();
      let mapId = formData.mapId == undefined ? 0 : formData.mapId
      this.$refs.cmd.show('编辑闲聊动作集', mapId, 0)
    },
    add () {
      this.showEditCmd = false
      this.visible = true
      this.isAble = true
      this.getCmd()
      this.getMap()
      this.cmd=''
    },
    // 获取地图列表
    getMap () {
      let org = JSON.parse(localStorage.getItem('user')).orgId;
      queryData({ orgId: org }, '/robotMapLib/getRobotMapLibList').then(res => {
        this.mapList = res.result;
      })
    },
    // 新增时配置动作集（参数都为初始值）
    updateCmd(){
      let formData = this.form.getFieldsValue();
      let mapId = formData.mapId == undefined ? 0 : formData.mapId
      let title = formData.title == undefined ? '闲聊动作集' : formData.title
      this.$refs.cmd.show(title, 0, mapId)
    },
    getCmdId (cmdId) {
      this.getCmd();
      if(cmdId != 0){
        this.cmd = parseInt(cmdId)
        this.form.setFieldsValue({
          cmd: parseInt(cmdId)
        });
      }
    },
    // 获取动作集列表
    getCmd(){
      let org = JSON.parse(localStorage.getItem('user')).orgId;
      let _this = this;
      queryData({orgId:org},'/cmdCollection/getCmdListByOrg').then(res => {
        if(res.code == 0){
          _this.cmdList = res.cmdList
        } else {
          _this.$message.error("获取动作集列表失败")
        }
      });
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this;
          let user = JSON.parse(localStorage.getItem('user'));
          let orgId = user.orgId
          let userId = user.id;
          var param = { orgId: orgId, user: userId, type: 2 }
          values.isAble = values.isAble == false ? 0 : 1
          values.url = values.url
          queryData(Object.assign(param, values), '/skills/saveOrUpdateXL').then(res => {
            console.log(res)
            if (res.code == 0) {
              _this.$message.success('添加成功')
              _this.visible = false
              _this.$emit('ok', values)
              _this.cmd = ''
            } else {
              _this.$message.error(res.message)
            }
          })
        }
      })
    }
  }
}
</script>
