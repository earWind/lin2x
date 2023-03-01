<template>
  <div class="login-box">
    <h3 class="title">{{ name }}</h3>

    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="age">
        <el-input v-model.number="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">
          {{ $t("login") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { defineExpose } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const name = ref("admin");
const formRef = ref();
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
const rules = ref({
  rules: {
    pass: [{ validator: validatePass, trigger: "blur" }],
  },
});
const ruleForm = ref({
  account: "",
  pass: "",
});

const submitForm = () => {
  formRef.value.validate((valid: Boolean) => {
    if (valid) {
      router.push("/");
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

// 这里如果被当做子组件时需要向外暴露
// defineExpose({
//   name,
//   rules,
//   ruleForm,
//   submitForm,
// });
</script>

<style lang="scss" scoped>
.login-box {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2c3e50;

  .title {
    width: 100%;
    color: #fff;
    text-align: center;
  }

  .el-input {
    width: 300px;
  }

  .el-button {
    width: 100%;
  }
}
</style>
