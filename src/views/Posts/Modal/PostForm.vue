<template>
  <form class="min-w-[700px]" @submit.prevent="onSubmit">
    <BaseInput v-model="postTitle" class="mt-3" placeholder="Title" />
    <BaseInput v-model="postBody" class="mt-3" placeholder="Body" />
    <SimpleSelect
      class="mt-3"
      v-model="selectedAuthor"
      :options="authors"
      label="Author"
    />
    <BaseButton class="mt-3" type="submit">Submit</BaseButton>
  </form>
</template>

<script setup lang="ts">
import BaseInput from "@/components/Input/BaseInput.vue";
import SimpleSelect from "@/components/Select/SimpleSelect.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import { computed, ref } from "vue";
import { getUsers } from "@/services/http/api/users.ts";
import { useCreatePost, useEditPost } from "@/services/http/api/posts.ts";
import { ToastType, useToast } from "@/components/Toast/ToastPlugin.ts";

const props = defineProps<{
  onClose?: () => void;
  initialVal?: { id?: number; title: string; body: string; userId: number };
}>();
const postTitle = ref(props.initialVal?.title || "");
const toast = useToast();
const postBody = ref(props.initialVal?.body || "");
const { data: authorsData } = getUsers();

const authors = computed(() => {
  return (
    authorsData.value?.map((author) => ({
      value: author.id,
      name: author.name,
    })) || []
  );
});

const selectedAuthor = ref<number>(props.initialVal?.userId || 1);
const { mutate: createPost } = useCreatePost();

const { mutate: editPost } = useEditPost();
function onSubmit() {
  if (props.initialVal?.id) {
    editPost(
      {
        title: postTitle.value,
        body: postBody.value,
        userId: selectedAuthor.value || 1,
        id: props.initialVal.id,
      },
      {
        onSuccess: () => {
          props.onClose?.();
          toast.open({
            type: ToastType.SUCCESS,
            message: "Post updated successfully",
            timer: 3000,
          });
        },
        onError: () => {
          toast.open({
            type: ToastType.ERROR,
            message: "Failed to update post",
            timer: 3000,
          });
        },
      }
    );
  } else {
    createPost(
      {
        title: postTitle.value,
        body: postBody.value,
        userId: selectedAuthor.value || 1,
      },
      {
        onSuccess: () => {
          props.onClose?.();
          toast.open({
            type: ToastType.SUCCESS,
            message: "Post created successfully",
            timer: 3000,
          });
        },
        onError: () => {
          toast.open({
            type: ToastType.ERROR,
            message: "Failed to create post",
            timer: 3000,
          });
        },
      }
    );
  }
}
</script>

<style scoped></style>
