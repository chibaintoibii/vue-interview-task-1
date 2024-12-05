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
        },
      }),
    },
  });

  return modal;
}

export interface IPostFormModalProps {
  onClose?: () => void;
  type: "create" | "edit";
  initialVal?: Partial<IPost>;
}

export interface IPost {
  id: number;
  title: string;
  body: string;
}
