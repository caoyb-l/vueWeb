<template>
  <!-- 新增弹框 -->
  <a-modal
    title="新建定时任务"
    style="top: 20px;"
    :width="900"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable = "false"
  >
    <a-form :form="form">
      <a-form-item label="定时任务类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          placeholder="选择文件类型"
          optionFilterProp="children"
          @change="display"
          v-decorator="[
            'type',
            {rules: [{required: true, message: '定时任务类型' }]}
          ]"
        >
          <a-select-option value=1>每天执行</a-select-option>
          <a-select-option value=2>每周几执行</a-select-option>
          <a-select-option value=3>定期执行一次</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="执行日期" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.showTimePoint">
        <a-date-picker
          @change="timePointStr"
          v-decorator="[
            'timePoint',
            {rules: [{ required: true, message: '' }]}
          ]"
          placeholder="请选择执行日期"/>
      </a-form-item>
      <a-form-item label="选择周期" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.showWeek">
        <a-checkbox-group
          :options="week"
          v-decorator="[
            'weekList',
            {rules: [{ required: true, message: '请选择执行周期' }]}
          ]"
        />
      </a-form-item>
      <a-form-item label="执行时间" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.showTime">
        <a-time-picker
          placeholder="选择执行时间"
          @change="timeStr"
          v-decorator="[
            'time',
            {rules: [{ required: true, message: '请选择执行时间' }]}
          ]"
          format="HH:mm" />
      </a-form-item>
      <a-form-item label="地图" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="如需使用导航请先选择地图"
          optionFilterProp="children"
          v-decorator="['mapId']"
        >
          <a-select-option v-for="(item ,key) in mapList" :key="key" :value="item.id">
            {{ item.mapName }}
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
            {rules: [{ required: true, message: '请选择或者新增一个动作集' }]}
          ]"
        >
          <a-select-option v-for="(item ,key) in cmdList" :key="key" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="addCmd()">新增一个动作集</a-button>
        <a-divider type="vertical"/>
        <a-button id="chgCmd" type="primary" @click="editCmd()" v-if="showEditCmd">修改当前动作集</a-button>
      </a-form-item>
      <a-form-item
        label="定时任务描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea
          placeholder="请输入描述"
          :rows="4"
          v-decorator="[
            'remark',
            {rules: [{ message: '请输入描述' }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="单位名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择所属单位"
          optionFilterProp="children"
          @change="getRobotList"
          v-decorator="[
            'orgId',
            {rules: [{ required: true, message: '请选择' }]}
          ]"
        >
          <a-select-option v-for="(item ,key) in orgNames" :key="key" :value="item.id">
            {{ item.name }}
          </a-select-option>
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
    </a-form>
    <cmd-list @getCmdId="getCmdId" ref="cmd"></cmd-list>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
import { STable } from '@/components'
import CmdList from '../../Cmd'
const week = ['1', '2', '3', '4', '5', '6', '7']
export default {
  components: {
    CmdList,
    STable
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
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      week,
      showTimePoint: false,
      showWeek: false,
      showTime: false,
      timePoint: '',
      time: '',
      weekList: [], // 日期集合
      cmdList: [], // 命令集集合
      mapList: [], // 地图集合
      showEditCmd: false,
      cmd: '',
      queryParam: { orgId: '-1' },
      orgNames: [],
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },

        {
          title: '机器人名称',
          dataIndex: 'name'
        },
        {
          title: '机器人编码',
          dataIndex: 'code'
        }
      ],
      loadData: parameter => {
        console.log('请求啦')
        return queryData(
          Object.assign(parameter, this.queryParam),
          '/robotInfo/loadRobotListByOrg'
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
      }
    }
  },
  created () {
    this.getCmd()
    this.getMap()
    this.handleOrgList()
  },
  methods: {
    // 获取单位下的单位
    handleOrgList () {
      const id = JSON.parse(localStorage.getItem('user')).orgId
      var param = { org: id }
      var _this = this
      queryData(param, '/userManage/getHrOrgByPid').then(res => {
        _this.orgNames = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },
    getRobotList (value) {
      this.queryParam.orgId = value
      this.$refs.table.refresh()
    },
    // filterOption (input, option) {
    //   return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    // },
    // 选择机器人
    onSelectChange (record, selected, nativeEvent) {
      console.log(record, selected)
      if (selected) {
        this.selectedRowKeys.add(record.code)
      } else {
        this.selectedRowKeys.delete(record.code)
      }
    },
    onSelectChangeAll (selected, changeRows) {
      if (selected) {
        changeRows.map((value, index) => {
          this.selectedRowKeys.add(value.code)
        })
      } else {
        this.selectedRowKeys.clear()
      }
    },
    changeCmd (event) {
      this.cmd = event
      this.showEditCmd = true
    },
    getCmdId (cmd) {
      console.log(cmd)
      this.getCmd()
      this.form.setFieldsValue({
        cmd: parseInt(cmd)
        // 'cmd': parseInt(cmd)
      })
    },
    // 修改动作集
    editCmd () {
      const formData = this.form.getFieldsValue()
      const mapId = formData.mapId === undefined ? 0 : formData.mapId
      console.log(mapId)
      this.$refs.cmd.show('编辑动作集', mapId, this.cmd)
    },
    // 新增动作集
    addCmd () {
      const formData = this.form.getFieldsValue()
      const mapId = formData.mapId === undefined ? 0 : formData.mapId
      this.$refs.cmd.show('新增动作集', mapId, 0)
    },
    getMap () {
      const org = JSON.parse(localStorage.getItem('user')).orgId
      queryData({ orgId: org }, '/robotMapLib/getRobotMapLibList').then(res => {
        console.log('-----------getMap', res)
        this.mapList = res.result
      })
    },
    getCmd () {
      const org = JSON.parse(localStorage.getItem('user')).orgId
      const _this = this
      queryData({ orgId: org }, '/cmdCollection/getCmdListByOrg').then(res => {
        console.log(res)
        if (res.code === 0) {
          _this.cmdList = res.cmdList
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    timePointStr (dates, dateStrings) {
      this.timePoint = dateStrings
    },
    timeStr (dates, dateStrings) {
      this.time = dateStrings
    },
    // 控制显示内容
    display (value) {
      console.log(value)
      if (value === '1') {
        this.showTime = true
        this.showTimePoint = false
        this.showWeek = false
      }
      if (value === '2') {
        this.showTime = true
        this.showTimePoint = false
        this.showWeek = true
      }
      if (value === '3') {
        this.showTime = true
        this.showTimePoint = true
        this.showWeek = false
      }
      console.log(this.showTime)
      console.log(this.showTimePoint)
      console.log(this.showWeek)
    },
    selectWeek (value) {
      // console.log(value)
      this.weekList = value
      console.log(this.weekList)
    },
    add () {
      this.form.resetFields()
      this.showEditCmd = false
      this.queryParam.orgId = '-1'
      this.visible = true
      this.showTime = false
      this.showTimePoint = false
      this.showWeek = false
      this.selectedRowKeys.clear()
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log(values)
          values.time = this.time
          values.timePoint = this.timePoint
          var _this = this
          setTimeout(() => {
            var param = Object.assign(values, { robotCode: [...this.selectedRowKeys] })
            queryData(param, '/timedTask/addTaskMsg').then(res => {
              if (res.code === 0) {
                _this.$message.success('新建成功')
              } else {
                _this.$message.error(res.message)
              }
              _this.visible = false
              _this.confirmLoading = false
              _this.$emit('ok', values)
              // 重置输入框内容
              _this.form.resetFields()
            })
          }, 300)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
