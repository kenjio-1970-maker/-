<script setup lang="ts">
const count = useState('count', () => 0)
</script>
    
<template>
    <div>
        <div>
            CounterB
        </div>
        <div>
            <p>Count: {{ count }}</p>
            <button @click="count++">Increment</button>
        </div>
    </div>
</template>