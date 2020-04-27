<template>
  <a-modal
    title="编辑"
    style="top: 20px;"
    :width="800"
    :destroyOnClose="true"
    v-model="visible"
    @ok="handleSubmit"
    @cancel="handleClose"
    :maskClosable="false"
    v-preventReClick
  >
    <a-form :form="form">
      <a-form-item label="关键字" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
        'title',
        {rules: [{ required: true,message: '请输入' }],
        initialValue: editData.title,}
        ]"
          placeholder="关键词用英文“,”隔开"
        />
      </a-form-item>
      <a-form-item label="别名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
        'depict',
        {rules: [{message: '请输入' }],
        initialValue: editData.depict}
        ]"
          placeholder="请输入"
        />
      </a-form-item>
      <a-form-item label="回答内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea
          v-decorator="[
        'contents',
        {rules: [{  required: true,message: '请输入' }],
        initialValue: editData.contents}

        ]"
          row="2"
        />
      </a-form-item>

      <a-form-item label="地图" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          optionFilterProp="children"
          placeholder="如需使用导航请先选择地图"
          v-decorator="['mapId',{initialValue: editData.mapId}]"
        >
          <a-select-option
            v-for="(item ,key) in mapList"
            :key="key"
            :value="item.id"
          >{{item.mapName}}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="动作集" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          optionFilterProp="children"
          placeholder="选择动作集"
          @change="changeCmd($event)"
          v-decorator="['cmd',{initialValue:cmd}]"
        >
          <a-select-option v-for="(item ,key) in cmdList" :key="key" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
        <a-button type="primary" @click="addCmd()">新增动作集</a-button>
        <a-divider type="vertical" />
        <a-button id="chgCmd" type="primary" @click="editCmd()" v-if="showEditCmd">修改当前动作集</a-button>
      </a-form-item>
      <a-form-item label="内外网" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group v-decorator="['netType',{initialValue: editData.netType}]">
          <a-radio :value="0">内网</a-radio>
          <a-radio :value="1">外网</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="网页" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
        'url',
        {rules: [{ message: '请输入' }],
        initialValue: editData.url}

        ]"
          placeholder="请输入"
        />
      </a-form-item>

      <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-switch
          v-decorator="['isAble']"
          checkedChildren="是"
          unCheckedChildren="否"
          v-model="isAble"
        />
      </a-form-item>
    </a-form>
    <!-- 获取cmd.vue中的cmdName的值 -->
    <cmd-list @getCmdId="getCmdId" ref="cmd"></cmd-list>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
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
      cmdList: [],
      visible: false,
      skillList: [],
      selectSkills: [],
      form: this.$form.createForm(this),
      editData: {},
      cmd: '',
      isAble: true,
      mapList: []
    }
  },
  methods: {
    changeCmd(event) {
      this.cmd = event
      this.showEditCmd = true
    },
    add(record) {
      if (record.cmd) {
        this.showEditCmd = true
        this.cmd = record.cmd
      } else {
        this.showEditCmd = false
      }
      this.visible = true
      this.editData = record
      this.isAble = record.isAble == 1 ? true : false
      this.entityId = record.id
      this.getCmd()
      this.getMap()
    },
    getMap() {
      let org = JSON.parse(localStorage.getItem('user')).orgId
      queryData({ orgId: org }, '/robotMapLib/getRobotMapLibList').then(res => {
        this.mapList = res.result
      })
    },
    getCmdId(cmdId) {
      this.getCmd()
      if (cmdId != 0) {
        this.form.setFieldsValue({
          cmd: parseInt(cmd)
        })
        this.cmd = parseInt(cmdId)
      }
    },
    // 新增动作集
    addCmd() {
      let formData = this.form.getFieldsValue()
      let mapId = formData.mapId == undefined ? 0 : formData.mapId
      this.$refs.cmd.show(this.editData.title, mapId, 0)
    },
    // 修改动作集
    editCmd() {
      let formData = this.form.getFieldsValue()
      let mapId = formData.mapId == undefined ? 0 : formData.mapId
      this.$refs.cmd.show(this.editData.title, mapId, this.cmd)
    },
    getCmd() {
      let org = JSON.parse(localStorage.getItem('user')).orgId
      let _this = this
      queryData({ orgId: org }, '/cmdCollection/getCmdListByOrg').then(res => {
        if (res.code == 0) {
          _this.cmdList = res.cmdList
        } else {
          _this.$message.error('获取动作集列表失败')
        }
      })
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          let user = JSON.parse(localStorage.getItem('user'))
          let orgId = user.orgId
          let userId = user.id
          var param = {
            orgId: orgId,
            user: userId,
            entityId: this.editData.id
          }
          values.isAble = this.isAble == false ? 0 : 1
          values.url = values.url
          queryData(Object.assign(param, values), '/skills/saveOrUpdateXL').then(res => {
            if (res.code == 0) {
              _this.$message.success('编辑成功')
              _this.visible = false
              _this.$emit('ok', values)
            } else {
              _this.$message.error(res.message)
            }
          })
        }
      })
    },
    //右上角关闭事件
    handleClose() {
      this.cmd = ''
    }
  }
}
</script>
