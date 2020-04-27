<template>
  <!-- 新增弹框 -->
  <a-modal
    title="新建"
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
      <a-form-item
        label="单位名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择所属单位"
          optionFilterProp="children"
          :filterOption="filterOption"
          @change="getSinglechipType"
          v-decorator="[
            'orgId',
            {rules: [{ required: true, message: '请选择' }]}
          ]"
        >
          <a-select-option v-for="(item ,key) in orgNames" :key="key" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="单片机类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择单片机类型"
          optionFilterProp="children"
          :filterOption="filterOption"
          @change="getSinglechip"
          v-decorator="[
            'code',
            {rules: [{required: true, message: '选择单片机类型' }]}
          ]"
        >
          <a-select-option
            v-for="(item,key) in singlechipType"
            :key="key"
            :value="item.id"
            :disabled="item.isDel?true:false"
          >{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="选择单片机版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
  data () {
    return {
      orgNames: [],
      singlechipType: [],
      selectCmd: '',
      singlechipId: '',
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
      confirmLoading: false,
      form: this.$form.createForm(this),
      queryParam: { updateType: '' },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '单片机名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '版本描述',
          dataIndex: 'contents',
          scopedSlots: { customRender: 'contents' }
        }
      ],
      // // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam.updateType == '') {
          this.queryParam.updateType = '999'
        }
        return queryData(
          Object.assign(parameter, this.queryParam),
          '/Singlechip/querySinglechipMsg'
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
  created () {
    this.handleOrgList()
  },
  methods: {
    getSinglechipType (value) {
      // 初始化单片机类型
      this.form.setFieldsValue({
        code: ''
      })
      // 初始化列表
      this.queryParam.updateType = ''
      this.$refs.table.refresh()
      var param = { orgId: value }
      var _this = this
      queryData(param, '/Singlechip/getSinglechipType').then(res => {
        console.log(res.result)
        _this.singlechipType = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },
    // 获取单位下的单位
    handleOrgList () {
      const id = JSON.parse(localStorage.getItem('user')).orgId
      var param = { org: id }
      var _this = this
      queryData(param, '/userManage/getHrOrgByPid').then(res => {
        _this.orgNames = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },

    getSinglechip (value) {
      this.queryParam.updateType = value
      this.$refs.table.refresh()
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 选择机器人
    onSelectChange (record, selected, nativeEvent) {
      console.log(record, selected)
      if (selected) {
        this.singlechipId = record.id
      }
    },
    add () {
      this.form.resetFields()
      this.visible = true
      this.queryParam.updateType = ''
      this.singlechipId = ''
      this.singlechipType = []
    },
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      var _this = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var param = {
            singlechipId: this.singlechipId }
          queryData({ ...param, ...values }, '/OrgSinglechip/addOrgSinglechip').then(res => {
            if (res.code == 0) {
              _this.$message.success('新建成功')
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
      this.visible = false
    }
  }
}
</script>
