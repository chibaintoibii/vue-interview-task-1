<template>
  <form class="min-w-[700px]" @submit.prevent="onSubmit">
    <BaseInput v-model="postTitle" class="mt-3" placeholder="Title" />
    <BaseInput v-model="postBody" class="mt-3" placeholder="Body" />
    <SimpleSelect
      class="mt-3"
      v-model="selectedAuthor"
      :options="authors"
      label="Author"
      optionLabel="name"
      optionValue="id"
    />
    <BaseButton class="mt-3" type="submit">Submit</BaseButton>
  </form>
</template>

<script setup lang="ts">
import BaseInput from "@/components/Input/BaseInput.vue";
import SimpleSelect from "@/components/Select/SimpleSelect.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import { ref } from "vue";
import { getUsers } from "@/services/http/api/users.ts";
import { useCreatePost } from "@/services/http/api/posts.ts";
import { ToastType, useToast } from "@/components/Toast/ToastPlugin.ts";

const postTitle = ref("");
const toast = useToast();
const postBody = ref("");
const { data: authors } = getUsers();
const selectedAuthor = ref<number>();

const { mutate: createPost } = useCreatePost();

const props = defineProps<{
  onClose?: () => void;
}>();
function onSubmit() {
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
</script>

<style scoped></style>
