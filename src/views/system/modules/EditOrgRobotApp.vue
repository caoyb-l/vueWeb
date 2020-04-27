<template>
  <!-- 新增弹框 -->
  <a-modal
    title="修改"
    style="top: 20px;"
    :width="'70%'"
    v-model="visible"
    @ok="handleSubmit"
    :destroyOnClose="true"
    :maskClosable="false"
    :keyboard="true"
    v-preventReClick
  >
    <a-form :form="form">
      <a-form-item label="单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-model="orgName" :disabled="true" placeholder="单位名称" />
      </a-form-item>
      <a-form-item label="版本类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-model="robotVersionType" :disabled="true" placeholder="版本类型" />
      </a-form-item>
      <a-form-item label="选择APP版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
          <!-- 表单文字过长，省略展示文字内容 -->
          <span slot="contents" slot-scope="text">
            <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="name" slot-scope="text">
            <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        </s-table>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
import { STable, Ellipsis } from '@/components'
export default {
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      orgName: '',
      robotVersionType: '',
      robotVersionTypeCode: '',
      robotVersionId: '',
      orgRobotVersionId: '',
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
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'APP名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '版本描述',
          dataIndex: 'contents',
          scopedSlots: { customRender: 'contents' }
        },
        {
          title: '校验码',
          dataIndex: 'code'
        }
      ],
      // // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return queryData(
          Object.assign(parameter, { code: this.robotVersionTypeCode }),
          '/RobotVersion/queryRobotVersionMsg'
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
          type: 'radio',
          onSelect: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  created() {},
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 选择机器人
    onSelectChange(record, selected, nativeEvent) {
      console.log(record, selected)
      if (selected) {
        this.robotVersionId = record.id
        console.log(this.robotVersionId)
      }
    },
    add(record) {
      this.visible = true
      this.form.resetFields()
      this.orgName = record.orgName
      this.robotVersionTypeCode = record.robotType + '|' + record.robotVersion + '|' + record.androidTypeId + '|' + record.navigateTypeId
      this.robotVersionType = record.robotTypeName + record.robotVersionName + record.androidType + record.navigateType
      this.orgRobotVersionId = record.id
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
            robotVersion: this.robotVersionId,
            id: this.orgRobotVersionId
          }
          queryData({ ...param, ...values }, '/OrgRobotVersion/editOrgRobotVersionMsg').then(res => {
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
