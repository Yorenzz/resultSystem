<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const collapse = ref(false)
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
            <template #title>个人成绩</template>
        </el-menu-item>
        <el-menu-item index="/advantage-result">
            <el-icon><document /></el-icon>
            <template #title>平均成绩</template>
        </el-menu-item>
        <el-menu-item index="/rank">
            <el-icon><setting /></el-icon>
            <template #title>成绩排名</template>
        </el-menu-item>
        <el-menu-item index="/pass-rate">
            <el-icon><setting /></el-icon>
            <template #title>统计</template>
        </el-menu-item>
        <el-menu-item index="/result-rate">
            <el-icon><setting /></el-icon>
            <template #title>分数段条形图</template>
        </el-menu-item>
        <el-menu-item index="/upload-result">
            <el-icon><setting /></el-icon>
            <template #title>上传成绩信息</template>
        </el-menu-item>
        <el-sub-menu index="/student-information">
            <template #title>
                <el-icon><location /></el-icon>
                <span>管理学生信息</span>
            </template>
            <el-menu-item index="/student-information">item one</el-menu-item>
            <el-menu-item index="8-2">item two</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<style scoped lang="scss">
.el-menu-left {
    height: 100%;
    border: none;
    .collapse-button {
        flex: 1;
        width: 100%;
        height: 50px;
        background: #545c64;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
