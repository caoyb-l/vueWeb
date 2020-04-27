<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="命令名称">
              <a-input v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="命令名称参数类型">
              <a-select
                v-model="queryParam.typeId"
                showSearch
                placeholder="选择命令名称参数类型"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="(item ,key) in cmdTypeList"
                  :key="key"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
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
import CreateModel from './modules/CreateCellcmd'
import EditModel from './modules/EditCellcmd'
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
        name: '',
        typeId: ''
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
          title: '编号',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '命令名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '命令名称参数类型',
          dataIndex: 'typeName',
          scopedSlots: { customRender: 'typeName' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return queryData(Object.assign(parameter, this.queryParam), '/cmdUnit/list').then(res => {
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
  created() {
    this.getCmdType()
  },
  methods: {
    // 获取单元指令类型
    getCmdType() {
      queryData({}, '/cmdUnitType/getCmdUnitTypeList').then(res => {
        console.log(res)
        if (res.code == 0) {
          this.cmdTypeList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 下拉框
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
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
            queryData(id, '/cmdUnit/delete').then(res => {
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
