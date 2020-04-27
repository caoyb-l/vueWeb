<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="机器人编码">
              <a-input v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchData()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" icon="plus" v-action:add @click="$refs.createModal.add()">新建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <!-- 表单文字过长，省略展示文字内容 -->
      <span slot="remark" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEditVisible(record)" v-action:edit>编辑</a>
          <a-divider type="vertical" v-action:delete />
          <a @click="handleDeleteUser(record)" v-action:delete>删除</a>
        </template>
      </span>
    </s-table>
    <edit-form ref="editModal" @ok="handleRefresh" />
    <create-form ref="createModal" @ok="handleRefresh" />
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { PageView } from '@/layouts'
import EditForm from './modules/EditTimedTask'
import CreateForm from './modules/AddTimedTask'
import { queryData } from '@/api/common'
import { uploadUrl } from '@/api/upload'
export default {
  name: 'TableList',
  components: {
    Ellipsis,
    STable,
    PageView,
    EditForm,
    CreateForm
  },
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      url: uploadUrl,
      // 查询参数
      queryParam: {
        name: '',
        navigateType: '',
        androidType: ''
      },
      editData: {},
      options: {
        alert: false,
        rowSelection: null
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '机器人编码',
          dataIndex: 'robotCode'
        },
        {
          title: '定时任务描述',
          dataIndex: 'taskDesc'
        },
        {
          title: '执行命令集',
          dataIndex: 'cmdName'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '创建时间',
          dataIndex: 'createDate'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate'
        },
        {
          title: '单位',
          dataIndex: 'orgName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('App 请求', parameter)
        return queryData(Object.assign(parameter, this.queryParam), '/timedTask/queryTaskMsg')
          .then(res => {
            console.log(res)
            return res.result
          })
      }
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  methods: {
    // 下拉框
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 处理更新
    handleRefresh () {
      this.$refs.table.refresh()
    },
    // 表单重置
    resetQuery () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleEditVisible (record) {
      this.$refs.editModal.edit(record)
    },
    // 搜索内容
    searchData () {
      this.$refs.table.refresh(true)
    },
    // 删除
    handleDeleteUser (record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除定时任务吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var param = { id: record.id, robotCode: record.robotCode }
            queryData(param, '/timedTask/delTaskMsg').then(res => {
              console.log('删除返回值：', res)
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh()
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
  }

}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
