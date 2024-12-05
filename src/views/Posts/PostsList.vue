<template>
  <div>
    <h1 class="text-lg text-center my-2">Posts List</h1>
    <div class="flex flex-col pe-1">
      <BaseButton
        class="self-end"
        variant="success"
        @click="showCreatePostModal"
        >+ Add new post</BaseButton
      >
    </div>
    <div class="flex justify-between items-center gap-x-2 p-1">
      <BaseInput placeholder="Search by title" v-model="searchByPostTitle" />
      <SimpleSelect
        value-name="id"
        :options="usersFilter"
        multiple
        placeholder="Search by author"
        v-model="selectedUserIds"
      />
      <SimpleSelect
        :clearable="false"
        label="Limit"
        :options="limitOptions"
        v-model="selectedLimit"
      />
      <SimpleSelect
        :options="sortByOptions"
        v-model="sortByValue"
        label="Sort by"
      />
      <RawCheckbox label="Saved posts" v-model="inFavorites" />
    </div>
    <ul>
      <PostItem
        v-for="post in filteredSortedPosts"
        :key="post.id"
        :post="post"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { getPostsList, GetPostsListParams } from "@/services/http/api/posts";
import PostItem from "@/views/Posts/PostItem.vue";
import { useRoute, useRouter } from "vue-router";
import { computed, reactive, ref, toRaw, watch } from "vue";
import SimpleSelect from "@/components/Select/SimpleSelect.vue";
import { getUsers } from "@/services/http/api/users.ts";
import { PostItemProps } from "@/views/Posts/types";
import BaseInput from "@/components/Input/BaseInput.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import { usePostFormModal } from "@/views/Posts/Modal/usePostFormModal.ts";
import RawCheckbox from "@/components/Checkbox/RawCheckbox.vue";

const route = useRoute();
const router = useRouter();
const filter = reactive({
  _limit: Number(route.query.limit) || 10,
});

watch(filter, (newFilter) => {
  _page.value = 1;
  const rawFilter = toRaw(newFilter);
  router.replace({ query: { ...rawFilter, _page: 1 } });
});

const limitOptions = ref([
  { value: 10, name: "10" },
  { value: 20, name: "20" },
  { value: 50, name: "50" },
  { value: 1000, name: "All" },
]);

const selectedLimit = ref(Number(route.query._limit) || 10);

const inFavorites = ref(false);

const sortByOptions = ref([
  { value: "id", name: "Id" },
  { value: "title", name: "Title" },
  { value: "author", name: "Author" },
  { value: "favorite", name: "Favorite" },
]);
watch(selectedLimit, (newLimit) => {
  filter._limit = newLimit;
  router.replace({ query: { ...toRaw(filter), _page: 1 } });
});

const sortByValue = ref<string>(route.query._sort?.toString() || "id");
watch(sortByValue, (newSortBy) => {
  router.replace({ query: { ...toRaw(filter), _page: 1, _sort: newSortBy } });
});

const searchByPostTitle = ref("");

const _page = ref(Number(route.query._page) || 1);

const finalFilter = computed<GetPostsListParams>(() => {
  return {
    ...filter,
    _page: _page.value,
  };
});

const { data: postsData } = getPostsList(finalFilter);
const { data: usersData } = getUsers();

const usersFilter = computed(() => {
  return (usersData.value || []).map((user) => ({
    id: user.id,
    name: user.name,
  }));
});

const selectedUserIds = ref<number[]>([]);

const fetchedPosts = computed<PostItemProps[]>(() => {
  return (postsData.value || []).map((post) => {
    const user = (usersData.value || []).find(
      (user) => user.id === post.userId
    );
    return {
      id: post.id,
      title: post.title,
      body: post.body,
      author: user?.name || "Unknown",
      isFavorite: false,
    };
  });
});

const filteredPosts = computed<PostItemProps[]>(() => {
  return fetchedPosts.value
    .filter(
      (post) =>
        (selectedUserIds.value.length === 0 ||
          selectedUserIds.value.includes(post.id)) &&
        post.title.toLowerCase().includes(searchByPostTitle.value.toLowerCase())
    )
    .map((post) => ({
      ...post,
      favorite: false,
    }));
});

const filteredSortedPosts = computed<PostItemProps[]>(() => {
  return filteredPosts.value.sort((a, b) => {
    if (sortByValue.value === "author") {
      return a.author.localeCompare(b.author);
    }
    if (sortByValue.value === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortByValue.value === "favorite") {
      return a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1;
    }
    return a.id - b.id;
  });
});

function showCreatePostModal() {
  usePostFormModal({
    type: "create",
  }).open();
}
</script>

<style scoped></style>
