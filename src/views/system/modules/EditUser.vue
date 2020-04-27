<template>
  <!-- 编辑弹框 -->
  <a-modal
    title="编辑"
    style="top: 20px;"
    :width="600"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item label="登录名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="登录名"
          v-decorator="[
            'loginName',
            {
              rules: [{ required: true, message: '请输入登录名' }],
              initialValue: editData.loginName,
            }]"
        />
      </a-form-item>
      <a-form-item label="单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择所属单位"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
            'org',
            {rules: [{ required: true, message: '请选择' }],
            initialValue: editData.orgName}
          ]"
        >
          <a-select-option v-for="(item ,key) in orgNames" :key="key" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择角色名称"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
            'role',
            {rules: [{ required: true, message: '请选择' }],
            initialValue: editData.roleNames}
          ]"
        >
          <a-select-option
            v-for="(item ,key) in roleNames"
            :key="key"
            :value="item.id"
          >{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'userName',
            {rules: [{ required: true, message: '请输入用户名' }],
            initialValue: editData.userName}
          ]"
          placeholder="用户名"
        />
      </a-form-item>
      <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'mobile',
            {rules: [{ message: '请输入手机号' }],
            initialValue: editData.mobile}
          ]"
          placeholder="手机号"
        />
      </a-form-item>
      <a-form-item label="是否生效" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          @change="handleChange"
          v-decorator="[
            'isDel',
            {rules: [{ required: true, message: '请选择' }],
            initialValue: ( editData.isDel == 1 ) ? '有效' : '无效'}
          ]"
        >
          <a-select-option value="1">生效</a-select-option>
          <a-select-option value="0">无效</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData, addData } from '@/api/common'

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
      confirmLoading: false,

      form: this.$form.createForm(this),
      orgNames: [],
      roleNames: [],
      editData: {},
      org: 0,
      role: 0,
      isDel: 0
    }
  },
  created() {
    this.handleRoleList()
    this.handleOrgList()
  },
  methods: {
    // 获取角色
    handleRoleList() {
      var _this = this
      var roleId = JSON.parse(localStorage.getItem('user')).roleId
      queryData({ role: roleId }, '/userManage/getAllSysRole').then(res => {
        console.log(res)
        _this.roleNames = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },
    // 获取单位下的单位
    handleOrgList() {
      var orgId = JSON.parse(localStorage.getItem('user')).orgId
      var param = { org: orgId }
      var _this = this
      queryData(param, '/userManage/getHrOrgByPid').then(res => {
        console.log(res)
        _this.orgNames = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },
    add(record) {
      console.log(record)
      this.form.resetFields()
      this.org = record.org
      this.role = record.role
      this.isDel = record.isDel
      this.visible = true
      this.editData = record
    },
    handleChange(value) {
      this.isDel = value
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.role = Number.isInteger(values.role) ? values.role : this.role
          values.org = Number.isInteger(values.org) ? values.org : this.org
          values.isDel = Number.isInteger(values.isDel) ? values.isDel : this.isDel
          var param = Object.assign(values, { id: this.editData.id })
          var _this = this
          setTimeout(() => {
            addData(param, '/userManage/editUserMsg').then(res => {
              if (res.code == 0) {
                _this.$message.success('修改成功')
                // 重置输入框内容
                _this.form.resetFields()
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
              } else {
                _this.$message.error(res.message)
              }
            })
          }, 300)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
