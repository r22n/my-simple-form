<template >
  <div class="w-100 h-100 d-flex flex-column gap-3 " v-if="state.flow.touch.display === 'input'">

    <form class="d-flex flex-column flex-fill gap-3 overflow-auto">
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
          <div :class="`form-text ${q.style?.eval?.display === 'required' ? 'text-danger' : ''}`">{{
            q.style?.eval?.display
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
          <div :class="`form-text ${q.style?.eval?.display === 'required' ? 'text-danger' : ''}`">{{
            q.style?.eval?.display
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
          <div :class="`form-text ${q.style?.eval?.display === 'required' ? 'text-danger' : ''}`">{{
            q.style?.eval?.display
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
          <div :class="`form-text ${q.style?.eval?.display === 'required' ? 'text-danger' : ''}`">{{
            q.style?.eval?.display
            === 'required' || q.style?.eval?.display ===
            'disabled' ? q.style?.eval?.warn : '' }}</div>
        </div>
      </div>
    </form>

    <div class="d-flex flex-row justify-content-between ">
      <nav class="overflow-auto">
        <ul class="pagination ">
          <li v-for="(page, p) in state.flow.pages" :class="`page-item ${p === state.flow.current ? 'active' : ''}`"
            @click="state.flow.current !== p && pagination(p)">
            <a class="page-link">{{ page }}</a>
          </li>
        </ul>
      </nav>
      <span>
        <button type="button" class="btn btn-primary" v-if="goto" @click="ok" :disabled="required">
          OK
        </button>
        <button type="button" class="btn btn-primary" v-else @click="done" :disabled="required">
          DONE
        </button>
      </span>
    </div>
  </div>

  <div class="card text-bg-success " v-else-if="state.flow.touch.display === 'done'">
    <div class="card-header">{{ state.flow.touch.done.title }}</div>
    <div class="card-body">
      <h5 class="card-title">{{ state.flow.touch.done.caption }}</h5>
      <p class="card-text">{{ state.flow.touch.done.summary }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { state, ModelDisplay, QuestionModel, stylevalidate } from './state';
import { eval as expreval } from 'expression-eval';
import { validate } from 'jsonschema';
import 'bootstrap/dist/css/bootstrap.min.css';

export default defineComponent({
  data() {
    return { state };
  },
  computed: {
    fid() {
      const f = state.flow;
      return f.pages[f.current];
    },
    qs() {
      // @ts-expect-error workaround vue ts reports 'fid' not found
      const qs = state.forms[this.fid]?.questions;
      if (!qs) {
        console.warn(`no model found or state not found: qs=${!!qs} state=${!!state}`);
        return [];
      }
      return Object.entries(qs)
        .filter(([model, q]) => {
          if (q.style) {
            try {
              const s: ModelDisplay | undefined = JSON.parse(expreval(q.style.expr, state.model));
              if (s) {
                const v = validate(s, stylevalidate);
                if (v.errors.length) {
                  throw v.errors.map(x => `${x.message}: ${x.name} @ ${x.path}`)
                }
              }
              q.style.eval = s;
            } catch (e) {
              state.message.warnings.push(`ignore to update style: style.expr malfunctions: fid.model=${this.fid}.${model} style=${JSON.stringify(q.style.eval)}: ${e}`);
            }
          }
          return 1;
        })
        .sort((a, b) => Number(a[1].order) > Number(b[1].order) ? 1 : -1);
    },
    goto() {
      // @ts-expect-error workaround vue ts reports 'fid' not found
      const f = state.forms[this.fid];
      if (!f) {
        console.warn(`cannot evaluate next fid: forms not found or state not found: state=${!!state} form=${!!f}`);
        return;
      }

      this.cutpages();
      if (f.goto) {
        f.goto.eval = expreval(f.goto.expr, state.model);
      }
      return f.goto?.eval;
    },
    models() {
      // @ts-expect-error workaround vue ts reports 'fid' not found
      const m = state.model[this.fid];
      if (!m) {
        console.warn(`model not found: fid=${this.fid}`);
        // @ts-expect-error workaround vue ts reports 'fid' not found
        return state.model[this.fid] = {};
      }
      return m;
    },
    required() {
      const qs: [string, QuestionModel][] = this.qs;
      return qs.some(([model, q]) => q.style?.eval?.display === 'required');
    }
  },
  mounted() {
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
  },
  methods: {
    pagination(next: number) {
      state.flow.current = next;
    },
    ok() {

      const goto = this.goto;
      if (!goto) {
        console.error('ignore to ok: unexpected error: goto is empty or undefined');
        return;
      } else if (!state.forms[goto]) {
        console.error(`ignore to ok: unexpected error: goto was set but form is not found: fid=${goto}`);
        return;
      }

      const f = state.flow;
      if (f.current === f.pages.length - 1) {
        f.pages[++f.current] = goto;
      } else {
        f.current++;
      }
    },
    done() {
      state.flow.touch.display = 'done';
    },
    cutpages() {
      const f = state.flow;

      let c = f.current;
      for (; c < f.pages.length - 1; c++) {
        const g = state.forms[f.pages[c]].goto;
        if (!g) {
          continue;
        }
        g.eval = expreval(g.expr, state.model);
        if (g.eval && g.eval !== f.pages[c + 1]) {
          break;
        }
      }

      f.pages = f.pages.slice(0, c + 1);
    }
  }
});
</script>

<style></style>
