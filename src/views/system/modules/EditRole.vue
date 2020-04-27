<template>
  <a-modal
    title="编辑"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-card :bordered="false" :style="{ height: '100%' }">
      <a-row :gutter="24">
        <a-col :md="24">
          <div style="max-width: 800px">
            <a-form :form="form">
              <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="[
               'rname',
               {rules: [{ required: true, message: '请填写角色名称!' }],
               initialValue:rname}
              ]"
                  placeholder="请填写角色名称"
                />
              </a-form-item>
              <a-form-item label="角色等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="[
               'level',
               {rules: [{ required: true, message: '请填写角色等级!' }],
               initialValue:level}
              ]"
                  placeholder="请填写角色等级"
                />
              </a-form-item>
              <a-form-item label="拥有权限">
                <a-row :gutter="16" v-for="(permission, index) in permissions" :key="index">
                  <a-col :xl="4" :lg="24">{{ permission.name }}</a-col>
                  <a-col :xl="20" :lg="24">
                    <a-checkbox
                      v-if="permission.actionsOptions.length > 0"
                      :indeterminate="permission.indeterminate"
                      :checked="permission.checkedAll"
                      @change="onChangeCheckAll($event, permission)"
                    >全选</a-checkbox>
                    <a-checkbox-group
                      :options="permission.actionsOptions"
                      v-model="permission.selected"
                      @change="onChangeCheck(permission)"
                    />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-form>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </a-modal>
</template>

<script>
import { actionToObject } from '@/utils/permissions'
import pick from 'lodash.pick'
import { queryData, addData } from '@/api/common'

export default {
  name: 'RoleModal',
  props: {
    roleName: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      mdl: {},
      roles: [],
      name: '',
      level: '',
      rname: '',
      form: this.$form.createForm(this),
      permissions: [],
      roleId: 0
    }
  },
  methods: {
    edit(record, name) {
      this.form.resetFields()
      console.log('-----record--------', record)
      this.roleId = record.id
      var param = { role: record.id }
      this.rname = name
      this.level = record.level
      console.log('rnmae:', this.rname)
      queryData(param, '/SysRoleManage/loadResourceMsg')
        .then(RoleData => {
          this.permissions = RoleData.result
          if (RoleData.code !== 0) {
            _this.$message.error(RoleData.message)
          }
          this.mdl = Object.assign({}, record)
          this.visible = true

          // 有权限表，处理勾选
          // if (this.mdl.permissions && this.permissions) {
          //   // 先处理要勾选的权限结构
          //   const permissionsAction = {}
          //   this.mdl.permissions.forEach(permission => {
          //     permissionsAction[permission.permissionId] = permission.actionEntitySet.map(entity => entity.action)
          //   })
          //   // 把权限表遍历一遍，设定要勾选的权限 action
          //   this.permissions.forEach(permission => {
          //     permission.selected = permissionsAction[permission.name] || []
          //   })
          // }
        })
        .catch(err => console.log(err))

      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'name', 'status', 'describe'))
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleSubmit() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          addData(
            { id: _this.roleId, resourceList: _this.permissions, name: values.rname, level: values.level },
            '/SysRoleManage/editSysRoleMsg'
          )
            .then(res => {
              console.log(res)
              if (res.code == 0) {
                _this.$message.success('修改成功')
                // 重置输入框内容
                _this.form.resetFields()
                _this.visible = false
              } else {
                _this.$message.error(res.message)
              }
              _this.confirmLoading = false
              _this.$emit('ok')
            })
            .catch(err => console.log(err))
        }
      })
    },
    handleCancel() {
      this.close()
    },
    onChangeCheck(permission) {
      permission.indeterminate =
        !!permission.selected.length && permission.selected.length < permission.actionsOptions.length
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    onChangeCheckAll(e, permission) {
      Object.assign(permission, {
        selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    }
    // loadPermissions () {
    //   const that = this
    //   console.log('123');
    //   getPermissions().then(res => {
    //     console.log(res);
    //     const result = res.result
    //     that.permissions = result.map(permission => {
    //       const options = actionToObject(permission.actionData)
    //       permission.checkedAll = false
    //       permission.selected = []
    //       permission.indeterminate = false
    //       permission.actionsOptions = options.map(option => {
    //         return {
    //           label: option.describe,
    //           value: option.action
    //         }
    //       })
    //       return permission
    //     })
    //   })
    //   console.log('12232');
    //   console.log(this.permissions);
    // }
  }
}
</script>

<style scoped>
</style>
