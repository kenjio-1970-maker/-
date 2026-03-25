export default defineNuxtPlugin((nuxtApp) => {
    const loadingInstance = ref(null);
    nuxtApp.hook('page:loading:start', () => {
        console.log('loading start')
        loadingInstance.value = ElLoading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
    }) 
    nuxtApp.hook('page:loading:end', () =>{
        console.log('loading end')
        if(loadingInstance.value) {
            loadingInstance.value.close();
        }
    })
})