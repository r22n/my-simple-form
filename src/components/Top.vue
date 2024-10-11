<template>
  <div class="w-100 h-100 overflow-auto d-flex flex-column gap-3" v-if="form">
    <Form :fid="pages[page]" :form="form" v-model="model" />
    <div class="d-flex flex-row justify-content-between">
      <Pagination :pages="pages" v-model="page" />
      <span>
        <button class="btn btn-primary" @click="ok" v-if="form.goto">Ok</button>
        <button class="btn btn-primary" @click="done" v-else>Done</button>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import Form from './Form.vue';
import Pagination from './Pagination.vue';
import { FormModel, Props } from '../props';
import { Parser } from 'expr-eval';
import 'bootstrap/dist/css/bootstrap.css';

const props = defineProps<Props>();
const model = defineModel<FormModel>({ default: {} });
const emits = defineEmits<{ (e: 'ok'): void; (e: 'done'): void }>();

const pages = ref(['']);
const page = ref(0);
const form = computed(() => props.forms[pages.value[page.value]]);

onMounted(() => pages.value = [props.start]);

function ok() {
  const goto = Parser.evaluate(`${form.value.goto}`, model.value as any) as any as string;
  if (goto in props.forms) {
    pages.value = [...pages.value.slice(0, page.value + 1), goto];
    page.value++;
  }
  emits('ok');
}

function done() {
  emits('done');
}
</script>