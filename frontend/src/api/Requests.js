import axios from "axios";

const ip = new URL(window.location.origin).hostname;
const domain = `http://${ip}:3001/api`;

const axiosInstance = axios.create({
    baseURL: domain,
    headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
    }
});

axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 401) {
            return Promise.reject({ state: false, message: 'Authorization error: Unauthorized' });
        } else {
            // Общая обработка других ошибок от сервера
            const errorMessage = error.response.data.message || 'Unknown server error';
            return Promise.reject({ state: false, message: errorMessage });
        }
    } else if (error.request) {
        // Запрос был сделан, но ответ не был получен
        return Promise.reject({ state: false, message: 'Request error: no response received' });
    } else {
        // Что-то пошло не так при настройке запроса
        return Promise.reject({ state: false, message: 'Request setup error: ' + error.message });
    }
});



export default class Requests {
    // AUTH
    static async login(username, password){
        let obj = {username:username, password:password};
        const resp = await
            axiosInstance.post('/auth/login', obj);
        return resp.data;
    }
    static async registration(username, password, email, full_name){
        let obj = {
            username: username,
            password: password,
            email: email,
            full_name: full_name
        };
        const resp = await
            axiosInstance.post('/auth/register', obj);
        return resp.data;
    }
    static async passwordResetCreate(email){
        let obj = {email:email};
        const resp = await
            axiosInstance.post('/auth/password-reset', obj);
        return resp.data;
    }
    static async passwordResetConfirm(confirm_token, password){
        let obj = {
            password: password
        };
        const resp = await
            axiosInstance.post(`/auth/password-reset/${confirm_token}`, obj);
        return resp.data;
    }

    // USER
    static async users_all(page = 1, order = 'ASC', field = 'id'){
        const config = {
            headers: {
                'field': field,
                'order': order,
                'page': page
            }
        };
        console.log(config.headers);
        const resp = await
            axiosInstance.get(`/users/`, config);
        return resp.data;
    }
    static async user_by_id(user_id){
        const resp = await
            axiosInstance.get(`/user/${user_id}`);
        return resp.data;
    }
    static async avatarUpload(file, account_id, token){
        const data = new FormData();
        data.append('photo', file);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'account_id': account_id,
                'Authorization': `Bearer ${token}`
            }
        };
        return await
            axiosInstance.patch(`/user/avatar`, data, config);
    }
    static get_img_link(user_id){
        return `${domain}/user/${user_id}/avatar`;
    }

    static async findUsername(token, body) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await axiosInstance.post(`/user/findBy`, body, config);
        return resp.data;
    }
    static async edit_user(edited_data, user_id, token){
        let obj = {
            data: edited_data,
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.patch(`/users/${user_id}`, obj, config);
        return resp.data;
    }
    static async delete_user(user_id){
        const resp = await
            axiosInstance.delete(`/users/${user_id}`);
        return resp.data;
    }

    // CALENDAR
    static async allCalendars(token){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.get(`/calendar/all`, config);
        return resp.data;
    }
    static async calendarById(token, calendarId) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.get(`/calendar/${calendarId}`, config);
        return resp.data;
    }
    static async createCalendar(token) {
        //title, description, color
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        const resp = await axiosInstance.post('/calendar/create', {
            title: 'Новий календар'
        }, config);
        return resp.data;
    }
    static async editCalendar(token, editedFields){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        const resp = await axiosInstance.patch(`/calendar/update`, editedFields, config);
        return resp.data;
    }
    static async usersByCalendar(token, calendarId){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        const resp = await axiosInstance.get(`/calendar/users/${calendarId}`, config);
        return resp.data;
    }
    static async deleteCalendar(token, calendarId){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        const resp = await axiosInstance.delete(`/calendar/${calendarId}/delete`, config);
        return resp.data;
    }

    static async shareCalendar(token, data) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        const resp = await axiosInstance.post(`/calendar/invite`, data, config);
        return resp.data;
    }

    static async acceptInvitation(invitationToken) {
        const resp = await axiosInstance.post(`/calendar/accept-invitation/${invitationToken}`);
        return resp.data;
    }

    static async updateRole(token, data) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        const resp = await axiosInstance.patch('/calendar/update_role', data, config);
        return resp.data;
    }

    // EVENTS
    static async createEvent(token, data) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        const resp = await axiosInstance.post('/events/new_events', data, config);
        return resp.data;
    }

    static async editEvent(token, data) {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };
        const resp = await axiosInstance.patch('/events/edit', data, config);
        return resp.data;
    }

    static async deleteEvent(token, event_id) {
        const resp = await axiosInstance.delete(`/events/${event_id}/delete`);
        return resp.data;
    }

    UTILS
    static async getMyLocation(){
        const resp = await axiosInstance.get('http://ip-api.com/json');
        return resp.data;
    }

    static async getNationalHolidays(year, countryCode) {
        const resp = await axios.get(
            `https://date.nager.at/api/v2/publicholidays/${year}/${countryCode}`
        );
        return resp.data;
    }
}