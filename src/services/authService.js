import { http } from '../hooks/useHttp';

const AUTH_PATH = '/api/auth';

const authService = {
  async login(identifier, password) {
    const response = await http.post(`${AUTH_PATH}/authenticate`, {
      username: identifier,
      password,
    });
    const session = response.data;
    const profileResponse = await http.get(`${AUTH_PATH}/me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    const profile = profileResponse.data;

    return {
      ...session,
      currentUser: profile,
      userId: profile.id,
      roles: profile.roles || [],
      permissions: profile.permissions || [],
    };
  },
};

export const login = authService.login;

export default authService;
