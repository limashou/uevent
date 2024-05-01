import axios from "axios";
import {logout} from "../Utils/Utils";

const ip = new URL(window.location.origin).hostname;
// const ip = '192.168.1.2';
const domain = `http://${ip}:3001/api`;

const axiosInstance = axios.create({
    baseURL: domain,
    headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
    },
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        console.log(error);
        if (error.response?.status === 401) {
            await logout();
        }
        if (error.response?.data?.message) {
            return Promise.resolve(error.response); // Возвращаем обычный ответ, если есть данные JSON
        }
        return Promise.reject(error);
    }
);

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
    static async logout(){
        const resp = await
            axiosInstance.post(`/auth/logout`);
        return resp.data;
    }

    // USER
    static async user_by_id(user_id){
        const resp = await
            axiosInstance.get(`/users/${user_id}`);
        return resp.data;
    }

    static async userCompanies(user_id){
        const resp = await axiosInstance.get(`users/${user_id}/companies`);
        return resp.data;
    }
    static async notifications(notification_id) {
        const queryParams = notification_id ? `?from_id=${notification_id}` : '';
        const resp = await axiosInstance.get(`users/notifications${queryParams}`);
        return resp.data;
    }

    static async avatarUpload(file){
        const data = new FormData();
        data.append('photo', file);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };
        const resp = await axiosInstance.patch(`/users/avatar`, data, config);
        return resp.data;
    }
    static get_avatar_link(user_id){
        return `${domain}/users/${user_id}/avatar`;
    }
    static async findUsername(body = {
        username_part: '', user_ids_to_exclude: []
    }) {
        const resp = await axiosInstance.post(`/users/findBy`, body);
        return resp.data;
    }
    static async edit_user(edited_data){
        const resp = await
            axiosInstance.patch(`/users/update`, edited_data);
        return resp.data;
    }
    static async delete_user(user_id){
        const resp = await
            axiosInstance.delete(`/users/${user_id}`);
        return resp.data;
    }

    // COMPANIES
    static get_company_logo_link(company_id){
        return `${domain}/companies/${company_id}/logo`;
    }
    static async createCompany(data){
        //{ name, email, location, description }
        const resp = await
            axiosInstance.post('/companies/create', data);
        return resp.data;
    }
    static async editCompany(company_id, editedFields) {
        const resp = await
            axiosInstance.patch(`/companies/${company_id}/edit`, editedFields);
        return resp.data;
    }
    static async allCompanies({page = 1,
                              limit = 20,
                              order = 'ASC',
                              searchValue = '',
                              founder_id = ''}) {
        const config = {
            params: {
                page: page,
                limit: limit,
                order: order,
                search: searchValue,
                founder_id: founder_id
            }
        };
        const resp = await axiosInstance.get(
            `/companies`, config
        );
        return resp.data;
    }
    static async companyEvents(company_id,
                               page = 1,
                               limit = 20,
                               order = 'ASC',
                               searchValue = ''){
        const resp = await axiosInstance.get(
            `/companies/${company_id}/events`,
            {
                params: {
                    page: page,
                    limit: limit,
                    order: order,
                    search: searchValue
                }
            }
        );
        return resp.data;
    }
    static async companyById(company_id){
        const resp = await axiosInstance.get(`/companies/${company_id}`);
        return resp.data;
    }
    static async companyMembers(company_id){
        const resp = await axiosInstance.get(`/companies/${company_id}/members`);
        return resp.data;
    }
    static async memberInvite(company_id, user_id) {
        const resp = await axiosInstance.post(
            `/companies/${company_id}/members/invite`, { user_id }
        );
        return resp.data;
    }
    static async acceptMemberInvite(invitationCode){
        const resp = await axiosInstance.post(
            `/companies/members/accept-invitation/${invitationCode}`
        );
        return resp.data;
    }
    static async changeMemberRole(company_id, member_id, role){
        const resp = await
            axiosInstance.patch(`companies/${company_id}/members/${member_id}/role`, {role});
        return resp.data;
    }
    static async ejectMember(company_id, member_id){
        const resp = await
            axiosInstance.delete(`companies/${company_id}/members/${member_id}/delete`);
        return resp.data;
    }
    static async companyLogoUpload(company_id, file){
        const data = new FormData();
        data.append('photo', file);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };
        const resp = await
            axiosInstance.patch(`/companies/${company_id}/logo`, data, config);
        return resp.data;
    }
    static async companyNotifications(company_id) {
        const resp = await axiosInstance.get(`companies/${company_id}/notifications`);
        return resp.data;
    }
    static async companySubscribe(company_id, update_events = true, new_news = true, new_events = true){
        const resp = await axiosInstance
            .post(`companies/${company_id}/subscribe`, {update_events, new_news, new_events});
        return resp.data;
    }

    //EVENTS
    static get_event_poster_link(event_id){
        return `${domain}/events/${event_id}/poster`;
    }
    static async eventCreation(company_id, eventData){
        const resp = await axiosInstance.post(`/companies/${company_id}/create`, eventData);
        return resp.data;
    }
    static async eventById(event_id) {
        const resp = await axiosInstance.get(`/events/${event_id}`);
        return resp.data;
    }
    static async posterUpload(event_id, file) {
        const data = new FormData();
        data.append('photo', file);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };
        const resp = await axiosInstance.patch(`/events/${event_id}/upload`, data, config);
        return resp.data;
    }
    static async allEvents({page = 1, limit = 20, order = 'ASC',
                               searchValue = '', company_id = '',
                               dateFrom = '', dateTo = '',
                               formats = [], themes = []}){
        const config = {
            params: {
                page: page,
                limit: limit,
                order: order,
                search: searchValue,
                company_id: company_id,
                dateFrom: dateFrom,
                dateTo: dateTo,
                formats: formats,
                themes: themes
            }
        };
        const resp = await axiosInstance.get(
            `/events`, config
        );
        return resp.data;
    }

    static async eventComments(event_id, page = 1, limit = 10) {
        const config = {
            params: {
                page: page,
                limit: limit,
            }
        };
        const resp = await axiosInstance.get(
            `/events/${event_id}/comments`, config
        );
        return resp.data;
    }
    static async createComment(event_id, text){
        const resp = await axiosInstance
            .post(`/events/${event_id}/comments/create`, {text});
        return resp.data;
    }
    static async eventUsers(event_id){
        const resp = await axiosInstance.get(`/events/${event_id}/visitors`);
        return resp.data;
    }
    static async createTicket(event_id, ticket_type, price = 0, available_tickets){
        const resp = await axiosInstance
            .post(`/events/${event_id}/create`, {ticket_type, price, available_tickets});
        return resp.data;
    }
    static async eventTickets(event_id){
        const resp = await axiosInstance.get(`/events/${event_id}/tickets`);
        return resp.data;
    }

    // NEWS
    static async announcementCreation(company_id, title, content){
        const resp = await axiosInstance.post(`companies/${company_id}/news/create`, {
            title: title,
            content: content,
        });
        return resp.data;
    }
    static async newsPosterUpload(news_id, file) {
        const data = new FormData();
        data.append('photo', file);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };
        const resp = await axiosInstance.patch(`/news/${news_id}/posterUpload`, data, config);
        return resp.data;
    }
    static async companyNews(company_id, data = { page: 1, limit: 3, order: 'ASC' }){
        const config = {
            params: {
                page: data.page,
                limit: data.limit,
                order: data.order,
            }
        };
        const resp = await axiosInstance.get(
            `/companies/${company_id}/news`, config
        );
        return resp.data;
    }
    static get_news_poster_link(news_id){
        return `${domain}/news/${news_id}/poster`;
    }

    //TICKETS
    static async reserveTicket(ticket_id, successUrl = window.location.href, cancelUrl = window.location.href){
        const resp = await axiosInstance
            .post(`/tickets/${ticket_id}/reserve`,{successUrl, cancelUrl});
        return resp.data;
    }
    static async buyTicket(ticket_id, show_username = false){
        const resp = await axiosInstance
            .post(`/tickets/${ticket_id}/buy`, {show_username});
        return resp.data;
    }
    static async informationTicket(user_ticket_id){
        const resp = await axiosInstance
            .get(`/tickets/information/${user_ticket_id}`);
        return resp.data;
    }

    //COMMENTS
    static async deleteComment(comment_id){
        const resp = await axiosInstance
            .delete(`comments/${comment_id}/delete`);
        return resp.data;
    }
    static async editComment(comment_id, text){
        const resp = await axiosInstance
            .patch(`comments/${comment_id}/edit`, {text});
        return resp.data;
    }
}