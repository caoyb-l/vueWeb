<template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="5" :sm="24">
              <a-form-item label="唤醒词">
                <a-input v-model="queryParam.wakeKey" />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="命令单元名称">
                <a-input v-model="queryParam.unitName" />
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="24">
              <a-button type="primary" @click="searchData()">查询</a-button>
              <a-button style="margin-left: 10px" @click="resetQuery()">重置</a-button>
              <a-button type="primary" style="margin-left: 10px" icon="plus" @click="$refs.createModal.add()">新建</a-button>
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
import CreateModel from './modules/CreateSupercmd'
import EditModel from './modules/EditSupercmd'

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
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        wakekey: '',
        unitName: ''
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
          title: '唤醒词',
          dataIndex: 'wakeKey',
          scopedSlots: { customRender: 'wakeKey' }
        },
        {
          title: '命令单元编码',
          dataIndex: 'unitId',
          scopedSlots: { customRender: 'unitId' }
        },
        {
          title: '命令单元名称',
          dataIndex: 'unitName',
          scopedSlots: { customRender: 'unitName' }
        },
        {
          title: '命令单元参数',
          dataIndex: 'params',
          scopedSlots: { customRender: 'params' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return queryData(Object.assign(parameter, this.queryParam), '/superCmd/list').then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  methods: {
    // 处理刷新
    handleRefresh() {
      this.$refs.table.refresh(true)
    },
    // 表单重置
    resetQuery() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleEditVisible(record) {
      this.$refs.editModal.add(record)
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
        content: `真的要删除 ${record.wakeKey} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 200)
            var id = { entityId: record.id }
            queryData(id, '/superCmd/delete').then(res => {
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
