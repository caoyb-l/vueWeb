<template>
<!-- 修改命令集 -->
<!-- style="top: 20px;" -->
  <a-modal
    title="选择地图"
    centered
    :width="500"
    v-model="visible"
    @ok="showCmd"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable = "false"
  >
  <a-form :form="form">
   <a-form-item label="地图" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
            showSearch
            placeholder="非必选"
            optionFilterProp="children"
            @change="changeMap($event)"
            v-decorator="['mapId']"
        >
          <a-select-option
           v-for="(item ,key) in mapList"
           :key="key"
           :value="item.id">
              {{item.mapName}}
            </a-select-option>
        </a-select>
  </a-form-item>
   </a-form>
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
  data () {
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
      editData: { title: '' },
      mapList: [],
      cmd: '',
      circulation: '',
    }
  },
  created () {
    this.getMap()
  },
  methods: {
    changeMap (event) {
      // console.log('选择项: ' + event)
      this.editData.mapId = event
    },
    add () {
      this.cmd = ''
      this.form.resetFields()
      this.visible = true
    },
    getMap () {
      let org = JSON.parse(localStorage.getItem('user')).orgId;
      queryData({orgId: org }, '/robotMapLib/getRobotMapLibList').then(res => {
        // console.log('-----------getMap', res);
        this.mapList = res.result;
      })
    },
    getCmdId (cmdId) {
      console.log("收到参数cmd="+cmdId)
      this.$emit('ok')
      this.visible = false
    },
    showCmd () {
      let mapId = this.editData.mapId == undefined ? 0 : this.editData.mapId
      // console.log('地图ID:' + mapId)
      this.$refs.cmd.show('', mapId, 0)
    }
  }
}
</script>
