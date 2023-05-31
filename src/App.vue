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
            :placeholder="q.placeholder" v-model="models[model]" :disabled="q.style?.eval?.display === 'disabled'"
            @change="$emit('change', fid, model)">
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
            :placeholder="q.placeholder" v-model="models[model]" :disabled="q.style?.eval?.display === 'disabled'"
            @change="$emit('change', fid, model)">
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
              type="checkbox" v-model="models[model]" :disabled="q.style?.eval?.display === 'disabled'"
              @change="$emit('change', fid, model)">
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
            v-model="models[model]" :disabled="q.style?.eval?.display === 'disabled'"
            @change="$emit('change', fid, model)">
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
import { eval as expreval } from 'expression-eval';
import { validate } from 'jsonschema';
import { state, State, MV, ModelDisplay, QuestionModel, stylevalidate, modelinit } from '.';

import 'bootstrap/dist/css/bootstrap.min.css';

type D = {
  state: State;
};
type C = {
  fid(): string;
  qs(): [model: string, q: QuestionModel][];
  goto(): string | undefined | null;
  models(): { [model in string]: MV };
  required(): boolean;
};
type M = {
  pagination(next: number): void;
  ok(): void;
  done(): void;
  cutpages(): void;
};
type E = {
  /**
   * - input field of question cause change event.
   * - cause this event after model changed
   * 
   * @param fid current fid user faces
   * @param model question dispatches change event
   */
  change(fid: string, model: string): void;
  /**
   * - form accepts ok cause ok event.
   * - ok button ignores this event if anyof
   *    - ok button was disabled
   *    - next fid was not found
   * - paramter of fid will be after ok
   */
  ok(fid: string): void;
  /**
   * - form accepts done cause done event.
   * - call condition is same with 'ok' event.
   * - paramter of fid will be after done
   * @see ok
   */
  done(fid: string): void;
  /**
   * - form accepts user select form as pagination, this cause pagination event.
   * - paramter of fid will be after pagination
   */
  pagination(fid: string): void;
};

export default defineComponent<{}, E, D, C, M>({
  data() {
    return { state };
  },
  emits: ['change', 'ok', 'done', 'pagination'],
  computed: {
    fid() {
      const f = state.flow;
      return f.pages[f.current];
    },
    qs() {

      const qs = state.forms[this.fid]?.questions;
      if (!qs) {
        console.warn(`no model found or state not found: qs=${!!qs} state=${!!state}`);
        return [];
      }
      return Object.entries(qs)
        .filter(([model, q]) => {
          if (q.style) {
            let s: ModelDisplay | null;
            try {
              s = JSON.parse(expreval(q.style.expr, state.model));
            } catch (e) {
              state.message.warnings.push(`ignore style updates: style.expr malfunctions: fid.model=${this.fid}.${model}: broken json: ${e}`)
              return 1;
            }

            const v = validate(s, stylevalidate);
            if (!s) {
              q.style.eval = { display: 'enabled' };
            } else if (!v.errors.length) {
              q.style.eval = s;
            } else {
              state.message.warnings.push(`ignore style updates: style.expr malfunctions: fid.model=${this.fid}.${model}: json limit exceeded: ${v.errors.map(x => `${x.message} ${x.name} @ ${x.path}`).join(', ')}`);
            }
          }
          return 1;
        }
        )
        .sort((a, b) => Number(a[1].order) > Number(b[1].order) ? 1 : -1);
    },
    goto() {
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
      return state.model[this.fid];
    },
    required() {
      const qs: [string, QuestionModel][] = this.qs;
      return qs.some(([model, q]) => q.style?.eval?.display === 'required');
    }
  },
  mounted() {
    modelinit();
  },
  methods: {
    pagination(next: number) {
      state.flow.current = next;
      this.$emit('pagination', this.fid);
    },
    ok() {
      const goto = this.goto;
      if (!goto) {
        console.error('ignore to ok: unexpected error: goto is empty, undefined or null');
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
      this.$emit('ok', this.fid);
    },
    done() {
      state.flow.touch.display = 'done';
      this.$emit('done', this.fid);
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
      if (c < f.pages.length - 1) {
        f.pages = f.pages.slice(0, c + 1);
      }
    }
  }
});
</script>

<style></style>
