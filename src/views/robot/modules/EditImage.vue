<template>
  <a-modal
    title="编辑屏幕显示"
    style="top: 20px;"
    :width="'50%'"
    v-model="visible"
    @ok="handleSubmit"
    :destroyOnClose="true"
    v-preventReClick
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item label="触发类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-model="edit.typeName" :disabled="true" placeholder="触发类型" />
      </a-form-item>
      <a-form-item label="图片来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group
          name="radioGroup"
          :defaultValue="defaultValue"
          @change="changePicRadio">
          <a-radio :value="1">文件库</a-radio>
          <a-radio :value="2">网络资源</a-radio>
          <a-radio :value="3">自定义模块</a-radio>
          <a-radio :value="4">重新上传</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="showPic">
        <a-select
          showSearch
          placeholder="试着找找已存在的？"
          optionFilterProp="children"
          style="width: 200px"
          :filterOption="filterOption"
          @change="handleAppImageChange2"
          v-decorator="[
            'picUrl',
            {rules: [{required: true, message: '请添加图片' }],initialValue:edit.fileName}
          ]"
        >
          <a-select-option
            v-for="(item) in imageList"
            :key="item.fileName"
            :value="item.fileUrl"
          >{{ item.fileName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{required: true, message: '名称' }],initialValue:edit.name}
          ]"
          placeholder="名称"
        />
      </a-form-item>
      <a-form-item label="自定义" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="descnVisible">
        <a-input
          v-decorator="[
            'descn',
            {rules: [{required: true, message: '必填项' }],initialValue:edit.keyWordStr}
          ]"
          placeholder="自定义"
        />
      </a-form-item>
      <a-form-item label="访问地址" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.showNetUrl">
        <a-input
          v-decorator="[
            'netUrl',
            {rules: [{required: true, message: '必填项' }],initialValue:edit.fileName}
          ]"
          placeholder="访问地址"
        />
      </a-form-item>
      <a-form-item label="重新上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="uploadPic">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="fileList"
          :remove="handleRemoveFile"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="appImageVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="appImageWebUrl" />
        </a-modal>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData, addData } from '@/api/common'
import { STable } from '@/components'
import { uploadUrl } from '@/api/upload'
import { constants } from 'fs'
export default {
  components: {
    STable
  },
  data () {
    return {
      edit: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      defaultValue: 1,
      uploadPic: false,
      showNetUrl: false,
      visible: false,
      fileName: '',
      picName: '',
      uploadRadio: '',
      appImageVisible: false,
      showPic: true,
      appImageWebUrl: '', // 图片访问地址
      descnVisible: false,
      fileList: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      queryParam: {},
      imageList: [],
      options: false,
      optionAlertShow: false,
      url: ''
    }
  },
  methods: {
    getImageList () {
      const id = JSON.parse(localStorage.getItem('user')).orgId
      var param = { orgId: id }
      var _this = this
      queryData(param, '/skillOptionFile/getFileListByType').then(res => {
        _this.imageList = res.picture
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },
    changePicRadio (option) {
      console.log(option.target.value)
      const values = option.target.value
      this.uploadRadio = values
      // 资源库
      if (values == '1') {
        this.showPic = true
        this.uploadPic = false
        this.showName = false
        this.showNetUrl = false
        this.descnVisible = false
      }
      // 网络资源
      if (values == '2') {
        this.showPic = false
        this.uploadPic = false
        this.showName = true
        this.showNetUrl = true
        this.descnVisible = false
        this.picName = ''
      }
      // 自定义模块
      if (values == '3') {
        this.showPic = false
        this.uploadPic = false
        this.showName = true
        this.showNetUrl = false
        this.descnVisible = true
        this.picName = ''
      }
      // 重新上传
      if (values == '4') {
        this.showPic = false
        this.uploadPic = true
        this.showName = true
        this.showNetUrl = false
        this.descnVisible = false
      }
    },
    add (record) {
      console.log(record)
      this.getImageList()
      this.visible = true
      if (record.keyWordStr != undefined) {
        this.defaultValue = 3
        this.descnVisible = true
        this.showPic = false
      } else {
        this.defaultValue = 1
        this.showPic = true
        this.descnVisible = false
      }
      this.edit = record
      this.url = uploadUrl + 'appImage/fileUpload'
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      var _this = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.fileName == '' && this.uploadRadio =='4') {
            this.$message.error('请上传图片')
            return
          }
          var param = {
            id: _this.edit.id,
            fileName: this.fileName
          }
          console.log(param)
          console.log(values)
          queryData({ ...param, ...values }, '/appImage/edit').then(res => {
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
    handleCancel () {
      this.appImageVisible = false
    },
    // 公共图片选择列表监听事件
    handleAppImageChange2 (value, option) {
      this.edit.name = option.key
    },
    // 文件预览
    handlePreview (file) {
      console.log(file.url + '/' + file.thumbUrl)
      this.appImageWebUrl = file.url || file.thumbUrl
      this.appImageVisible = true
    },
    // 删除文件
    handleRemoveFile (file) {
      const _this = this
      queryData({ fileName: file.response.fileName }, '/appImage/delFile').then(res => {
        if (res.code == 0) {
          _this.$message.error(res.message)
          return true
        } else {
          _this.$message.error(res.message)
          return false
        }
      })
    },
    // 文件长传监听
    handleChange ({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          console.log(res)
          if (res.code == 0) {
            this.fileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.fileList = fileList
    }
  }
}
</script>
