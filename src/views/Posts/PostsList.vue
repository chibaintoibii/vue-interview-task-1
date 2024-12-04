<template>
  <div>
    <h1>Posts List</h1>
    <ul>
      <li>Post 1</li>
      <li>Post 2</li>
      <li>Post 3</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {getPostList} from "@/services/http/api/posts";

const {} = getPostList()
</script>

<style scoped>

</style>