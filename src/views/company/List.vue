<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <a-input-search style= "margin-bottom: 8px" placeholder="Search" @change="onChange" />
        <s-tree
          :dataSource="orgTree"
          :openKeys.sync="openKeys"
          :search="true"
          @click="handleClick"
          @add="handleAdd"
          @titleClick="handleTitleClick"></s-tree>
      </a-col>
    </a-row>
    <!-- 新增 -->
    <org-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import OrgModal from './modules/OrgModal'
import { getOrgTree, getServiceList } from '@/api/manage'

export default {
  name: 'TreeList',
  components: {
    STable,
    STree,
    OrgModal,
    orgList:[]
  },
  data () {
    return {
      openKeys: ['key-01'],

      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no'
        },
        {
          title: '成员名称',
          dataIndex: 'description'
        },
        {
          title: '登录次数',
          dataIndex: 'callNo',
          sorter: true,
          needTotal: true,
          customRender: (text) => text + ' 次'
        },
        {
          title: '状态',
          dataIndex: 'status',
          needTotal: true
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt',
          sorter: true
        },
        {
          table: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getServiceList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      orgTree: [],
      selectedRowKeys: [],
    }
  },
  created () {
      var id = {userid:1};
      var _this = this;
    getOrgTree(id).then(res => {
      console.log(res);
      _this.orgTree = res.result
      _this.getOrgList(res.result);
    })
  },
  methods: {
    handleClick (e) {
      console.log('handleClick', e)
      this.queryParam = {
        key: e.key
      }
      // this.$refs.table.refresh(true)
    },
    handleAdd (item) {
      console.log('add button, item', item)
      this.$message.info(`提示：你点了 ${item.key} - ${item.title} `)
      this.$refs.modal.add(item.key)
    },
    handleTitleClick (item) {
      console.log('handleTitleClick', item)
    },
    titleClick (e) {
      console.log('titleClick', e)
    },
    handleSaveOk () {

    },
    handleSaveClose () {

    },

    onSelectChange (selectedRowKey) {
      this.selectedRowKeys = selectedRowKeys
    },
    //   获取用于搜索的list数组
    getOrgList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.title;
        const orgid = node.orgid;
        const pid = node.pid;
        this.orgList.push({ key, title: key, orgid : orgid, pid : pid })
        if (node.children) {
          this.getOrgList(node.children, node.key)
        }
      }
    },
    onChange(e) {
      const value = e.target.value
      console.log(this.orgList);
      const expandedKeys = this.orgList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.title, this.orgTree)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
  }
}
</script>

<style lang="less">
.ant-input-search{
  display: none;
}
  .custom-tree {

    /deep/ .ant-menu-item-group-title {
      position: relative;
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      width: 20px;
      height: 40px;
      line-height: 40px;
      z-index: 1050;

      &:hover {
        transform: scale(1.2);
        transition: 0.5s all;
      }
    }
  }
</style>
