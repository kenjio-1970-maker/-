<script setup lang="ts">
    const count = ref(0)
    const increment = () => {
        count.value++
    }
</script>

<template>
    <div>
      <div>
        Counter
      </div>
      <div>
        <p>Count: {{count}}</p>
        <button @click="increment">Increment</button>
      </div>
      <div>
        <CounterComp />
      </div>
    </div>
</template>