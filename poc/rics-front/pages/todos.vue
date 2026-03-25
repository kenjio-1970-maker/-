<script setup lang="ts">
    const {data: todos, refresh} = useFetch('/api/todos')
</script>

<template>
    <div>
        <div>
            Todos
        </div>
        <div>
            <button @click="refresh()">Refresh</button>
        </div>
        <div>
            <ul>
                <li v-for="todo in todos" :key="todo.id">
                    <span :class="{completed: todo.completed}">{{ todo.title }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.completed {
    text-decoration: line-through;
}
</style>