const router = require('koa-router')()
const {
  getStudent,
  getClass,
  getResult,
  getPerStudentMessage,
  keywordSearch,
  changeInformation,
} = require('../server/student')
const utils = require('../utils/util')
router.prefix('/student')

router.get('/getStudentInformation', async (ctx, next) => {
  const studentList = await getStudent()
  const classOneList = await getClass(1)
  const classTwoList = await getClass(2)
  const classThreeList = await getClass(3)

  const formatClass = async (list, grade) => {
    const tempList = []
    const classList = ['零', '一', '二', '三', '四', '五', '六']
    list.map(item => {
      tempList.push({ label: `${classList[item.Class]}班`, children: [] })
    })
    for (const item of tempList) {
      const studentPerList = await getStudent(
        grade,
        classList.indexOf(item.label.slice(0, 1)),
      )
      for (const temp of studentPerList) {
        temp.label = temp.Name
        item.children.push(temp)
      }
      // console.log(item);
    }
    return tempList
  }

  const one = await formatClass(classOneList, 1)
  const two = await formatClass(classTwoList, 2)
  const three = await formatClass(classThreeList, 3)
  const treeData = [
    {
      label: '初一',
      children: one,
    },
    {
      label: '初二',
      children: two,
    },
    {
      label: '初三',
      children: three,
    },
  ]
  // console.log(treeData);
  ctx.body = utils.success({ studentList, treeData })
})

router.get('/remoteSearchStudent', async (ctx, next) => {
  console.log(ctx.request.query)
  const { keyword } = ctx.request.query
  const likeList = await keywordSearch(keyword)
  console.log(likeList)
  ctx.body = utils.success(likeList)
})

router.get('/studentResult', async (ctx, next) => {
  const { id } = ctx.request.query
  const result = await getResult(id)
  const information = await getPerStudentMessage(id)
  console.log(result)
  ctx.body = utils.success({ result, information })
})

router.post('/changeStudentInformation', async (ctx, next) => {
  const { ID, changeData, type } = ctx.request.body
  const res = await changeInformation(ID, changeData, type)
  console.log(res)
  ctx.body = utils.success('test', '修改成功')
})

module.exports = router
