let hasUser;
if (typeof window !== 'undefined') {
  // Perform localStorage action
  hasUser = localStorage.getItem('key')
}
export {hasUser};