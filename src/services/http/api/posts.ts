import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import $api from "@/services/http";
import { ComputedRef, toRaw } from "vue";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PostItemRequest) => {
      return $api
        .post<PostItemResponse>("/posts", data)
        .then((res) => res.data);
    },
    mutationKey: ["create-post"],
    onSuccess: () => {
      queryClient.refetchQueries(["posts"]);
    },
  });
}
