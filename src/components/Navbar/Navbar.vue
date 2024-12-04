<template>
  <div class="h-14 bg-blue-600 flex items-center justify-between gap-10 px-4 text-white">
    <div class="flex items-center justify-center gap-x-3">
      <img src="/images/islom-profile.png" alt="" class="w-8 h-8 rounded-full">
      <h3 class="font-semibold">Islom's interview task</h3>
    </div>
    <div class="flex items-center gap-x-10">
      <div :class="{active: menu.link === route.path}" v-for="menu in menus">
        <router-link :to="menu.link" class="">{{menu.name}}</router-link>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {ref} from "vue";

const menus = ref([
  {
    name: 'Posts',
    link: '/posts',
  },
  {
    name: 'Photos',
    link: '/photos',
  },
  {
    name: 'Todos',
    link: '/todos',
  }
])

const route = useRoute();
</script>

<style scoped>
.active {
  @apply text-orange-600
}
</style>