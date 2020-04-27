<template>
  <!-- 新增弹框 -->
  <a-modal
    title="新建"
    style="top: 20px;"
    :width="'70%'"
    v-model="visible"
    @ok="handleSubmit"
    :destroyOnClose="true"
    :maskClosable="false"
    :keyboard="true"
    v-preventReClicks
  >
    <a-form :form="form">
      <a-form-item label="触发指令" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择触发指令"
          optionFilterProp="children"
          style="width: 200px"
          @change="handleTriggerCmdChange"
          :filterOption="filterOption"
          v-decorator="[
            'triggerId',
            {rules: [{required: true,  message: '选择触发指令' }],initialValue:triggerId}
          ]"
        >
          <a-select-option
            v-for="(item) in triggerCmdList"
            :key="item.id"
            :value="item.id"
          >{{item.triggerName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="选择机器人" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <s-table
          ref="table"
          size="middle"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
          showPagination="auto"
        >
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        </s-table>
      </a-form-item>
      <a-form-item label="动作集" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择动作集"
          optionFilterProp="children"
          style="width: 200px"
          @change="changeCmd($event)"
          :filterOption="filterOption"
          v-decorator="[
            'cmdId',
            {rules: [{required: true,  message: '选择动作集' }],initialValue:selectCmd}
          ]"
        >
          <a-select-option v-for="(item) in cmdList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
        </a-select>

        <a-button type="primary" style="margin-left:20px" @click="addCmd()">新增动作集</a-button>
        <a-divider type="vertical" />
        <a-button id="chgCmd" type="primary" @click="editCmd()" v-if="showEditCmd">修改当前动作集</a-button>
      </a-form-item>
    </a-form>
    <cmd-list @getCmdId="getCmdId" ref="cmd"></cmd-list>
  </a-modal>
</template>

<script>
import { queryData, addData } from '@/api/common'
import { STable } from '@/components'
import CmdList from '../../Cmd'
export default {
  components: {
    CmdList,
    STable
  },
  data() {
    return {
      selectCmd: '',
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
      form: this.$form.createForm(this),
      triggerCmdList: [],
      cmdList: [],
      triggerId: '',
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },

        {
          title: '机器人名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '机器人编码',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var id = JSON.parse(localStorage.getItem('user')).id
        var orgId = JSON.parse(localStorage.getItem('user')).orgId
        console.log('user 请求', parameter)
        var params = {
          type: '1',
          triggerId: this.triggerId,
          code: '',
          name: '',
          orgId: orgId,
          userId: id,
          validityDate: ''
        }
        return queryData(
          Object.assign(parameter, params, this.queryParam),
          '/robotInfo/loadPageListByTruggerRobot'
        ).then(res => {
          console.log(res)
          return res.result
        })
      },
      selectedRowKeys: new Set([]),
      options: {
        alert: {
          show: true
        },
        rowSelection: {
          onSelect: this.onSelectChange,
          onSelectAll: this.onSelectChangeAll
        }
      },
      optionAlertShow: false
    }
  },
  created() {},
  methods: {
    changeCmd(event) {
      this.selectCmd = event
      this.showEditCmd = true
    },
    // showCmd() {
    //   console.log(this.selectCmd)
    //   this.$refs.cmd.show("动作集","",this.selectCmd)
    // },
    // 新增动作集
    addCmd() {
      console.log(this.selectCmd)
      this.$refs.cmd.show('编辑动作集', '', 0)
    },
    // 修改动作集
    editCmd() {
      console.log(this.selectCmd)
      this.$refs.cmd.show('编辑动作集', '', this.selectCmd)
    },

    // 编辑动作集后，获取动作集ID
    getCmdId (cmd) {
      this.getCmdList()
      this.selectCmd = cmd
      this.form.setFieldsValue({
        cmdId: parseInt(cmd)
      })
      // this.cmdId = parseInt(cmd)
    },

    handleTriggerCmdChange(value) {
      console.log(`selected ${value}`)
      this.triggerId = value
      this.$refs.table.refresh()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 选择机器人
    onSelectChange(record, selected, nativeEvent) {
      console.log(record, selected)
      if (selected) {
        this.selectedRowKeys.add(record.id)
      } else {
        this.selectedRowKeys.delete(record.id)
      }
    },
    onSelectChangeAll(selected, changeRows) {
      if (selected) {
        changeRows.map((value, index) => {
          this.selectedRowKeys.add(value.id)
        })
      } else {
        changeRows.map((value, index) => {
          this.selectedRowKeys.delete(value.id)
        })
      }
    },
    // 获取指令列表
    getTriggerCmdList() {
      var _this = this
      queryData({}, '/supercmdTrigger/getSupercmdTriggerList').then(res => {
        console.log('指令列表', res)
        if (res.code == 0) {
          _this.triggerCmdList = res.supercmdTriggerList
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    //获取动作集
    getCmdList() {
      var _this = this
      var orgId = JSON.parse(localStorage.getItem('user')).orgId
      var param = { orgId: orgId }
      queryData(param, '/cmdCollection/getCmdListByOrg').then(res => {
        console.log('动作集', res)
        if (res.code == 0) {
          _this.cmdList = res.cmdList
        }
      })
    },

    add() {
      this.visible = true
      this.selectCmd = ''
      this.showEditCmd = false
      this.getTriggerCmdList()
      this.getCmdList()
      this.selectedRowKeys.clear()
      if (this.$refs.table) {
        this.$refs.table.refresh()
      }
    },

    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      var _this = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var param = {
            robotId: [..._this.selectedRowKeys],
            cmdId: '1'
          }
          queryData({ ...param, ...values }, '/supercmdTriggerRobot/save').then(res => {
            if (res.code == 0) {
              _this.$message.success('新建成功')
              this.triggerId = ''
            } else {
              _this.$message.error(res.message)
            }
            _this.visible = false
            _this.confirmLoading = false
            _this.$emit('ok', values)
            // 重置输入框内容
            _this.form.resetFields()
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
