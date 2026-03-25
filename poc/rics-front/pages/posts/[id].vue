<script setup lang="ts">
const route = useRoute()
</script>

<template>
    <div>
      <div>
        Post {{route.params.id}}
      </div>
      <div>
        <NuxtLink to="/">
          Index
        </NuxtLink>
        <NuxtLink to="/foo">
          foo
        </NuxtLink>
      </div>
    </div>
  </template>