<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <el-menu
    :default-active="route.path"
    class="el-menu-left"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item index="/total">
      <el-icon><location /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="/personal-result">
      <el-icon><Menu /></el-icon>
      <template #title>
        个人成绩
      </template>
    </el-menu-item>
    <el-menu-item index="/advantage-result">
      <el-icon><document /></el-icon>
      <template #title>
        平均成绩
      </template>
    </el-menu-item>
    <el-menu-item index="/rank">
      <el-icon><setting /></el-icon>
      <template #title>
        成绩排名
      </template>
    </el-menu-item>
    <el-menu-item index="/pass-rate">
      <el-icon><setting /></el-icon>
      <template #title>
        统计
      </template>
    </el-menu-item>
    <el-menu-item index="/result-rate">
      <el-icon><setting /></el-icon>
      <template #title>
        分数段条形图
      </template>
    </el-menu-item>
    <el-sub-menu index="/upload-result">
      <template #title>
        <el-icon>
          <setting />
        </el-icon>
        管理成绩信息
      </template>
      <el-menu-item
        index="/result-information/edit-result"
      >
        查看&编辑
      </el-menu-item>
      <el-menu-item
        index="/result-information/time-result"
      >
        考试次数/类型编辑
      </el-menu-item>
      <el-menu-item
        index="/result-information/upload-result"
      >
        上传成绩
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/student-information">
      <template #title>
        <el-icon><location /></el-icon>
        <span>管理学生信息</span>
      </template>
      <el-menu-item
        index="/student-information/view-information"
      >
        查看&编辑
      </el-menu-item>
      <el-menu-item
        index="/student-information/edit-information"
      >
        批量编辑
      </el-menu-item>
      <el-menu-item
        index="/student-information/upload-information"
      >
        上传学生信息
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped lang="scss">
.el-menu-left {
  width: 100%;
  border: none;
  height: 100%;
}
</style>
