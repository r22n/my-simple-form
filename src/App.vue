<template>
  <form class="d-flex flex-column gap-3">
    <div v-for="[model, q] in qs">
      <div v-if="q.value.type === 'text' || q.value.type === 'email'">
        <div class="form-label">
          <label>{{ q.caption }}</label>
          <div class="form-text">{{ q.summary }}</div>
        </div>
        <input :type="q.value.type" class="form-control" :placeholder="q.placeholder" v-model="models[model]">
      </div>
      <div v-else-if="q.value.type === 'number'">
        <div class="form-label">
          <label>{{ q.caption }}</label>
          <div class="form-text">{{ q.summary }}</div>
        </div>
        <input type="number" class="form-control" :placeholder="q.placeholder" v-model="models[model]">
      </div>
      <div v-else-if="q.value.type === 'check'">
        <div class="form-label">
          <label>{{ q.caption }}</label>
          <div class="form-text">{{ q.summary }}</div>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="models[model]">
          <label class="form-check-label">
            {{ q.placeholder }}
          </label>
        </div>
      </div>
      <div v-else-if="q.value.type === 'select'">
        <div class="form-label">
          <label>{{ q.caption }}</label>
          <div class="form-text">{{ q.summary }}</div>
        </div>
        <select class="form-select" v-model="models[model]">
          <option value="" class="text-secondary">{{ q.placeholder }}</option>
          <option v-for="v in q.value.values">{{ v }}</option>
        </select>
      </div>
    </div>
  </form>
</template>

text
order?: number;
caption: string;
summary?: string;
value: ModelValue;
placeholder?: string;
show?: EXF ModelDisplay

text
order?: number;
caption: string;
summary?: string;
value: ModelValue;
placeholder?: string;
show?: EXF ModelDisplay


<script lang="ts">
import { defineComponent } from 'vue';
import states from './state';

import 'bootstrap/dist/css/bootstrap.min.css';

export default defineComponent({
  props: {
    instance: String,
  },
  computed: {
    state() {
      return states[this.instance ?? ''];
    },
    fid() {
      const f = this.state.flow;
      return f.pages[f.current];
    },
    qs() {
      const q = this.state.forms[this.fid].questions;
      return Object.entries(q).sort((a, b) => Number(a[1].order) > Number(b[1].order) ? 1 : -1);
    },
    models() {
      return this.state.model[this.fid];
    }
  },
  created() {
    const models = this.models;
    for (const [model, q] of this.qs) {
      const m = models[model];

      switch (q.value.type) {
        case 'text':
        case 'email':
        case 'select':
          models[model] = q.value.init !== void 0 ? q.value.init : '';
          break;
        case 'check':
          models[model] = q.value.init !== void 0 ? q.value.init : false;
          break;
        case 'number':
          models[model] = q.value.init !== void 0 ? q.value.init : 0;
          break;
      }
    }
  }
});
</script>

<style></style>
