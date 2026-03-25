<script setup lang="ts">
    const {count, increment} = useCounter()
</script>

<template>
    <div>
        <div>
            Counter
        </div>
        <div>
            <p>Count: {{ count }}</p>
            <button @click="increment">Increment</button>
        </div>
    </div>
</template>