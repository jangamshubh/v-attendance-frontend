import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

class AuthService {
    login(user) {
        return axios
        .post(API_URL + '/auth/signin', {
            email: user.email,
            password: user.password
        })
        .then(response => {
            if (response.data.access_token) {
                localStorage.setItem('user_access_token', JSON.stringify(response.data.access_token));
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('role', JSON.stringify(response.data.role));
            }

            return response.data;
        });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('user_access_token');
        localStorage.removeItem('role');
    }

    // register(user) {
    //   return axios.post(API_URL + 'signup', {
    //     username: user.username,
    //     email: user.email,
    //     password: user.password
    //   });
    // }
}

export default new AuthService();
