<template>
  <!-- 新增弹框 -->
      <a-modal
      title="新建"
      style="top: 20px;"
      :width="1000"
      v-model="visible"
      @ok="handleSubmit"
      v-preventReClick
      :destroyOnClose="true"
      :maskClosable = "false"
    >
    <a-form :form="form">
      <a-form-item
        label="唤醒词"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'wakeKey',
            {rules: [{ required: true, message: '请输入唤醒词' }]}
          ]"
          placeholder="唤醒词" />
      </a-form-item>

      <a-form-item
        label="参数"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'params',
            {rules: [{ required: true, message: '请输入参数' }]}
          ]"
          placeholder="参数" />
      </a-form-item>
      <div style="margin-left:180px;margin-bottom:30px;"><a-button type="primary" @click="choiceCellCmd">选择命令单元</a-button></div>
        <a-form-item
        label="命令单元"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
          <div style="border:1px solid #ccc;padding:20px;">
            <a-form-item
              label="代码"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input v-model="cmdObj.code" disabled />
            </a-form-item>
            <a-form-item
              label="名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input v-model="cmdObj.name" disabled />
            </a-form-item>
            <a-form-item
              label="说明"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input v-model="cmdObj.msg" disabled />
            </a-form-item>
          </div>
        </a-form-item>
    </a-form>
    <cell-modal ref="cellcmd" @ok="getSelectItem"></cell-modal>
    </a-modal>
</template>

<script>
import { addData, queryData } from '@/api/common'
import CellModal from './CellCmdlist'
export default {
  name: 'createSuperCmd',
  components: {
    CellModal
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      cmdObj: {
        code: '',
        name: '',
        msg: ''
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      cmdTypeList: []
    }
  },
  methods: {
    getSelectItem(value) {
      this.cmdObj.code = value.id
      this.cmdObj.name = value.name
      this.cmdObj.msg = value.typeName
    },
    add() {
      this.visible = true
    },
    choiceCellCmd() {
      this.$refs.cellcmd.show()
      queryData({}, '/cmdUnitType/getCmdUnitTypeList').then(res => {
        console.log(res)
        if (res.code == 0) {
          this.cmdTypeList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleSubmit() {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            var unit = { unit: this.cmdObj.code }
            addData(Object.assign(unit, values), '/superCmd/save').then(res => {
              if (res.code == 0) {
                _this.$message.success('新建成功')
                this.cmdObj = {}
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
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
