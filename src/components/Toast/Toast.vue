<template>
  <div :class="toast.type" class="toast">
    <div class="toast_info">
      <component
        :is="icons[toast.type]"
        v-if="icons[toast.type]"
        class="flex-shrink-0"
      />
      <ul v-if="splitToastMessageByComma.length">
        <li
          v-for="(item, index) in splitToastMessageByComma"
          :key="index"
          class="text-sm"
        >
          {{ index + 1 }}.
          {{ item }}
        </li>
      </ul>
      <p v-else class="text-sm break-all">{{ toast.message }}</p>
      <span
        v-if="!toast.closeable"
        :class="[toast.closeable ? 'toast_loader' : '', toast.type]"
        :style="{
          animation: `toaster ${(toast.timer ?? 1000) / 1000}s ease-in`,
        }"
      />
    </div>
    <div v-if="toast.closeable" class="toast-close" @click="toast.close">
      <IconClose />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ToastType } from "@/components/Toast/ToastPlugin";
import { computed, type PropType } from "vue";
import type { IToastOptions } from "@/components/Toast/IToastOptions";
import IconSuccess from "@/assets/icons/IconSuccess.vue";
import IconError from "@/assets/icons/IconError.vue";
import IconWarning from "@/assets/icons/IconWarning.vue";
import IconInfo from "@/assets/icons/IconInfo.vue";
import IconClose from "@/assets/icons/IconClose.vue";

const icons = {
  [ToastType.SUCCESS]: IconSuccess,
  [ToastType.ERROR]: IconError,
  [ToastType.WARNING]: IconWarning,
  [ToastType.INFO]: IconInfo,
};

const props = defineProps({
  toast: {
    type: Object as PropType<IToastOptions>,
    default: (): IToastOptions => ({
      message: "no text",
      type: ToastType.SUCCESS,
      closeable: true,
      close: () => ({}),
      timer: 1000,
    }),
  },
});

const splitToastMessageByComma = computed(() => {
  if (props.toast.message.includes(",")) {
    return props.toast.message.split(",");
  } else {
    return [];
  }
});
</script>

<style>
.toast {
  width: 100%;
  position: relative;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
  border-width: 1px;

  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 29px 11px rgba(116, 164, 139, 0.01),
    0 16px 10px rgba(116, 164, 139, 0.05), 0 7px 7px rgba(116, 164, 139, 0.09),
    0 2px 4px rgba(116, 164, 139, 0.1), 0 0 0 rgba(116, 164, 139, 0.1);

  .toast_info {
    gap: 16px;
    padding: 0 4px;
    display: flex;
    position: relative;

    span {
      left: 0;
      width: 100%;
      height: 2px;
      bottom: -20px;
      position: absolute;

      &.success {
        background: #3eb262;
      }

      &.danger {
        background: #e45531;
      }

      &.warning {
        background: #f4bf4a;
      }

      &.info {
        background: #4083cf;
      }
    }
  }

  .toast-close {
    top: -18px;
    right: -5px;
    width: 18px;
    height: 18px;
    display: flex;
    border-radius: 100%;
    position: absolute;
    align-items: center;
    justify-content: center;
  }

  &.success {
    border-color: #3eb262;
    color: #3eb262;
    background: #eafff0;

    .toast-close {
      background: #3eb262;
    }
  }

  &.error {
    border-color: #e45531;
    color: #e45531;
    background: #f9dcd5;

    .toast-close {
      background: #e45531;
    }
  }

  &.warning {
    border-color: #f4bf4a;
    color: #f4bf4a;
    background: #fbf0d8;

    .toast-close {
      background: #f4bf4a;
    }
  }

  &.info {
    border-color: #4083cf;
    color: #4083cf;
    background: #e1effe;

    .toast-close {
      background: #4083cf;
    }
  }
}

@keyframes toaster {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
