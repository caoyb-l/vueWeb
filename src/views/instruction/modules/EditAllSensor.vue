<template>
  <!-- 批量修改弹超级命令-->
  <a-modal
    title="批量修改传感器"
    style="top: 20px;"
    :width="'70%'"
    v-model="visible"
    @ok="handleSubmit"
    :destroyOnClose="true"
    :maskClosable="false"
    v-preventReClick
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
          @change="changeCmd($event)"
          style="width: 200px"
          :filterOption="filterOption"
          v-decorator="[
            'cmdId',
            {rules: [{required: true,  message: '选择动作集' }]}
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
      showEditCmd: false,
      cmdId: '',
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
      triggerId: 0,
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
        var params = {
          type: 2,
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
      this.cmdId = event
      this.showEditCmd = true
      console.log('下拉框值：' + this.cmdId)
    },
    // 新增动作集
    addCmd() {
      this.$refs.cmd.show('批量修改传感器', '', 0)
    },
    // 修改动作集
    editCmd() {
      console.log('修改：' + this.cmdId)
      this.$refs.cmd.show('批量修改传感器', '', this.cmdId)
    },
    // 编辑动作集后，获取动作集ID
    getCmdId(cmd) {
      this.getCmdList()
      this.cmdId = cmd
      this.form.setFieldsValue({
        cmdId: parseInt(cmd)
      })
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
    // 获取动作集
    getCmdList() {
      var _this = this
      var orgId = JSON.parse(localStorage.getItem('user')).orgId
      var param = { orgId: orgId }
      queryData(param, '/cmdCollection/getCmdListByOrg').then(res => {
        console.log('动作集', res)
        if (res.code == 0 || res.code == 2) {
          _this.cmdList = res.cmdList
        } else {
          _this.$message.error(res.message)
        }
      })
    },

    add() {
      this.visible = true
      this.showEditCmd = false
      this.cmdId = ''
      this.getTriggerCmdList()
      this.getCmdList()
      // this.selectedRowKeys.clear()
      // if (this.$refs.table) {
      //   this.$refs.table.refresh()
      // }
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
          queryData({ ...param, ...values }, '/supercmdTriggerRobot/updateAll').then(res => {
            if (res.code == 0) {
              _this.$message.success('批量修改成功')
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
