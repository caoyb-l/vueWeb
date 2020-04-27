<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="地图名称">
              <a-input v-model="queryParam.mapName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="机器人名称">
              <a-input v-model="queryParam.robotName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="所属单位">
              <a-select
                v-model="queryParam.queryOrgId"
                showSearch
                placeholder="选择所属单位"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="(item ,key) in orgNames"
                  :key="key"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-button type="primary" @click="searchData()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
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
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEditVisible(record)" v-action:edit>编辑</a>
          <a-divider type="vertical" v-action:edit />
          <a @click="handleShowMap(record)">查看记录点</a>
        </template>
      </span>
    </s-table>
    <edit-map ref="editModal" @ok="handleOk" />
    <show-map ref="showMap" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import ShowMap from './modules/ShowMap'
import EditMap from './modules/EditMap'
import { queryData } from '@/api/common'

export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    ShowMap,
    EditMap
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        robotName: '',
        mapName: '',
        queryOrgId: ''
      },
      columns: [
        {
          title: '地图编码',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '地图名称',
          dataIndex: 'mapName',
          scopedSlots: { customRender: 'mapName' }
        },
        {
          title: '上传时间',
          dataIndex: 'updateDate',
          scopedSlots: { customRender: 'updateDate' }
        },
        {
          title: '上传机器人',
          dataIndex: 'robotName',
          scopedSlots: { customRender: 'robotName' }
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var userId = JSON.parse(localStorage.getItem('user')).id
        var orgId = JSON.parse(localStorage.getItem('user')).orgId
        return queryData(
          Object.assign(parameter, this.queryParam, { userId: userId, orgId: orgId }),
          '/robotMapLib/list'
        ).then(res => {
          console.log(res)
          return res.result
        })
      },
      orgNames: []
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.handleOrgLists()
  },
  methods: {
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
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    // 搜索内容
    searchData() {
      this.$refs.table.refresh(true)
    },
    handleOk() {
      this.$refs.table.refresh(true)
    },
    handleEditVisible(record) {
      this.$refs.editModal.add(record)
    },
    handleShowMap(record) {
      this.$refs.showMap.add(record)
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
