<template>
    <main class="view">
        <slot />
    </main>
</template>

<style scoped>
.view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
}
    main {
        flex: 1;
        padding: 10px;
    }

    footer {
        background-color: #333;
        color: white;
        padding: 10px;
    }
</style>