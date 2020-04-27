<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="主题名称">
              <a-input v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="searchData()">查询</a-button>
            <a-button style="margin-left: 10px" @click="resetQuery()">重置</a-button>
            <a-button style="margin-left: 10px" type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="middle"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEditVisible(record)" v-action:edit>编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)" v-action:delete>删除</a>
        </template>
      </span>
    </s-table>
    <create-model ref="createModal" @ok="handleRefresh"></create-model>
    <edit-model ref="editModal" @ok="handleRefresh"></edit-model>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import { queryData } from '@/api/common'
import CreateModel from './modules/CreateTheme'
import EditModel from './modules/EditTheme'

export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    CreateModel,
    EditModel
  },
  data() {
    return {
      // 查询参数
      queryParam: {
        name: ''
      },
      cmdTypeList: [],
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '模版名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '单位',
          dataIndex: 'orgName',
          scopedSlots: { customRender: 'orgName' }
        },
        {
          title: '系统版本',
          dataIndex: 'robot_Version',
          scopedSlots: { customRender: 'robot_Version' }
        },
        {
          title: '创建人',
          dataIndex: 'created_User',
          scopedSlots: { customRender: 'created_User' }
        },
        {
          title: '时间',
          dataIndex: 'codecreated_Time',
          scopedSlots: { customRender: 'created_Time' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const org = JSON.parse(localStorage.getItem('user')).orgId
        const user = JSON.parse(localStorage.getItem('user')).id
        return queryData(Object.assign(parameter,{ orgId: org, user: user},this.queryParam), '/robotTheme/list').then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  computed: {
    // title() {
    //   return this.$route.meta.title
    // }
  },
  methods: {
    // 处理刷新
    handleRefresh() {
      this.$refs.table.refresh(true)
    },
    // 表单重置
    resetQuery() {
      this.queryParam = {
          name: ''
        }
      this.$refs.table.refresh(true)
    },
    handleEditVisible(record) {
      this.$refs.editModal.edit(record)
    },
    // 搜索内容
    searchData() {
      this.$refs.table.refresh(true)
    },
    // 删除
    handleDelete(record) {
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
            setTimeout(Math.random() > 0.5 ? resolve : reject, 200)
            var id = { entityId: record.id }
            queryData(id, '/robotTheme/delete').then(res => {
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
    }
  }
}
</script>
