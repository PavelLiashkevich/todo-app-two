import axios from "axios";

export const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,

	headers: {
		'API-KEY': 'fb09a13d-7cac-451e-afc1-b441cb18c671',
	},
})
