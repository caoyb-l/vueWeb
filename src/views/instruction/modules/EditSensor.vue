<template>
  <!-- 修改超级命令 -->
  <a-modal
    title="编辑传感器"
    style="top: 20px;"
    :width="'70%'"
    v-model="visible"
    @ok="handleSubmit"
    :destroyOnClose="true"
    v-preventReClick
    :maskClosable = "false"
  >
    <a-form :form="form">
      <a-form-item label="触发指令" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-model="edit.triggerName" :disabled="true" placeholder="触发指令" />
      </a-form-item>
      <a-form-item label="选择机器人" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-table
          ref="table"
          size="middle"
          rowKey="id"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
          :columns="columns"
          :dataSource="data"
        >
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        </a-table>
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
            {rules: [{required: true,  message: '选择动作集' }],initialValue:edit.cmdId}
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
      edit: { triggerId: 0, triggerName: '', cmdId: '' },
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
      cmdList: [],
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
          dataIndex: 'robotName',
          scopedSlots: { customRender: 'robotName' }
        },
        {
          title: '机器人ID',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      data: [],
      options: false,
      optionAlertShow: false
    }
  },
  created() {},
  methods: {
    changeCmd(event) {
      this.edit.cmdId = event
      this.showEditCmd = true
      console.log('下拉框：' + this.edit.cmdId)
    },
    // 新增动作集
    addCmd() {
      this.$refs.cmd.show('传感器', '', 0)
    },
    // 修改动作集
    editCmd() {
      console.log('修改：' + this.edit.cmdId)
      this.$refs.cmd.show('传感器', '', this.edit.cmdId)
    },
    // 编辑动作集后，获取动作集ID
    getCmdId(cmd) {
      this.getCmdList()
      this.edit.cmdId = cmd
      this.form.setFieldsValue({
        cmdId: parseInt(cmd)
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    //获取动作集
    getCmdList() {
      var _this = this
      var orgId = JSON.parse(localStorage.getItem('user')).orgId
      var param = { orgId: orgId }
      queryData(param, '/cmdCollection/getCmdListByOrg').then(res => {
        // console.log('动作集', res)
        if (res.code == 0) {
          _this.cmdList = res.cmdList
        }
      })
    },

    add(record) {
      console.log(record)
      if (record.cmdId != '' && record.cmdId != null) {
        this.showEditCmd = true
      } else {
        this.showEditCmd = false
      }
      console.log(this.showEditCmd)
      this.visible = true
      this.edit = record
      this.data = []
      this.data.push(record)
      this.getCmdList()
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
            cmdId: '1',
            triggerId: _this.edit.triggerId,
            entityId: _this.edit.id
          }
          queryData({ ...param, ...values }, '/supercmdTriggerRobot/save').then(res => {
            if (res.code == 0) {
              _this.$message.success('修改成功')
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
