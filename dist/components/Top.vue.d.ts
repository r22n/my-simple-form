import { FormModel, Props } from '../props';
declare let __VLS_typeProps: Props;
type __VLS_PublicProps = {
    modelValue?: FormModel;
} & typeof __VLS_typeProps;
declare const _default: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (modelValue: FormModel) => any;
} & {
    done: () => any;
    ok: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((modelValue: FormModel) => any) | undefined;
    onDone?: (() => any) | undefined;
    onOk?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
