<script setup >
    import { ref } from 'vue';
    import { getStudentInformation } from '../api'
    
    const data = [
  {
    label: '初一',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: '初二',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: '初三',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
    const tableData = ref([])
    const column = [
        {
            prop: 'StudentId',
            label: '编号'
        },
        {
            prop: 'Name',
            label: '名字'
        },
        {
            prop: 'Grade',
            label: '班级'
        },
        {
            prop: 'Class',
            label: '班级'
        },
    ]
    getStudentInformation().then( res => {
        console.log(res);
        tableData.value = res
    })
    </script >
    
    <template >
        <div class="tree-content">
            <el-tree :data="data" :props="defaultProps" />
        </div>
        <div class="table-content">
            <el-table
                :data="tableData"
                border
                stripe
                max-height="700px"
            >
                <template 
                    v-for="item in column"
                >
                    <el-table-column
                        :prop="item.prop"
                        :label="item.label"
                    />
                </template>
            </el-table>
        </div>
    </template >
    
    <style scoped lang="scss">
        .tree-content {
            width: 400px;
        }
        .table-content {
            width: 600px;
        }
    </style >
    