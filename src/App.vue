<template>
  <Top :forms="forms" :start="start" v-model="model" @done="done++" @ok="ok++" />
  {{ JSON.stringify(model, void 0, 3) }}
  done={{ done }}
  ok={{ ok }}
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Forms, } from './props';
import 'bootstrap/dist/css/bootstrap.css';
import Top from './components/Top.vue';

const forms: Forms = {
  form01: {
    questions: {
      question01: {
        caption: 'what your name ?',
        description: 'input your first name',
        input: { type: 'string' },
        message: [
          { color: 'red', text: 'name should not be empty', where: 'form01.question01 == ""' },
          { color: 'green', text: 'ok', where: 'length(form01.question01) > 2' },
        ]
      }
    }
  }
};

const start = "form01";

const model = reactive({
  form01: {
    question01: 'default'
  }
});
const ok = ref(0);
const done = ref(0);


</script>