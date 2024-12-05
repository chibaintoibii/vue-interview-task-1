<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import IconEye from "@/assets/icons/IconEye.vue";
import IconEyeSlash from "@/assets/icons/IconEyeSlash.vue";

interface IInputProps {
  name?: string;
  type?: string;
  label?: string;
  inputStyle?: string;
  placeholder?: string;
  modelValue?: string | number;
  errorMessage?: string;
  textarea?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

const props = defineProps<IInputProps>();
const emit = defineEmits(["update:modelValue", "blur", "focus"]);
defineExpose({ focus });

const autocomplete = computed(() => {
  if (props.type === "password") {
    return "new-password";
  }
  if (props.name === "username") {
    return "username";
  }
  return "off";
});
const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>();

const isHiddenPassword = ref(props.type === "password");

const inputType = computed(() => {
  if (props.type !== "password") {
    return props.type;
  }

  if (isHiddenPassword.value) {
    return "password";
  } else {
    return "text";
  }
});

const passwordIcon = computed(() =>
  isHiddenPassword.value ? IconEyeSlash : IconEye
);

function focus() {
  inputRef.value?.focus();
}

onMounted(() => {
  if (props.autoFocus) setTimeout(focus, 10);
});
</script>
<template>
  <div
    :class="{ 'has-error': !!errorMessage, isFilled: value }"
    class="TextInput bg-transparent"
  >
    <label class="input">
      <textarea
        v-if="textarea"
        :id="id"
        ref="inputRef"
        :disabled="disabled"
        v-model="value"
        :class="{ 'cursor-disabled': disabled }"
        :name="name"
        :style="inputStyle"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />
      <input
        v-else
        :id="id"
        ref="inputRef"
        v-model="value"
        :autocomplete="autocomplete"
        :class="{ 'cursor-disabled': disabled }"
        :disabled="disabled"
        :name="name"
        :style="inputStyle"
        :type="inputType"
      />
      <span
        v-if="placeholder"
        :class="{ '!cursor-disabled': disabled }"
        class="place truncate text-ellipsis max-w-[calc(100%-20px)]"
      >
        {{ placeholder }}
        <span v-if="required" class="text-red-500">*</span>
      </span>
      <span
        v-if="type === 'password'"
        class="absolute end-3 top-[32%] cursor-pointer text-gray-400 select-none"
        @click="isHiddenPassword = !isHiddenPassword"
      >
        <component :is="passwordIcon" class="w-5 h-5" />
      </span>
    </label>
    <p v-show="errorMessage" class="help-message">{{ errorMessage }}</p>
  </div>
</template>
