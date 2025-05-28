export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = "/auth/signIn"; // Redirect to login page
};