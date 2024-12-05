import IconWarning from "@/assets/icons/IconWarning.vue";
import { h } from "vue";
import { useModal, useModalSlot } from "vue-final-modal";
import FinalModal from "@/components/Modal/FinalModal.vue";
import Confirm from "@/components/Confirmation/ConfirmAlertModal.vue";

export default function useConfirm(text: string, onConfirm: () => void) {
  const modal = useModal({
    component: FinalModal,
    attrs: {
      onClose() {
        modal.close();
      },
    },

    slots: {
      title: {
        render: () =>
          h(
            "div",
            {
              class: "text-xl flex-grow flex gap-2 items-center font-bold",
            },
            [h(IconWarning), "Confirm action"]
          ),
        components: {
          IconWarning,
        },
      },

      default: useModalSlot({
        component: Confirm,

        attrs: {
          async onClose() {
            await modal.close();
          },
          async onConfirm() {
            await onConfirm();
          },
          text,
        },
      }),
    },
  });

  return modal;
}
