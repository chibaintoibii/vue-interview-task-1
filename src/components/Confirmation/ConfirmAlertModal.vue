<script lang="ts" setup>
import { ref } from "vue";
import BaseButton from "@/components/Button/BaseButton.vue";

const props = defineProps<{
  onClose: () => Promise<void>;
  onConfirm: () => Promise<void>;

  text: string;
}>();

const isLoading = ref(false);

async function handleConfirm() {
  try {
    isLoading.value = true;

    await props.onConfirm();
    await props.onClose();
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="w-96 my-3 flex flex-row break-after-auto">
      {{ props.text }}
    </div>

    <div class="flex justify-end gap-2 mt-2">
      <BaseButton @click="props.onClose()"> Cancel </BaseButton>

      <BaseButton variant="danger" @click="handleConfirm" :loading="isLoading">
        Confirm
      </BaseButton>
    </div>
  </div>
</template>
