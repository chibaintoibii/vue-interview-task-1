<template>
  <div>
    <h1>{{title}}</h1>
    <div>Author: <h3>{{author}}</h3></div>
    <p>{{content}}</p>
    <div>
      <button>Comments</button>
      <button>Edit</button>
      <button>Delete</button>
      <button>Add to favourites</button>
    </div>
    <div>
      checkbox
    </div>
  </div>
</template>

<script setup lang="ts">
import {PostItemProps} from './types';

const props = defineProps<PostItemProps>()
</script>

<style scoped>

</style>