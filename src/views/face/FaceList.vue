<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="姓名">
              <a-input placeholder="请输入" v-model="queryParam.name" />
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset()">重置</a-button>
            <a-button style="margin-left: 8px" type="dashed" icon="plus"  @click="$refs.addModal.add()" v-action:add>新建</a-button>
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
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.robotFaceList" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :span="12">
              编码:<span>{{ role.robotCode }}</span><br>
              动作集：<a-tag color="cyan">{{ role.cmdName }}</a-tag>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="11">
              <a-button type="primary" size="small" @click="$refs.editRobot.show(role)" v-action:edit>修改</a-button>
              <a-button style="margin-left:10px;" type="danger" size="small" @click="DelRobotCmd(role)" v-action:delete>删除</a-button>
            </a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="photoUrl" slot-scope="text">
            <a-popover>
                <template slot="content">
                    <img :src="text" style="width:200px;"   />
                </template>
                <a-icon type="appstore" />
            </a-popover>
        </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-action:edit>编辑</a>
        <a-divider type="vertical" />
        <a @click="handleDel(record)" v-action:delete>删除</a>
        <a-divider type="vertical" />
        <a @click="handleRobotCmd(record)">配置机器人</a>
      </span>
    </s-table>

    <edit-modal ref="editModal" @ok="handleOk"></edit-modal>
    <create-modal ref="addModal" @ok="handleOk"></create-modal>
    <robot-cmd   ref="robotCmd" @ok="handleOk"></robot-cmd>
    <edit-robot ref="editRobot" @ok="handleOk" ></edit-robot>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditModal from './modules/EditFace'
import CreateModal from './modules/CreateFace'
import RobotCmd from './modules/RobotCmd'
import EditRobot from './modules/EditRobotcmd'
import { queryData } from '@/api/common'

export default {
  name: 'TableList',
  components: {
    STable,
    EditModal,
    CreateModal,
    RobotCmd,
    EditRobot
  },
  data() {
    return {
      roleId: 0,
      roleName: '',
      mdl: {},
      // 查询参数
      queryParam: { name: '' },
      // 表头
      columns: [
        // {
        //   title: 'id',
        //   dataIndex: 'id'
        // },
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '人脸名称',
          dataIndex: 'name'
        },
        {
          title: '文件名称',
          dataIndex: 'photo'
        },
        {
          title: '照片',
          dataIndex: 'photoUrl',
          scopedSlots: { customRender: 'photoUrl' }
        },
        {
          title: '创建时间',
          dataIndex: 'actionDate'
        },
        {
          title: '动作集',
          dataIndex: 'cmdName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],

      loadData: parameter => {
        let orgId = JSON.parse(localStorage.getItem('user')).orgId;
        return queryData(Object.assign(parameter, this.queryParam,{org:orgId}),'/faceManage/queryFaceMsg').then(res => {
          return res.result
        })
      }
    }
  },
  methods: {
    handleEdit(record) {
      this.$refs.editModal.edit(record)
    },
    UpdateRobotCmd(){
      this.$message.error('修改')
    },
    // 删除某一个机器人命令
    DelRobotCmd(record){
      console.log(record);
      var _this = this;
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.robotCode} 的动作集吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 300)
            var id = {id: [record.id]};
            queryData(id,'/faceManage/delRobotFace').then(res => {
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

    },
    // 配置机器人动作集
    handleRobotCmd (record) {
      this.$refs.robotCmd.show(record);
    },
    handleOk() {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh(true)
    },
    // 处理重置
    handleReset() {
      this.queryParam.name = ''
      this.$refs.table.refresh()
    },
    // 删除
    handleDel(record){
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
            setTimeout(Math.random() > 0.5 ? resolve : reject, 300)
            var id = {id: [{id:record.id,photo:record.photo}]};
            queryData(id,'/faceManage/delFaceMsg').then(res => {
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

    },
  }
}
</script>
