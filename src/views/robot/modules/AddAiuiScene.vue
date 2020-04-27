<template>
  <!-- 编辑弹框 -->
  <a-modal
    title="添加AIUI"
    style="top: 0px;"
    :width="1000"
    :destroyOnClose="true"
    :maskClosable="false"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="AIUI名称">
                <a-input v-model="queryParam.name" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchData()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <br />
      <!--    <p>问答库列表：</p>-->
      <s-table
        ref="table"
        size="middle"
        rowKey="code"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      </s-table>
    </a-card>
  </a-modal>
</template>

<script>
import { addData, queryData } from '@/api/common'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable
  },
  data() {
    return {
      // orgId: '',
      robotCode: '',
      orgNames: [],
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
      selectedRowKeys: '',
      // 查询参数
      queryParam: {
        orgId: '',
        name: ''
      },
      options: {
        alert: {
          show: true
        },
        rowSelection: {
          onSelect: this.onSelectChange,
          // onSelectAll: this.onSelectChangeAll,
          type: 'radio'
        }
      },
      optionAlertShow: false,
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'AIUI场景名称',
          dataIndex: 'descn',
          scopedSlots: { customRender: 'descn' }
        },
        {
          title: 'AIUI场景编码',
          dataIndex: 'scene',
          scopedSlots: { customRender: 'scene' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return queryData(
          Object.assign(parameter, this.queryParam, { robotCode: this.robotCode }),
          '/aiuiScene/getAdditableAiui'
        ).then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  created() {},
  methods: {
    show(record) {
      this.visible = true
      // this.orgId = record.orgId
      this.robotCode = record.code
      this.selectedRowKeys = ''
    },
    // 搜索内容
    searchData() {
      this.$refs.table.refresh(true)
    },

    // 表单重置
    resetQuery() {
      this.queryParam = { orgId: '', name: '' }
      this.$refs.table.refresh(true)
    },
    handleSubmit() {
      // console.log(this.selectedRowKeys.size)
      // if (this.selectedRowKeys.size > 1) {
      //   this.$message.error('只能选择一项aiui场景！')
      //   return
      // }
      // if (this.selectedRowKeys.size == 0) {
      //   this.$message.error('请选择一项aiui场景！')
      //   return
      // }
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const param = { robotCode: this.robotCode, aiuiScene: this.selectedRowKeys }
          const _this = this
          queryData(param, '/aiuiRobot/saveAiuiRobot').then(res => {
            console.log(res)
            if (res.code == 0) {
              _this.$message.success('配置成功')
              _this.visible = false
              _this.$emit('ok', values)
            } else {
              _this.$message.error(res.message)
            }
          })
        }
      })
    },

    onSelectChange(record, selected, nativeEvent) {
      if (selected) {
        this.selectedRowKeys = record.scene
      } else {
        this.selectedRowKeys = ''
      }
    }
  }
}
</script>
<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.anticon anticon-eye-o {
  display: none;
}
.ant-upload-list-item-actions a {
  display: none;
}
</style>
