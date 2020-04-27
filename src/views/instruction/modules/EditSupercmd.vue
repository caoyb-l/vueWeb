<template>
  <!-- 编辑弹框 -->
  <a-modal
    title="编辑"
    style="top: 20px;"
    :width="1000"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item label="唤醒词" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'wakeKey',
            {rules: [{ required: true, message: '请输入唤醒词' }],
            initialValue: editData.wakeKey,}
          ]"
          placeholder="唤醒词"
        />
      </a-form-item>
      <a-form-item label="参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'params',
            {rules: [{ required: true, message: '请输入参数' }],
            initialValue: editData.params,}
          ]"
          placeholder="参数"
        />
      </a-form-item>
      <div style="margin-left:180px;margin-bottom:30px;">
        <a-button type="primary" @click="choiceCellCmd">选择命令单元</a-button>
      </div>
      <a-form-item label="命令单元" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <div style="border:1px solid #ccc;padding:20px;">
          <a-form-item label="代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-model="cmdObj.code" disabled />
          </a-form-item>
          <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-model="cmdObj.name" disabled />
          </a-form-item>
          <a-form-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      editData: {},
      cmdObj: {
        code: '',
        name: '',
        msg: ''
      }
    }
  },
  methods: {
    add(record) {
      console.log(record)
      this.visible = true
      this.editData = record
      var _this = this
      queryData({ cmdUnitId: record.unitId }, '/cmdUnit/getById').then(res => {
        console.log(res)
        if (res.code == 0) {
          console.log('wer')
          _this.cmdObj.code = res.cmdUnit.id
          _this.cmdObj.name = res.cmdUnit.name
          _this.cmdObj.msg = res.cmdUnit.typeName
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    choiceCellCmd() {
      this.$refs.cellcmd.show(this.cmdObj.code)
      queryData({}, '/cmdUnitType/getCmdUnitTypeList').then(res => {
        console.log(res)
        if (res.code == 0) {
          this.cmdTypeList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getSelectItem(value) {
      this.cmdObj.code = value.id
      this.cmdObj.name = value.name
      this.cmdObj.msg = value.typeName
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            var unit = { unit: this.cmdObj.code }
            var param = Object.assign(values, unit, { entityId: this.editData.id })
            addData(param, '/superCmd/save').then(res => {
              if (res.code == 0) {
                _this.$message.success('编辑成功')
              } else {
                _this.$message.error(res.message)
              }
              _this.visible = false
              _this.confirmLoading = false
              _this.$emit('ok', values)
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
