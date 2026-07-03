/** Raw endpoint paths for the User module — see `UserController.java`. */
export const USER_API = {
  base: '/users',
  byId: (id: string) => `/users/${id}`,
} as const;
