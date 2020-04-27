<template>
  <!-- 编辑弹框 -->
  <a-modal
    title="添加问答库"
    style="top: 0px;"
    :width="1200"
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
              <a-form-item label="问答库名称">
                <a-input v-model="queryParam.name" />
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="24">
              <a-form-item label="所属单位">
                <a-select
                  v-model="queryParam.orgId"
                  showSearch
                  placeholder="选择所属单位"
                  optionFilterProp="children"
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="(item ,key) in orgNames"
                    :key="key"
                    :value="item.id"
                  >{{ item.name }}</a-select-option>
                </a-select>
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
      robotId: '',
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
      selectedRowKeys: new Set([]),
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
          onSelectAll: this.onSelectChangeAll
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
          title: '场景名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '单位',
          dataIndex: 'orgId',
          scopedSlots: { customRender: 'orgId' }
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'createDate' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let orgId
        if (this.queryParam.orgId > 0) {
          orgId = this.queryParam.orgId
        } else {
          orgId = JSON.parse(localStorage.getItem('user')).orgId
        }
        return queryData(
          Object.assign(parameter, this.queryParam, { robotCode: this.robotCode, orgId: orgId }),
          '/skillsType/getRobotSkillsType'
        ).then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  created() {
    this.handleOrgLists()
  },
  methods: {
    show(record) {
      this.visible = true
      // this.orgId = record.orgId
      this.robotCode = record.code
      this.robotId = record.id
      this.selectedRowKeys.clear()
    },
    // 搜索内容
    searchData() {
      this.$refs.table.refresh(true)
    },
    // 获取该用户下的所属单位
    handleOrgLists() {
      var _this = this
      var orgId = JSON.parse(localStorage.getItem('user')).orgId
      var param = { org: orgId }
      queryData(param, '/userManage/getHrOrgByPid')
        .then(res => {
          _this.orgNames = res.result
          if (res.code !== 0) {
            _this.$message.error(res.message)
          }
        })
        .catch(err => console.log(err))
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 表单重置
    resetQuery() {
      this.queryParam = { orgId: '', name: '' }
      this.$refs.table.refresh(true)
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const param = { robotCode: this.robotCode, robotId: this.robotId, skillType: [...this.selectedRowKeys] }
          const _this = this
          queryData(param, '/skillsRobot/save').then(res => {
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
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },

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
