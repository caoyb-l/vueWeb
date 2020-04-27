<template>
  <!-- 修改动作集 -->
  <a-modal
    title="编辑"
    style="top: 20px;"
    :width="600"
    :destroyOnClose="true"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :maskClosable = "false"
  >
    <a-form :form="form">
      <a-form-item label="动作集名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
        'title',
        {rules: [{ required: true,message: '请输入' }],
        initialValue: editData.name,}
        ]"
        />
      </a-form-item>
      <a-form-item label="地图" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="如需使用导航请先选择地图"
          optionFilterProp="children"
          @change="changeMap($event)"
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
        <a-button type="primary" @click="showCmd">编辑动作集</a-button>
      </a-form-item>
      <a-form-item label="循环次数" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
        'circulation',
        {rules: [{ required: true, message: '请输入次数' }],
        initialValue: editData.circulation}
        ]"
          placeholder="请输入"
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
      form: this.$form.createForm(this),
      editData: {},
      // isAble: false,
      mapList: []
    }
  },
  created() {
    this.getMap()
  },
  methods: {
    changeMap(event) {
      this.editData.mapId = event
    },
    add(record) {
      console.log(record)
      this.visible = true
      this.editData = record
      this.entityId = record.id
    },
    getMap() {
      let org = JSON.parse(localStorage.getItem('user')).orgId
      queryData({ orgId: org }, '/robotMapLib/getRobotMapLibList').then(res => {
        console.log('-----------getMap', res)
        this.mapList = res.result
      })
    },
    getCmdId(cmd) {
      this.editData.cmd = parseInt(cmd)
      console.log('getCmdId_____________+', cmd, this.editData.cmd)
    },
    showCmd() {
      let mapId = this.editData.mapId == undefined ? 0 : this.editData.mapId
      console.log(mapId)
      let cmd = this.editData.id == undefined ? 0 : this.editData.id
      this.$refs.cmd.show(this.editData.name, mapId, cmd)
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
          let mapId = this.editData.mapId
          let title = this.editData.title
          let circulation = this.editData.circulation
          var param = {
            orgId: orgId,
            createBy: userId,
            entityId: this.editData.id,
            mapId: mapId,
            title: title,
            circulation: circulation
          }
          console.info(param)
          console.log(values)
          queryData(Object.assign(param, values), '/cmdCollection/saveOrUpdate').then(res => {
            console.log(res)
            if (res.code == 0) {
              this.$message.success('编辑成功')
              _this.visible = false
              _this.$emit('ok', values)
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
