import { useQuery } from "@tanstack/vue-query";
import $api from "@/services/http";

export function getUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return $api.get<UserResponse[]>("users").then((res) => res.data);
    },
  });
}

export interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
