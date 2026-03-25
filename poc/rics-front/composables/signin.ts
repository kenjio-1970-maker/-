export function useSignIn() {
    const isSigninFlg = ref(false);
    const signIn = function () {
        isSigninFlg.value = true;
        window.localStorage.setItem('isSigninFlg', JSON.stringify(isSigninFlg.value));
    }
    const signOut = function () {
        isSigninFlg.value = false;
        window.localStorage.setItem('isSigninFlg', JSON.stringify(isSigninFlg.value));
    }
    return { isSigninFlg, signIn, signOut };
}