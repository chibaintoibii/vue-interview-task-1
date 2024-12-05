<template>
  <button
    :id="id"
    :class="[
      variantColor,
      stroke ? 'stroke' : '',
      size === 'sm'
        ? 'text-sm px-1 py-0'
        : size === 'lg'
        ? 'text-lg px-6 py-3'
        : 'py-2 px-3',
    ]"
    :disabled="disabled || loading"
    class="btn"
    type="button"
  >
    <span v-if="loading">
      <Loader class="w-6 h-6" />
    </span>

    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Loader from "@/components/Loader/Loader.vue";

const props = defineProps<{
  loading?: boolean;
  stroke?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "danger" | "warning";
  id?: string;
}>();

const variantColor = computed(() =>
  props.variant ? props.variant : "primary"
);
</script>

<style scoped>
.btn {
  @apply text-white rounded-lg cursor-pointer  inline-flex gap-2 items-center justify-center font-semibold;
}

.btn.success:not(.stroke) {
  @apply bg-green-600;
  @apply hover:bg-green-700;
}

.btn.success.stroke {
  @apply border-[#00ab55] text-[#00ab55];
  @apply hover:bg-[#00ab55] hover:text-white;
}

.btn.primary:not(.stroke) {
  @apply bg-blue-500;
  @apply hover:bg-blue-600;
}

.btn.stroke {
  @apply border-2;
  @apply hover:bg-transparent;
}

.btn.primary.stroke {
  @apply border-[#7753f8] text-[#7753f8];
  @apply hover:bg-[#7753f8] hover:text-white;
}

.btn.danger:not(.stroke) {
  @apply bg-red-500;
  @apply hover:bg-red-600;
}

.btn.danger.stroke {
  @apply border-[#ff4d4f] text-[#ff4d4f];
  @apply hover:bg-[#ff4d4f] hover:text-white;
}

.btn.warning:not(.stroke) {
  @apply bg-yellow-500;
  @apply hover:bg-[#d48806];
}

.btn.warning.stroke {
  @apply border-[#faad14] text-[#faad14];
  @apply hover:bg-[#faad14] hover:text-white;
}

.btn[disabled] {
  @apply cursor-not-allowed;
  @apply disabled:bg-[#c4c4c4] opacity-80 hover:!bg-[#c4c4c4];
}
</style>
