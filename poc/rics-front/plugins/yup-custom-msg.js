import _ from "lodash";
import { setLocale } from "yup";
import { suggestive } from "yup-locale-ja";

export default defineNuxtPlugin((nuxtApp) => {

    const customeLocaleObject = {
        mixed: {
            required: ({ label }) => (label ? label + 'は' : '') + '必須項目です',
        },
        string: {
            min: ({ label, min }) => (label ? label + 'は' : '') + `${min}文字以上で入力してください`,
        },
    }

    const LocaleObject = _.merge({}, suggestive, customeLocaleObject);

    setLocale(LocaleObject);
});