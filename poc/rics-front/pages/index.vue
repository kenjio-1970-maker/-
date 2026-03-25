<template>
  <div>
    <nuxt-page />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  // redirect: '/apl/aplInquiryMgntList'
  redirect: '/welc'
})
</script>

<style scoped>
.search-card {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 22vh;
}

.search-result-card {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 51vh;
}

.card-header {
  font-size: 18px;
  text-align: left;
}

.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-result-paging {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 40px;
}

.el-button {
  margin-top: 5px;
  margin-left: 38px;
}

.new-add-button {
  margin-right: 20px;
}
</style>
