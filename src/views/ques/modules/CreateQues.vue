<template>
  <!-- 新增弹框 -->
      <a-modal
      title="新建"
      style="top: 150px;"
      :width="600"
      v-model="visible"
      @ok="handleSubmit"
      v-preventReClick
      :destroyOnClose="true"
      :maskClosable = "false"
    >
    <a-form :form="form">
      <a-form-item
        label="名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'title',
            {rules: [{ required: true, message: '请输入名称' }]}
          ]"
          placeholder="名称" />
      </a-form-item>
      <a-form-item
        label="别名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'depict',
            {rules: [{message: '请输入别名' }]}
          ]"
          placeholder="别名"
           />
      </a-form-item>
      <!-- 默认回答输入框 -->
      <a-form-item
        label="回答："
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea
            placeholder="默认回答内容"
            rows="3"
            v-decorator="[
            'contents',
            {rules: [{required: true,message: '请输入默认回答内容' }]}
          ]"
          />
      </a-form-item>
      <!-- 默认回答输入框 -->
        <!-- <div>
          <a-textarea
          placeholder="请输入默认回答内容"
          style="margin-bottom:0px;margin-top:0px;width:75%"
          rows="2"
          v-model="contents"
        />
        <a-button type="primary" style="margin-left: 12px" @click="updateContents">确定</a-button>
        </div> -->
      <!-- <a-form-item
        label="是否公共"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-switch
         v-decorator="[
            'isPub'
          ]"
         checkedChildren="是" unCheckedChildren="否" v-model="isPub"   />
      </a-form-item> -->
    </a-form>
    </a-modal>
</template>

<script>
import { addBusinessQues } from '@/api/ques'

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
      isPub:false
    }
  },
  methods: {
    onChange(check){
      console.log('check:',check);
    },
    add() {
      this.visible = true
    },
    handleSubmit() {
      const { form: { validateFields } } = this
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          var _this = this
          setTimeout(() => {
            let isPub = ( values.isPub == undefined || values.isPub == false ) ? 0 : 1 ;
            values.isPub = isPub;
            let userObj = JSON.parse(localStorage.getItem('user'));
            let [orgId,user,descn] = [userObj.orgId,userObj.id,1];
            let param = Object.assign(values,{orgId,user,descn});
            addBusinessQues(param).then(res => {
              if (res.code == 0) {
                _this.$message.success('新建成功')
              } else {
                _this.$message.error(res.message)
              }
              _this.visible = false
                _this.confirmLoading = false
                _this.$emit('ok', values);
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
