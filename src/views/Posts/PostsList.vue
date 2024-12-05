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
      <RawCheckbox label="Saved posts" v-model="isFavoriteFilter" />
    </div>
    <div v-if="selectedPosts.length > 0">
      <BaseButton variant="danger" @click="deleteSelectedPosts"
        ><IconTrash class="w-6 h-6" />Delete</BaseButton
      >
      <BaseButton variant="warning" @click="addSelectedPostsToFavorites"
        ><IconStar class="w-6 h-6" />Add to favorites</BaseButton
      >
    </div>
    <ul v-if="filteredSortedPosts.length > 0">
      <PostItem
        v-for="post in filteredSortedPosts"
        :is-selected="isSelectedPost(post.id)"
        :is-favorite="isFavorite(post.id)"
        :key="post.id"
        :post="post"
        @toggle-favorite="toggleFavorite"
        @toggle-select="toggleSelectedPost"
      />
      <Pagination :last-page="lastPage" v-model="_page" />
    </ul>
    <div v-else>
      <h1 class="text-center">No posts found</h1>
    </div>
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
import Pagination from "@/components/Table/Pagination.vue";
import { useLocalStorage } from "@vueuse/core";
import IconTrash from "@/assets/icons/IconTrash.vue";
import IconStar from "@/assets/icons/IconStar.vue";
import useConfirm from "@/components/Confirmation/useConfirm.ts";

const route = useRoute();
const router = useRouter();
const filter = reactive({
  _limit: Number(route.query._limit) || 10,
});

const limitOptions = ref([
  { value: 10, name: "10" },
  { value: 20, name: "20" },
  { value: 50, name: "50" },
  { value: 1000, name: "All" },
]);

const selectedLimit = ref(Number(route.query._limit) || 10);

const isFavoriteFilter = ref(false);
const favorites = useLocalStorage<number[]>("favorites", []);
function isFavorite(postId: number) {
  return favorites.value.includes(postId);
}

function toggleFavorite(postId: number) {
  if (isFavorite(postId)) {
    favorites.value = favorites.value.filter((id) => id !== postId);
  } else {
    favorites.value.push(postId);
  }
}

const selectedPosts = ref<number[]>([]);
const isSelectedPost = (postId: number) => selectedPosts.value.includes(postId);

const toggleSelectedPost = (postId: number) => {
  if (isSelectedPost(postId)) {
    selectedPosts.value = selectedPosts.value.filter((id) => id !== postId);
  } else {
    selectedPosts.value.push(postId);
  }
};

const sortByOptions = ref([
  { value: "id", name: "Id" },
  { value: "title", name: "Title" },
  { value: "author", name: "Author" },
  { value: "favorite", name: "Favorite" },
]);

const sortByValue = ref<string>(route.query._sort?.toString() || "id");

const searchByPostTitle = ref("");

const _page = ref(Number(route.query._page) || 1);

const selectedUserIds = ref<number[]>([]);

const lastPage = computed(() => {
  return isFavoriteFilter ? 1 : Math.ceil(100 / selectedLimit.value);
});

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
      userId: post.userId,
      isFavorite: isFavorite(post.id),
    };
  });
});

const filteredPosts = computed<PostItemProps[]>(() => {
  return fetchedPosts.value.filter(
    (post) =>
      (selectedUserIds.value.length === 0 ||
        selectedUserIds.value.includes(post.id)) &&
      post.title
        .toLowerCase()
        .includes(searchByPostTitle.value.toLowerCase()) &&
      (!isFavoriteFilter.value || isFavorite(post.id))
  );
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
      return isFavorite(a.id) === isFavorite(b.id)
        ? 0
        : isFavorite(a.id)
        ? -1
        : 1;
    }
    return a.id - b.id;
  });
});

watch(_page, (newPage) => {
  router.replace({ query: { ...toRaw(filter), _page: newPage } });
});

watch(selectedLimit, (newLimit) => {
  filter._limit = newLimit;
  router.replace({ query: { ...toRaw(filter), _page: 1 } });
});

watch(sortByValue, (newSortBy) => {
  router.replace({ query: { ...toRaw(filter), _page: 1, _sort: newSortBy } });
});

watch(filter, (newFilter) => {
  _page.value = 1;
  const rawFilter = toRaw(newFilter);
  router.replace({ query: { ...rawFilter, _page: 1 } });
});
function showCreatePostModal() {
  usePostFormModal({
    type: "create",
  }).open();
}

function deleteSelectedPosts() {
  useConfirm("Are you sure you want to delete selected posts?", () => {
    console.log("delete");
  }).open();
}

function addSelectedPostsToFavorites() {
  useConfirm(
    "Are you sure you want to add selected posts to favorites?",
    () => {
      favorites.value = [...favorites.value, ...selectedPosts.value];
      selectedPosts.value = [];
    }
  ).open();
}
</script>

<style scoped></style>
