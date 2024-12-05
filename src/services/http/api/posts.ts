import { useMutation, useQuery } from "@tanstack/vue-query";
import $api from "@/services/http";
import { ComputedRef, toRaw, MaybeRef } from "vue";

export function getPostsList(filter: ComputedRef<GetPostsListParams>) {
  return useQuery({
    queryFn: async () => {
      const params = toRaw(filter.value) as GetPostsListParams;
      return $api
        .get<PostItemResponse[]>("/posts", {
          params: params,
        })
        .then((res) => res.data);
    },
    queryKey: ["posts", filter],
  });
}

export interface GetPostsListParams {
  _limit: number;
  _page: number;
}

export interface PostItemResponse {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostItemRequest {
  title: string;
  body: string;
  userId: number;
}

export function useCreatePost() {
  return useMutation({
    mutationFn: async (data: PostItemRequest) => {
      return $api
        .post<PostItemResponse>("/posts", data)
        .then((res) => res.data);
    },
    mutationKey: ["create-post"],
  });
}

export function getPostComments(
  postId: number,
  enabledForFetch: MaybeRef<boolean>
) {
  return useQuery({
    queryFn: async () => {
      return $api
        .get<CommentItemResponse[]>(`/posts/${postId}/comments`)
        .then((res) => res.data);
    },
    enabled: enabledForFetch,
    queryKey: ["comments", postId],
  });
}

export interface CommentItemResponse {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

export interface UpdatePostRequest extends PostItemRequest {
  id: number;
}

export function useEditPost() {
  return useMutation({
    mutationFn: async (data: UpdatePostRequest) => {
      return $api
        .put<PostItemResponse>(`/posts/${data.id}`, data)
        .then((res) => res.data);
    },
    mutationKey: ["edit-post"],
  });
}

export function useDeletePost() {
  return useMutation({
    mutationFn: async (postId: number) => {
      return $api.delete(`/posts/${postId}`);
    },
    mutationKey: ["delete-post"],
  });
}
