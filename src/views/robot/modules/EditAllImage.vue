<template>
  <!-- 新增弹框 -->
  <a-modal
    title="批量修改屏幕显示"
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
      <a-form-item label="显示类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择显示类型"
          optionFilterProp="children"
          style="width: 150px"
          @change="handleAppImageChange"
          :filterOption="filterOption"
          v-decorator="['typeId',{rules: [{required: true,  message: '必填项' }],initialValue:typeId}]"
        >
          <a-select-option
            v-for="(item) in imageTypeList"
            :key="item.typeId"
            :value="item.typeId"
          >{{item.type}}</a-select-option>
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
      <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="updataVisible">
        <a-select
          showSearch
          placeholder="试着找找已存在的？"
          optionFilterProp="children"
          style="width: 200px"
          :filterOption="filterOption"
          @change="handleAppImageChange2"
        >
          <a-select-option
            v-for="(item) in imageList"
            :key="item.fileName"
            :value="item.fileName"
          >{{item.name}}</a-select-option>
        </a-select>
        <a-divider type="vertical" />
      </a-form-item>
      <a-form-item label="模块区域" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="descnVisible">
        <a-input v-model="descn" placeholder="使用英文“,”间隔(不限个数)" style="width: 600px" />
      </a-form-item>
      <a-form-item label="重新上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="updataVisible">
        <a-upload
          action="http://robot.lovechuangchuang.com:8085/appImage/fileUpload"
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
        <a-input v-model="name" placeholder="<给新图片取个名字吧><非必填>" style="width: 600px" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData, addData } from '@/api/common'
import { STable } from '@/components'
export default {
  components: {
    STable
  },
  data() {
    return {
      showEditCmd: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      updataVisible: false,
      descnVisible: false, //备注是否隐藏

      confirmLoading: false,
      form: this.$form.createForm(this),
      fileList: [],
      fileName: '', //文件名
      name: '', //图片名称
      appImageVisible: false,
      appImageWebUrl: '', //图片访问地址
      descn: '', //选择网页时的备注
      typeId: '',
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
      imageList: [
        {
          fileName: '123456.png',
          name: '党建待机（创创）'
        },
        {
          fileName: '123457.png',
          name: '教育待机（创创）'
        },
        {
          fileName: '123458.png',
          name: '医疗待机（创创）'
        },
        {
          fileName: '123459.png',
          name: '政务待机（创创）'
        }
      ],
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
          scopedSlots: { customRender: 'code' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var id = JSON.parse(localStorage.getItem('user')).id
        var orgId = JSON.parse(localStorage.getItem('user')).orgId
        console.log('user 请求', parameter)
        var params = {
          type: 2, //判断标识 新增操作传1 修改操作传2
          imageType: this.typeId,
          code: '',
          orgId: orgId,
          userId: id
        }
        return queryData(Object.assign(parameter, params), '/robotInfo/loadRobotPageListByAppImage').then(res => {
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
      },
      optionAlertShow: false
    }
  },
  created() {},
  methods: {
    //类型选择列表监听事件
    handleAppImageChange(value) {
      this.typeId = value
      if (value == 3) {
        ;(this.descnVisible = true), (this.updataVisible = false)
      } else {
        ;(this.descnVisible = false), (this.updataVisible = true)
      } //选择网页的时候会弹出备注选择项
      this.$refs.table.refresh()
    },
    //公共图片选择列表监听事件
    handleAppImageChange2(value) {
      this.fileName = value
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 选择机器人
    onSelectChange(record, selected, nativeEvent) {
      console.log(record, selected)
      if (selected) {
        this.selectedRowKeys.add(record.id)
      } else {
        this.selectedRowKeys.delete(record.id)
      }
    },
    onSelectChangeAll(selected, changeRows) {
      if (selected) {
        changeRows.map((value, index) => {
          this.selectedRowKeys.add(value.id)
        })
      } else {
        changeRows.map((value, index) => {
          this.selectedRowKeys.delete(value.id)
        })
      }
    },

    add() {
      this.visible = true
      this.selectedRowKeys.clear()
    },

    handleSubmit() {
      let org = JSON.parse(localStorage.getItem('user')).orgId
      const {
        form: { validateFields }
      } = this
      var _this = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.fileName == '' && this.typeId != 3) {
            this.$message.error('请上传图片')
            return
          }
          var param = {
            robotId: [..._this.selectedRowKeys],
            fileName: this.fileName, //文件名
            orgId: org,
            type: this.typeId, //文件类型
            descn: this.descn, //网页备注
            name: this.name //图片名称
          }
          queryData({ ...param, ...values }, '/appImage/updateAll').then(res => {
            if (res.code == 0) {
              _this.$message.success('新建成功')
              this.fileName = ''
            } else {
              _this.$message.error(res.message)
            }
            _this.fileList = []
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
    handlePreview(file) {
      console.log(file)
      this.appImageWebUrl = file.url || file.thumbUrl
      this.appImageVisible = true
    },
    //文件长传监听
    handleChange({ fileList }) {
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
    },
    // 删除文件
    handleRemoveFile(file) {
      let _this = this
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
    handleCancel() {
      this.appImageVisible = false
    }
  }
}
</script>
