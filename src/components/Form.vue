<template>
    <Question :question="props.form.questions[qid]" :qid="qid" :fid="props.fid" v-model="model"
        v-for="qid in questions" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Form, FormModel } from '../props';
import Question from './Question.vue';

const props = defineProps<{ form: Form, fid: string }>();
const model = defineModel<FormModel>({ default: {} });

const questions = computed(() => Object.keys(props.form.questions));


</script>