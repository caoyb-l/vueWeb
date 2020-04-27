<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="1">
            <a-form-item label="动作名称">
              <a-input v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="1">
            <a-form-item label="所属地图">
              <a-select
                size="small"
                v-model="queryParam.mapId"
                showSearch
                placeholder="选择所属地图"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option v-for="(item ,key) in mapList" :key="key" :value="item.id">
                  {{item.mapName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="9" :sm="24">
              <a-button type="primary" @click="searchData()">查询</a-button>
              <a-button style="margin-left: 10px" @click="resetQuery()">重置列表</a-button>
              <a-button style="margin-left: 10px" type="primary" icon="plus"  @click="$refs.CreateCmdColl.add()" v-action:add>新建</a-button>
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
        :alert="cmdpage.alert"
        :rowSelection="cmdpage.rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEditVisible(record)" v-action:edit>编辑<a-icon type="edit" /></a>
            <a-divider type="vertical" v-action:delete/>
            <a @click="handleDelete(record)" v-action:delete>删除</a>
            <a-divider type="vertical"/>
          </template>
        </span>
      </s-table>

    <!-- <edit-robot ref="editModal" @ok="handleOk" /> -->
    <edit-cmdColl ref="EditCmdColl" @ok="handleAddSubmit" />
    <!-- 新增动作集 -->
    <create-cmd-coll ref="CreateCmdColl" @ok="handleAddSubmit" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import CmdList from '../Cmd'
import EditCmdColl from './modules/EditCmdColl'
// import EditRobot from './modules/EditRobot'
import { queryData } from '@/api/common'
import CreateCmdColl from './modules/CreateCmdColl'

export default {
  name: 'TableList',
  components: {
    CreateCmdColl,
    STable,
    PageView,
    EditCmdColl,
    // EditRobot,
    CmdList
  },
  data () {
    return {
      advanced: false,
      addVisible: false,
      editVisible: false,
      // orgId: this.$store.getters.orgId
      orgId: {
        orgId:1
      },
      selectedItems: [],
       // 查询参数
      queryParam: {
        name:'',
        orgId:'',
      },
    //   editData:{},
      cmdpage: {
          alert: false,
          rowSelection: null
      },
      // userId:localStorage.getItem('userId')
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },

        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '命令集ID',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '循环次数',
          dataIndex: 'circulation',
          scopedSlots: { customRender: 'circulation' }

        },
        {
          title: '操作时间',
          dataIndex: 'create_date',
          scopedSlots: { customRender: 'create_date' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let orgId = JSON.parse(localStorage.getItem('user')).orgId
        return queryData(Object.assign(parameter, this.queryParam,{orgId:orgId}),'/cmdCollection/getCmdCollectionPage')
          .then(res => {
            console.log(res);
            return res.result
          })
      },
      mapList: [],
      roleNames: [],
      selectedRowKeys: [],
    }
  },
  created () {
    this.getMap();
  },
  computed: {
    title () {
      return this.$route.meta.title
    },

  },
  methods: {
    // 获取该单位下的地图
   getMap() {
      let org = JSON.parse(localStorage.getItem('user')).orgId
      queryData({ orgId: org }, '/robotMapLib/getRobotMapLibList').then(res => {
        console.log('-----------getMap', res)
        this.mapList = res.result
      })
    },
    onChange(date, dateString) {
      this.queryParam.validityDate = dateString;
      console.log(date, dateString);
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 处理新增
    handleAddSubmit () {
      this.$refs.table.refresh(true)
    },
    // 表单重置
    resetQuery () {
      this.queryParam = {};
      this.$refs.table.refresh(true)
    },
    // 显示状态修改
    handleAddVisible () {
      this.addVisible = true;
    },
    // 编辑动作集
    handleEditVisible(record) {
      // let mapId = this.editSkills.map == undefined ? 0 : this.editSkills.map
      // let cmd = this.editSkills.cmd == undefined ? 0 : this.editSkills.cmd
      // console.log("编辑动作集"+mapId+"/"+cmd +"/"+ this.businessName +"/"+ this.skillName)
      // this.$refs.cmd.show(this.businessName + this.skillName,mapId,cmd)

      console.info(record)
      // this.editData = record
      // this.$refs.editModal.add(record)
      this.$refs.EditCmdColl.add(record)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 搜索内容
    searchData(){
      this.$refs.table.refresh(true)
    },
    handleOk(){
      this.$refs.table.refresh(true)
    },
    // 删除命令集
    handleDelete(record){
      var _this = this;
       this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.name} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var id = {entityId: record.id};
            queryData(id,'/cmdCollection/delete').then(res => {
              console.log('删除返回值：',res);
              if(res.code == 0){
                 _this.$message.success('删除成功');
                 _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(res.message)
              }
            });
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
    display: inline-block
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
