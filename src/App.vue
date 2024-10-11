<template>
  <Top :forms="props.forms" :start="props.start" v-model="model" @done="done++" @ok="ok++" />
  {{ JSON.stringify(model, void 0, 3) }}
  done={{ done }}
  ok={{ ok }}
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { initModel, Props } from './props';
import 'bootstrap/dist/css/bootstrap.css';
import Top from './components/Top.vue';

const props = defineProps<Props>();

const model = reactive({});
const ok = ref(0);
const done = ref(0);
Object.assign(model, initModel(props.forms));


</script>