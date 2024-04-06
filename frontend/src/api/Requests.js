import axios from "axios";
import {logout} from "../Utils/Utils";

const ip = new URL(window.location.origin).hostname;
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
        if (error.response.status === 401) {
            await logout();
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
        return {state: true, message: 'success'};
    }

    // USER
    static async user_by_id(user_id){
        const resp = await
            axiosInstance.get(`/users/${user_id}`);
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
        return await
            axiosInstance.patch(`/users/avatar`, data, config);
    }
    static get_avatar_link(user_id){
        return `${domain}/users/${user_id}/avatar`;
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
    static async allCompanies(page = 1, limit = 20, order = 'ASC', searchValue = '') {
        const resp = await axiosInstance.get(
            `/companies`,
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

}