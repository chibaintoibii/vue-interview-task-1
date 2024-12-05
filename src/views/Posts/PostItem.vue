<template>
  <li
    class="grid grid-cols-20 p-2 border-2 rounded-md m-1 gap-x-2"
    :class="{ 'bg-blue-100': isFavorite }"
  >
    <div class="flex items-center justify-between">
      <input
        class="w-4 h-4"
        type="checkbox"
        :checked="isSelected"
        @change="handleToggleSelect"
      />
      {{ post.id }})
    </div>
    <div class="col-span-6">
      <h1><span class="font-semibold">Title:</span>{{ post.title }}</h1>
      <div class="text-sm">
        <span class="font-semibold">Author: </span>{{ post.author }}
      </div>
      <div class="text-xs flex gap-x-1 items-center">
        <BaseButton @click="enabledForFetch = !enabledForFetch"
          ><IconComment class="w-4 h-4" />
          {{ enabledForFetch ? "Hide comments" : "Show comments" }}</BaseButton
        >
        <BaseButton @click="handleToggleFavorite" variant="warning"
          ><IconStar class="w-6 h-6" />{{
            isFavorite ? "Remove from Favorites" : "Add to Favorites"
          }}
        </BaseButton>
        <BaseButton variant="success" @click="handleEditPost"
          ><IconEdit class="w-4 h-4" /> Edit</BaseButton
        >
        <BaseButton variant="danger" @click="handleDeletePost"
          ><IconTrash class="w-4 h-4" /> Delete</BaseButton
        >
      </div>
    </div>
    <div class="col-span-13">
      <span class="font-semibold">body:</span> {{ post.body }}
    </div>
    <div class="col-span-20" v-if="enabledForFetch">
      <h3 class="text-center font-semibold">Comments</h3>
      <ul>
        <li
          v-for="comment in comments"
          :key="comment.id"
          class="p-2 border m-1 rounded"
        >
          <div class="flex items-center gap-x-4">
            <div>
              <div>Author:{{ comment.author }}</div>
              <div>email:{{ comment.email }}</div>
            </div>
            <p>body: {{ comment.body }}</p>
          </div>
        </li>
      </ul>
    </div>
  </li>
</template>

<script setup lang="ts">
import { PostItemProps } from "./types";
import BaseButton from "@/components/Button/BaseButton.vue";
import IconEdit from "@/assets/icons/IconEdit.vue";
import IconTrash from "@/assets/icons/IconTrash.vue";
import IconStar from "@/assets/icons/IconStar.vue";
import IconComment from "@/assets/icons/IconComment.vue";
import { computed, ref, watch } from "vue";
import {
  CommentItemResponse,
  getPostComments,
  useDeletePost,
} from "@/services/http/api/posts.ts";
import { getUsers } from "@/services/http/api/users.ts";
import { usePostFormModal } from "@/views/Posts/Modal/usePostFormModal.ts";
import useConfirm from "@/components/Confirmation/useConfirm.ts";
import { ToastType, useToast } from "@/components/Toast/ToastPlugin.ts";

const props = defineProps<{
  post: PostItemProps;
  isSelected: boolean;
  isFavorite: boolean;
}>();

const toast = useToast();

const emit = defineEmits(["toggleFavorite", "toggleSelect"]);

function handleToggleFavorite() {
  emit("toggleFavorite", props.post.id);
}

const isPostSelected = ref(false);

watch(isPostSelected, () => {
  emit("toggleSelect", props.post.id);
});

const enabledForFetch = ref(false);
const { data: commentsData } = getPostComments(props.post.id, enabledForFetch);
const { data: users } = getUsers();
const { mutate: deletePost } = useDeletePost();

const comments = computed<IComment[]>(() => {
  return (commentsData.value || []).map((comment: CommentItemResponse) => {
    const user = (users.value || []).find(
      (user) => user.email === comment.email
    );
    return {
      id: comment.id,
      email: comment.email,
      author: user?.name || "Unknown",
      body: comment.body,
    };
  });
});

export interface IComment {
  id: number;
  author: string;
  email: string;
  body: string;
}

function handleToggleSelect() {
  emit("toggleSelect", props.post.id);
}

function handleEditPost() {
  usePostFormModal({
    type: "edit",
    initialVal: {
      title: props.post.title,
      body: props.post.body,
      userId: props.post.userId,
      id: props.post.id,
    },
  }).open();
}

function handleDeletePost() {
  useConfirm("Are you sure you want to delete this post?", () => {
    deletePost(props.post.id, {
      onSuccess: () => {
        toast.open({
          type: ToastType.SUCCESS,
          timer: 3000,
          message: "Post deleted successfully",
        });
      },
    });
  }).open();
}
</script>

<style scoped></style>
