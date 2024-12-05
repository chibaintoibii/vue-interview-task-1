<template>
  <li class="grid grid-cols-20 p-2 border rounded-md m-1 gap-x-2">
    <div class="flex items-center justify-center p-0">
      <input type="checkbox" class="w-5 h-5" />
      {{ post.id }}
    </div>
    <div class="col-span-5">
      <h1><span class="font-semibold">Title:</span>{{ post.title }}</h1>
      <div class="text-sm">
        <span class="font-semibold">Author: </span>{{ post.author }}
      </div>
      <div class="text-xs flex gap-x-1 items-center">
        <BaseButton><IconComment class="w-4 h-4" /> Comments</BaseButton>
        <BaseButton variant="success"
          ><IconEdit class="w-4 h-4" /> Edit</BaseButton
        >
        <BaseButton variant="danger"
          ><IconTrash class="w-4 h-4" /> Delete</BaseButton
        >
        <BaseButton variant="warning"
          ><IconStar class="w-4 h-4" />Add to Favorites</BaseButton
        >
      </div>
    </div>
    <div class="col-span-14">
      <span class="font-semibold">body:</span> {{ post.body }}
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

const props = defineProps<{
  post: PostItemProps;
}>();
</script>

<style scoped></style>
