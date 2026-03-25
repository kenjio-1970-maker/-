<script setup lang="ts">
const props = defineProps({ name: { type: String, required: true } });
</script>

<template>
    <ErrorMessage :name="name" v-slot="{ message }">
        <div class="error-message">
            <p>{{ message }}</p>
        </div>
    </ErrorMessage>
</template>

<style scoped>
 .error-message {
     color: red;
 }
</style>