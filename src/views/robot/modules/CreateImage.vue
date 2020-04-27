<template>
  <!-- 新增弹框 -->
  <a-modal
    title="新建"
    style="top: 0px;"
    :width="'60%'"
    v-model="visible"
    @ok="handleSubmit"
    :destroyOnClose="true"
    :maskClosable="false"
    :keyboard="true"
    v-preventReClick
  >
    <a-form :form="form">
      <a-form-item label="显示类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择显示类型"
          optionFilterProp="children"
          style="width: 300px"
          @change="handleAppImageChange"
          :filterOption="filterOption"
          v-decorator="['typeId',{rules: [{required: true, message: '必填项' }]}]"
        >
          <!-- 选择列表 -->
          <a-select-option
            v-for="(item) in imageTypeList"
            :key="item.typeId"
            :value="item.typeId"
          >{{ item.type }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="资源类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group
          name="radioGroup"
          @change="changePicRadio"
          v-model="radioValue">
          <a-radio :value="1">文件库</a-radio>
          <a-radio :value="2">网络资源</a-radio>
          <a-radio :value="3">自定义模块</a-radio>
          <a-radio :value="4">重新上传</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="图片库" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.showPic">
        <a-select
          showSearch
          placeholder="试着找找已存在的？"
          optionFilterProp="children"
          style="width: 200px"
          :filterOption="filterOption"
          @change="handleAppImageChange2"
          :allowClear=true
          v-decorator="['picUrl',{rules: [{required: true, message: '必填项' }]}]"
        >
          <a-select-option
            v-for="(item) in imageList"
            :key="item.fileName"
            :value="item.fileUrl"
          >{{ item.fileName }}</a-select-option>
        </a-select>
        <a-divider type="vertical" />
      </a-form-item>
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.showName">
        <a-input
          v-decorator="[
            'name',
            {rules: [{required: true, message: '名称' }]}
          ]"
          placeholder="名称"
        />
      </a-form-item>
      <a-form-item label="访问地址" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.showNetUrl">
        <a-input
          v-decorator="[
          'netUrl',
            {rules: [{required: true, message: '必填项' }]}
          ]"
          placeholder="访问地址"
        />
      </a-form-item>
      <a-form-item label="自定义模块" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="descnVisible">
        <a-input
          placeholder="使用英文“,”间隔(不限个数)"
          v-decorator="[
            'descn',
            {rules: [{required: true, message: '必填项' }]}
          ]"/>
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
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="appImageVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="appImageWebUrl" />
        </a-modal>
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
          <div
            slot="filterDropdown"
            slot-scope="{ setSelectedKeys, selectedKeys, clearFilters, column }"
            style="padding: 8px"
          >
            <a-input
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              style="width: 188px; margin-bottom: 8px; display: block;"
            />
            <a-button
              type="primary"
              @click="() => handleSearch(selectedKeys)"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px">Search</a-button>
            <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px">Reset</a-button>
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        </s-table>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData, addData } from '@/api/common'
import { STable } from '@/components'
import { uploadUrl } from '@/api/upload'
export default {
  components: {
    STable
  },
  data () {
    return {
      showNetUrl: false,
      uploadPic: false, // 重新上传框
      fileName: '', // 重新上传文件名
      showName: false, // 文件名称
      showPicRadio: false,
      uploadRadio: '',
      showPic: true,
      descnVisible: false, // 备注是否隐藏
      appImageVisible: false,
      appImageWebUrl: '', // 图片访问地址
      picName: '', // 图片名称
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
      fileList: [],
      descn: '', // 选择网页时的备注
      typeId: '',
      robotCode: '',
      imageTypeList: [
        {
          typeId: 0,
          type: '开机'
        },
        {
          typeId: 1,
          type: '休息'
        },
        {
          typeId: 2,
          type: 'LOGO'
        },
        {
          typeId: 3,
          type: '主页'
        }
      ],
      imageList: [],
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '机器人名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '机器人编码',
          dataIndex: 'code',
          scopedSlots: {
            customRender: 'code',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var id = JSON.parse(localStorage.getItem('user')).id
        var orgId = JSON.parse(localStorage.getItem('user')).orgId
        // console.log('user 请求', parameter)
        var params = {
          type: 1, // 判断标识 新增操作传1 修改操作传2
          imageType: this.typeId,
          code: this.robotCode,
          orgId: orgId,
          userId: id
        }
        return queryData(Object.assign(parameter, params), '/robotInfo/loadRobotPageListByAppImage').then(res => {
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
      },
      optionAlertShow: false,
      url: '',
      radioValue: 1
    }
  },
  methods: {
    // 检索
    handleSearch (selectedKeys) {
      this.robotCode = selectedKeys[0]
      console.log(this.robotCode)
      this.$refs.table.refresh()
    },
    handleReset (clearFilters) {
      clearFilters()
      this.robotCode = ''
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
    // 类型选择列表监听事件
    handleAppImageChange (value) {
      this.typeId = value
      this.robotCode = ''
      this.$refs.table.refresh()
    },
    // 公共图片选择列表监听事件
    handleAppImageChange2 (value, option) {
      if (option == undefined) {
        this.showNetUrl = true
        this.uploadPic = true
      } else {
        this.uploadPic = false
        this.showNetUrl = false
        this.picName = option.key
      }
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 选择机器人
    onSelectChange (record, selected, nativeEvent) {
      // console.log(record, selected)
      if (selected) {
        this.selectedRowKeys.add(record.id)
      } else {
        this.selectedRowKeys.delete(record.id)
      }
    },
    onSelectChangeAll (selected, changeRows) {
      if (selected) {
        changeRows.map((value, index) => {
          this.selectedRowKeys.add(value.id)
        })
      } else {
        this.selectedRowKeys.clear()
      }
    },

    add () {
      this.url = uploadUrl + 'appImage/fileUpload'
      this.visible = true
      this.selectedRowKeys.clear()
      this.getImageList()
      this.showNetUrl = false
      this.uploadPic = false // 重新上传框
      this.showName = false // 文件名称
      this.showPicRadio = false
      this.showPic = true
      this.descnVisible = false // 备注是否隐藏
      this.appImageVisible = false
      this.typeId = ''
      this.robotCode = ''
      this.radioValue = 1
    },

    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      var _this = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.fileName == '' && this.uploadRadio =='4' ) {
            this.$message.error('请上传图片')
            return
          }
          var param = {
            robotId: [..._this.selectedRowKeys],
            picName: this.picName,
            fileName: this.fileName
          }
          queryData({ ...param, ...values }, '/appImage/save').then(res => {
            if (res.code == 0) {
              _this.$message.success('新建成功')
              this.fileName = ''
              this.typeId = ''
              this.descn = '' // 网页备注
              this.name = ''
              _this.fileList = []
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
    async handlePreview (file) {
      console.log(file)
      this.appImageWebUrl = file.url || file.thumbUrl
      this.appImageVisible = true
      console.log(this.appImageWebUrl)
    },
    // 文件监听
    handleChange ({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.fileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.fileList = fileList
    },
    // 删除文件
    handleRemoveFile (file) {
      const _this = this
      queryData({ fileName: file.response.fileName }, '/appImage/delFile').then(res => {
        if (res.code == 0) {
          _this.$message.success(res.message)
          return true
        } else {
          _this.$message.error(res.message)
          return false
        }
      })
    },
    handleCancel () {
      this.appImageVisible = false
    }
  }
}
</script>
