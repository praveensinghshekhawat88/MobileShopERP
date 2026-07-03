import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { userService } from '@/modules/user/services/userService';
import type { CreateUserRequest, UpdateUserRequest, UserResponse } from '@/modules/user/types/User';
import { showSuccessToast } from '@/utils/toast';

export function useCreateUser(): UseMutationResult<UserResponse, unknown, CreateUserRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateUserRequest) => userService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccessToast('User created successfully.');
    },
  });
}

export function useUpdateUser(): UseMutationResult<
  UserResponse,
  unknown,
  { readonly id: string; readonly request: UpdateUserRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => userService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      void queryClient.invalidateQueries({ queryKey: ['users', 'detail', id] });
      showSuccessToast('User updated successfully.');
    },
  });
}

export function useDeleteUser(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccessToast('User deleted successfully.');
    },
  });
}
