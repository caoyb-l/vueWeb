<template>
  <!-- 编辑弹框 -->
      <a-modal
      title="编辑机器人动作集"
      style="top: 20px;"
      :width="600"
      v-model="visible"
      :destroyOnClose="true"
      @ok="handleSubmit"
      v-preventReClick
      :maskClosable = "false"
    >
    <a-form :form="form">
      <a-form-item label="地图" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
            placeholder="如需使用导航请先选择地图"
            optionFilterProp="children"
            v-decorator="[
            'mapId',
            {initialValue: editData.mapId}
            ]"
        >
          <a-select-option v-for="(item ,key) in mapList" :key="key" :value="item.id">
              {{item.mapName}}
            </a-select-option>
        </a-select>
      </a-form-item>
        <a-form-item
        label="动作集"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-select
            showSearch
            placeholder="选择动作集"
            optionFilterProp="children"
            @change="changeCmd($event)"
            :filterOption="filterOption"
            v-decorator="[
              'cmd',
              {rules: [{ required: true,message: '请选择' }],
              initialValue: editData.cmd}
            ]"
        >
            <a-select-option v-for="(item ,key) in cmdList" :key="key" :value="item.id">
              {{item.name}}
            </a-select-option>
        </a-select>
        <a-button id="addCmd" type="primary" @click="addCmd()">新增动作集</a-button>
          <a-divider type="vertical"/>
          <a-button id="chgCmd" type="primary" @click="editCmd()" v-if="showEditCmd">修改当前动作集</a-button>
      </a-form-item>
    </a-form>

     <cmd-list @getCmdId="getCmdId" ref="cmd"></cmd-list>
    </a-modal>
</template>

<script>
import { addData, queryData } from '@/api/common'
import { STable } from '@/components'
import CmdList from '../../Cmd'

export default {
  name: 'TableList',
  components: {
    STable,
    CmdList
  },
  data() {
    return {
      showEditCmd:false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      cmdList:[],
      editData:[],
      cmd:'',
      form: this.$form.createForm(this),
      showIframe:false,
      mapList:[]
    }
  },
  created(){
    // this.getCmd()
    // this.getMap()
  },
  methods: {
    changeCmd(event) {
      this.editData.cmd = event
      this.showEditCmd = true
    },
    show(record) {
      console.log(record)
      if (record.cmd != '') {
        this.showEditCmd = true
      } else {
        this.showEditCmd = false
      }
      console.log(this.showEditCmd)
      this.editData = record
      this.visible = true
      this.getCmd()
      this.getMap()
    },
    // 修改动作集
    editCmd () {
      console.log('编辑机器人动作集' + this.editData.cmd)
      // if (this.editData.cmd == 0 || this.editData.cmd == '') {
      //   this.$message.error('请先选择要修改的动作集')
      //   return
      // }
      this.$refs.cmd.show('编辑机器人动作集', '', this.editData.cmd)
    },
    // 新增动作集
    addCmd () {
      this.$refs.cmd.show('编辑机器人动作集', '', 0)
    },
    // 编辑动作集后，获取动作集ID
    getCmdId (cmd) {
      this.getCmd()
      this.editData.cmd = cmd
      this.form.setFieldsValue({
        cmd: parseInt(cmd)
      });
    },
    getMap(){
      let org = JSON.parse(localStorage.getItem('user')).orgId;
      queryData({orgId:org},'/robotMapLib/getRobotMapLibList').then(res => {
        console.log('-----------getMap',res);
        this.mapList = res.result;
      })
    },
    getCmd(){
      let org = JSON.parse(localStorage.getItem('user')).orgId;
      let _this = this;
      queryData({orgId:org},'/cmdCollection/getCmdListByOrg').then(res => {
        console.log(res)
        if(res.code == 0){
          _this.cmdList = res.cmdList
        } else {
          _this.$message.error(res.message)
        }
      });
    },
    handleSubmit() {
      const { form: { validateFields } } = this
      this.confirmLoading = true
        validateFields((errors, values) => {
        if (!errors) {
          var _this = this;
          setTimeout(() => {
              let param = {id:this.editData.id,cmd:values.cmd}
            addData(param,'/faceManage/editRobotFace').then(res => {

              if(res.code == 0){
                _this.$message.success('修改成功');
                // 重置输入框内容
                _this.form.resetFields();
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
              } else {
                _this.$message.error(res.message)
              }
            });

          }, 300)
        } else {
          this.confirmLoading = false
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  }
}
</script>
<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.anticon anticon-eye-o {
  display: none;
}
.ant-upload-list-item-actions a {
  display: none;
}
</style>
