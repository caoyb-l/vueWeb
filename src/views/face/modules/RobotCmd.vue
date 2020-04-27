<template>
  <!-- 编辑弹框 -->
      <a-modal
      title="配置机器人"
      style="top: 20px;"
      :width="800"
      :destroyOnClose="true"
      v-model="visible"
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
            v-decorator="['mapId']"
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
            v-decorator="[
              'cmd',
              {rules: [{ required:true, message: '请选择' }],initialValue: cmd}
            ]"
        >
            <a-select-option v-for="(item ,key) in cmdList" :key="key" :value="item.id">
              {{item.name}}
            </a-select-option>
        </a-select>
        <a-button type="primary" @click="addCmd()">新增动作集</a-button>
          <a-divider type="vertical"/>
          <a-button id="chgCmd" type="primary" @click="editCmd()" v-if="showEditCmd">修改当前动作集</a-button>
      </a-form-item>
    </a-form>
    <p>选择机器人：</p>
    <s-table
        ref="table"
        size="middle"
        rowKey="code"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        showPagination="auto"
      >
      <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
     <cmd-list @getCmdId="getCmdId" ref="cmd"></cmd-list>
    </a-modal>
</template>

<script>
import { addData, queryData } from '@/api/common'
import CmdList from '../../Cmd'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    CmdList
  },
  data() {
    return {
      showEditCmd: false,
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
      mapId:'',
      mapList:[],
      cmd:'',
      faceId:'',
      faceName:'',
      form: this.$form.createForm(this),
      selectedItems: [],
      selectedRowKeys: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },

        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '编码',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        }

      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let org = JSON.parse(localStorage.getItem('user')).orgId;
        return queryData(Object.assign(parameter, {orgId:org}), '/robotInfo/loadRobotListByOrg').then(res => {
          return res.result
        })
      }
    }
  },
  created(){
    // this.getCmd()
    // this.getMap()
  },
  methods: {
    show(record) {
      console.log(record)
      this.cmd = ''
      this.form.resetFields();
      this.showEditCmd = false
      this.faceId = record.id
      this.faceName = record.name;
      this.visible = true
      this.getCmd()
      this.getMap()
    },
    changeCmd (event) {
      this.cmd = event
      this.showEditCmd = true
    },
    // 修改动作集
    editCmd () {
      console.log('编辑机器人动作集' + this.cmd)
      // if (this.cmd == 0 || this.cmd == '') {
      //   this.$message.error('请先选择要修改的动作集')
      //   return
      // }
      let formData = this.form.getFieldsValue();
      let mapId = formData.mapId == undefined ? 0 : formData.mapId
      this.$refs.cmd.show('编辑机器人动作集', mapId, this.cmd)
    },
    //新增动作集
    addCmd(){
      let formData = this.form.getFieldsValue();
      let mapId = formData.mapId == undefined ? 0 : formData.mapId
      this.$refs.cmd.show('编辑机器人动作集', mapId, 0)
    },
    getCmdId (cmd) {
      this.getCmd()
      this.cmd = cmd
      this.form.setFieldsValue({
        cmd: parseInt(cmd)
      });
    },
    // showCmd(){
    //   let formData = this.form.getFieldsValue();
    //   let mapId = formData.mapId == undefined ? 0 : formData.mapId
    //   this.$refs.cmd.show(this.faceName,mapId)
    // },
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
      queryData({ orgId: org }, '/cmdCollection/getCmdListByOrg').then(res => {
        console.log(res)
        if (res.code == 0) {
          _this.cmdList = res.cmdList
        } else {
          _this.$message.error(res.message)
        }
      });
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log(values.cmd);
          console.log(this.selectedRowKeys);
          let param = { faceId: this.faceId, cmd: values.cmd, robotCode: this.selectedRowKeys }
          let _this = this;
          queryData(param,'/faceManage/addRobotFace').then(res => {
            console.log(res)
            if(res.code == 0){
              _this.$message.success('配置成功')
              _this.visible = false;
              _this.$emit('ok', values)
            } else {
              _this.$message.error(res.message)
            }
          });

          }
      });

    },
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
