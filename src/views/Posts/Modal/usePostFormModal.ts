import { useModal, useModalSlot } from "vue-final-modal";
import FinalModal from "@/components/Modal/FinalModal.vue";
import PostForm from "@/views/Posts/Modal/PostForm.vue";

export function usePostFormModal(options: IPostFormModalProps) {
  const modal = useModal({
    component: FinalModal,
    attrs: {
      title: options.type === "create" ? "Create Post" : "Edit Post",
      onClose: () => {
        modal.close();
      },
    },

    slots: {
      default: useModalSlot({
        component: PostForm,
        attrs: {
          onClose: () => {
            modal.close();
            options.onClose?.();
          },
          initialVal: options.initialVal,
        },
      }),
    },
  });

  return modal;
}

export interface IPostFormModalProps {
  onClose?: () => void;
  type: "create" | "edit";
  initialVal?: {
    title: string;
    body: string;
    userId: number;
    id: number;
  };
}
