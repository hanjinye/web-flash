import treeTable from '@/components/TreeTable'
import { getList, save, delMenu, getMenuTree } from '@/api/system/menu'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  name: 'treeTableDemo',
  components: { treeTable },
  data() {
    return {
      showTree: false,
      defaultProps: {
        id: 'code',
        label: 'name',
        children: 'children'
      },

      listLoading: true,
      expandAll: false,
      formTitle: '',
      formVisible: false,
      isAdd: false,
      show:{
        form:{
          component:true
        }
      },
      form: {
        id: '',
        name: '',
        code: '',
        url: '',
        pcode: '',
        ismenu: 1,
        num: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入请求地址', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      },
      data: [],
      treeData:[],
      selRow: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
      getMenuTree().then(response => {
        this.treeData = response.data
      })
    },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.data = response.data
        this.listLoading = false
      })
    },
    checkSel() {
      if (this.selRow && this.selRow.id) {
        return true
      }
      this.$message({
        message: '请选中操作项',
        type: 'warning'
      })
      return false
    },
    add() {
      this.form = {}
      this.formTitle = '添加菜单'
      this.formVisible = true
      this.isAdd = true
    },
    save() {
      var self = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const menuData = self.form
          delete menuData.parent
          delete menuData.children
          save(menuData).then(response => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            self.fetchData()
            self.formVisible = false
          })
        } else {
          return false
        }
      })
    },
    edit(row) {
      this.form= Object.assign({},row);
      if (row.isMenuName === '是') {
        this.form.ismenu = 1
      } else {
        this.form.ismenu = 0
      }
      if (row.statusName === '启用') {
        this.form.status = 1
      } else {
        this.form.status = 0
      }
      if (this.form.pcode=='0') {
        this.form.pcode =undefined
      }
      this.show.form.component=true
      console.log("form",this.form)
      this.formTitle = '编辑菜单'
      this.formVisible = true
      this.isAdd = false
    },
    remove(row) {
      this.$confirm('确定删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMenu(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        }).catch(err =>{
          this.$notify.error({
            title: '错误',
            message:err,
          })
        })
      })
    },
    componentTips(){
      this.$notify({
        title: '提示',
        dangerouslyUseHTMLString:true,
        message: '顶级目录请输入layout,<br/>左侧惨淡请根据实际组件路径输入:views/...<br/>功能按钮无需输入该值'
      })
    },
    changeISmenu(val){
      if(val===1){
        this.show.form.component=true
      }else{
        this.show.form.component=false
      }
    }
  }
}
