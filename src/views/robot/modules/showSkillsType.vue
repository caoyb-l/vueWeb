<template>
  <a-modal
    title="问答库列表"
    style="top: 0px;"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
    :width="1000"
    v-model="visible"
    @ok="handleSubmit"
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
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="searchData()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="middle"
        rowKey="no"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-switch
              :defaultChecked="record.isAble==1?true:false"
              @click="handleIsAble ($event,record)"
            >
              <a-icon type="check" slot="checkedChildren" />
              <a-icon type="close" slot="unCheckedChildren" />
            </a-switch>
            <a-divider type="vertical" />
            <a @click="deleteSkillsType(record)">彻底删除</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { queryData } from '@/api/common'
export default {
  components: {
    STable
  },
  watch: {
    code(values) {
      console.log(values), this.$refs.table.refresh(true)
    }
  },
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
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '问答库名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '所属单位',
          dataIndex: 'orgName',
          scopedSlots: { customRender: 'orgName' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 查询参数
      queryParam: {
        name: ''
      },
      code: '',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      loadData: parameter => {
        var parma = Object.assign(parameter, { code: this.code }, this.queryParam)
        return queryData(parma, '/skillsRobot/getSkillsRobotList').then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  methods: {
    add(record) {
      this.code = record.code
      this.visible = true
      this.$refs.table.refresh(true)
    },
    // 重置
    resetQuery() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    searchData() {
      this.$refs.table.refresh()
    },
    //禁用
    handleIsAble(checked, record) {
      console.log(checked)
      var _this = this
      var orgId = JSON.parse(localStorage.getItem('user')).orgId
      var param = { entityId: record.id }
      if (checked) {
        param.isAble = 1
      } else {
        param.isAble = 0
      }
      queryData(param, '/skillsRobot/isAble')
        .then(res => {
          _this.orgNames = res.result
          if (res.code !== 0) {
            _this.$message.error(res.message)
          }
        })
        .catch(err => console.log(err))
    },
    //彻底删除
    deleteSkillsType(record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.name} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
            var id = { entityId: record.id }
            queryData(id, '/skillsRobot/delete').then(res => {
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    handleSubmit() {
      this.visible = false
    }
  }
}
</script>