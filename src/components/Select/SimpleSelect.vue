<script lang="ts" setup>
import type { ComponentOptions } from "vue";
import { ref } from "vue";
import type { VueSelectComputed } from "vue-select";
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const emit = defineEmits(["update:modelValue", "option:selected"]);

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
    required: true,
  },

  multiple: {
    type: Boolean,
  },

  taggable: {
    type: Boolean,
  },

  label: {
    type: String,
  },

  disabled: {
    type: Boolean,
  },

  placeholder: {
    type: String,
  },

  valueName: {
    type: String,
    default: "value",
  },

  errorMessage: {
    type: String,
  },

  clearable: {
    type: Boolean,
    default: true,
  },
  required: {
    type: Boolean,
    default: false,
  },

  modelValue: {},

  closeOnSelect: {
    type: Boolean,
    default: true,
  },
});

const select = ref<ComponentOptions | VueSelectComputed>();
const focus = ref(false);
const inputValue = ref("");

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
}

function onUpdateValue(values: any) {
  emit("update:modelValue", values);
  emit("option:selected", values);
}

function reduce(opt: Record<string, unknown>) {
  return opt[props.valueName];
}
</script>

<template>
  <div
    :class="{
      isFilled: !select?.isValueEmpty || inputValue !== '',
      focus: focus,
      'has-error': !!errorMessage,
    }"
    class="TextInput"
  >
    <div style="width: 100%">
      <v-select
        ref="select"
        :class="{ error: !!errorMessage }"
        :clearable="clearable"
        :close-on-select="closeOnSelect"
        :disabled="disabled"
        :model-value="modelValue"
        :multiple="multiple"
        :options="options"
        :placeholder="placeholder"
        :reduce="reduce"
        :taggable="taggable"
        append-to-body
        label="name"
        @close="focus = false"
        @open="focus = true"
        @update:modelValue="onUpdateValue"
      >
        <template
          #search="{
            attributes,
            events,
          }: {
            attributes: Record<any, any>,
            events: Record<any, any>,
          }"
        >
          <input
            @input="handleInput"
            class="vs__search"
            v-bind="attributes"
            v-on="events"
          />
          <span v-if="label" class="place"
            >{{ label }}
            <template v-if="required">
              <span class="text-red-500">*</span>
            </template>
          </span>
        </template>
      </v-select>
    </div>
    <p v-show="errorMessage" class="help-message">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style>
.TextInput {
  --vs-dropdown-option--active-color: #ffffff;
  --vs-dropdown-option--active-bg: #7753f8;
  --vs-font-size: 13px;
  --vs-line-height: 2.8;
  --vs-controls-color: #abafb2 !important;
  --vs-border-color: #dce0e4 !important;
  --vs-border-radius: 9px !important;
  --vs-dropdown-option-padding: 3px 12px;
}
</style>
