export default function authHeader() {
  let user = JSON.parse(localStorage.getItem('user'));
  let access_token = JSON.parse(localStorage.getItem('user_access_token'));
  if (user && access_token) {
    return { Authorization: 'Bearer ' + access_token };
  } else {
    return {};
  }
}
