<script setup lang="ts">
definePageMeta({
    middleware: ['hello-foo'],
    layout: 'no-header',
})
</script>

<template>
    <div>
        <div>
            Foo
        </div>
        <div>
            <NuxtLink to="/">Index</NuxtLink>
        </div>
        <div>
            <NuxtLink to="/posts/1">Post1</NuxtLink>
        </div>
        <div>
            {{ double(2) }}
        </div>
        <CounterA />
        <CounterB />
    </div>
</template>