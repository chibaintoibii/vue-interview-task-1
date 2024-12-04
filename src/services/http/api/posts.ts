import {useQuery} from "@tanstack/vue-query";
import $api from "@/services/http";

export function getPostList() {
    return useQuery({
        queryFn: async () => {
            return $api.get('/posts')
        },
        queryKey: ['posts'],
    })
}