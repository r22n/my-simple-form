<template>
    <div class="d-flex flex-column">
        <p class="h3">{{ props.question.caption }}</p>
        <p class="text-wrap">
            {{ props.question.description }}
        </p>
        <input class="form-control" type="text" v-model="model[props.fid][props.qid]"
            v-if="props.question.input.type === 'string'">
        <input class="form-control" type="number" v-model="model[props.fid][props.qid]" :max="props.question.input.max"
            :min="props.question.input.min" :step="props.question.input.step"
            v-else-if="props.question.input.type === 'number'">
        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
            v-model="model[props.fid][props.qid]" v-else-if="props.question.input.type === 'boolean'">
        <select class="form-select" v-model="model[props.fid][props.qid]"
            v-else-if="props.question.input.type === 'select'">
            <option :value="candidate" v-for="candidate in props.question.input.candidates">{{ candidate }}</option>
        </select>
        <p class="text-wrap" :style="`color: ${message.color}`" v-if="!!message">
            {{ message.text }}
        </p>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { FormModel, Question } from '../props';
import { Parser } from 'expr-eval';

const props = defineProps<{ question: Question; fid: string; qid: string }>();
const model = defineModel<FormModel>({ default: {} });

const message = computed(() => props.question.message?.find(e => !!Parser.evaluate(e.where, model.value as any)));

</script>