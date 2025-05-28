export const checkAuth = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};

export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/signIn';
  }
};