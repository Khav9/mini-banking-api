import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { LoginRequest } from "@/modules/auth/types";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ username, password }: LoginRequest) =>
      authApi.login({ username, password }),
  });
};
