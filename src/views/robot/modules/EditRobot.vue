<template>
  <!-- 编辑弹框 -->
  <a-modal
    title="编辑"
    style="top: 20px;"
    :width="700"
    v-model="visible"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item label="机器人名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="机器人名称"
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入机器人名称' }],
              initialValue: editData.name,
            }]"
        />
      </a-form-item>
      <a-form-item label="所属单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择所属单位"
          optionFilterProp="children"
          v-decorator="['orgId', {initialValue: editData.orgName}]"
        >
          <a-select-option v-for="(item,key) in orgNames" :key="key" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="有效截止时间(年)" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="有效截止时间"
          v-decorator="[
            'validity',
            {
              rules: [{ required: true, message: '请输入有效截止时间' }],
              initialValue:editData.validity
            }
            ]"
        />
      </a-form-item>
      <a-form-item label="人脸失效时间(小时)" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'faceTime',
            {rules: [{required:true, message: '请输入人脸失效时间' }],
            initialValue: editData.faceTime}
          ]"
          placeholder="人脸失效时间"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
import moment from 'moment'
export default {
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
      form: this.$form.createForm(this),
      orgNames: [],
      editData: {}
    }
  },
  created() {},
  methods: {
    // 获取该用户下的所属单位
    handleOrgLists() {
      var _this = this
      var orgId = JSON.parse(localStorage.getItem('user')).orgId
      var param = { org: orgId }
      queryData(param, '/userManage/getHrOrgByPid').then(res => {
        _this.orgNames = res.result
      })
    },
    add(record) {
      this.handleOrgLists()
      this.form.resetFields()
      this.editData = record
      this.visible = true
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          var param = {
            code: this.editData.code,
            name: values.name,
            validity: values.validity,
            faceTime: values.faceTime,
            orgId: Number.isInteger(values.orgId) ? values.orgId : this.editData.orgId
          }
          var _this = this
          setTimeout(() => {
            queryData(param, '/robotInfo/save').then(res => {
              console.log(res)
              if (res.code == 0) {
                _this.$message.success('修改成功')
              } else {
                _this.$message.error(res.message)
              }
            })
            this.visible = false
            this.$emit('ok', values)
          }, 300)
        }
      })
    }
  }
}
</script>
