<template>
  <form class="d-flex flex-column gap-3">
    <div v-for="[model, q] in qs">
      <div v-if="q.style?.eval?.display === 'hide'">
      </div>
      <div v-else-if="q.value.type === 'text' || q.value.type === 'email'">
        <div class="form-label">
          <label>{{ q.caption }}</label>
          <div class="form-text">{{ q.summary }}</div>
        </div>
        <input :type="q.value.type"
          :class="`form-control ${q.style?.eval?.display === 'required' ? 'border border-danger' : ''}`"
          :placeholder="q.placeholder" v-model="models[model]" :disabled="q.style?.eval?.display === 'disabled'">
        <div :class="`form-text ${q.style?.eval?.display === 'required' ? 'text-danger' : ''}`">{{ q.style?.eval?.display
          === 'required' || q.style?.eval?.display === 'disabled' ? q.style?.eval?.warn : '' }}</div>
      </div>
      <div v-else-if="q.value.type === 'number'">
        <div class="form-label">
          <label>{{ q.caption }}</label>
          <div class="form-text">{{ q.summary }}</div>
        </div>
        <input type="number"
          :class="`form-control ${q.style?.eval?.display === 'required' ? 'border border-danger' : ''}`"
          :placeholder="q.placeholder" v-model="models[model]" :disabled="q.style?.eval?.display === 'disabled'">
        <div :class="`form-text ${q.style?.eval?.display === 'required' ? 'text-danger' : ''}`">{{ q.style?.eval?.display
          === 'required' || q.style?.eval?.display ===
          'disabled' ? q.style?.eval?.warn : '' }}</div>
      </div>
      <div v-else-if="q.value.type === 'check'">
        <div class="form-label">
          <label>{{ q.caption }}</label>
          <div class="form-text">{{ q.summary }}</div>
        </div>
        <div class="form-check">
          <input :class="`form-check-input ${q.style?.eval?.display === 'required' ? 'border border-danger' : ''}`"
            type="checkbox" v-model="models[model]" :disabled="q.style?.eval?.display === 'disabled'">
          <label class="form-check-label">
            {{ q.placeholder }}
          </label>
        </div>
        <div :class="`form-text ${q.style?.eval?.display === 'required' ? 'text-danger' : ''}`">{{ q.style?.eval?.display
          === 'required' || q.style?.eval?.display ===
          'disabled' ? q.style?.eval?.warn : '' }}</div>
      </div>
      <div v-else-if="q.value.type === 'select'">
        <div class="form-label">
          <label>{{ q.caption }}</label>
          <div class="form-text">{{ q.summary }}</div>
        </div>
        <select :class="`form-select ${q.style?.eval?.display === 'required' ? 'border border-danger' : ''}`"
          v-model="models[model]" :disabled="q.style?.eval?.display === 'disabled'">
          <option value="" class="text-secondary">{{ q.placeholder }}</option>
          <option v-for="v in q.value.values">{{ v }}</option>
        </select>
        <div :class="`form-text ${q.style?.eval?.display === 'required' ? 'text-danger' : ''}`">{{ q.style?.eval?.display
          === 'required' || q.style?.eval?.display ===
          'disabled' ? q.style?.eval?.warn : '' }}</div>
      </div>
    </div>
  </form>
  {{ JSON.stringify(models) }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import states, { ModelDisplay, stylevalidate } from './state';
import { eval as expreval } from 'expression-eval';
import { validate } from 'jsonschema';
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
      const qs = this.state.forms[this.fid].questions;
      return Object.entries(qs)
        .filter(([model, q]) => {
          if (q.style) {
            try {
              const s: ModelDisplay | undefined = JSON.parse(expreval(q.style.expr, this.state.model));
              if (s) {
                const v = validate(s, stylevalidate);
                if (v.errors.length) {
                  throw v.errors.map(x => `${x.message}: ${x.name} @ ${x.path}`)
                }
              }
              q.style.eval = s;
            } catch (e) {
              this.state.message.warnings.push(`ignore to update style: style.expr malfunctions: fid.model=${this.fid}.${model} style=${JSON.stringify(q.style?.eval)}: ${e}`);
            }
          }
          return 1;
        })
        .sort((a, b) => Number(a[1].order) > Number(b[1].order) ? 1 : -1);
    },
    models() {
      return this.state.model[this.fid];
    }
  },
  created() {
    const models = this.models;
    for (const [model, q] of this.qs) {
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
