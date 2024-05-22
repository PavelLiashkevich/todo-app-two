import axios from 'axios'
import { ResponseType } from '../api/task-api'

const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,

	headers: {
		'API-KEY': 'fb09a13d-7cac-451e-afc1-b441cb18c671',
	},
})

// ========================== API ==========================

export const authApi = {
	me() {
		return instance.get<LoginParamsType>('auth/me')
	},

	login(data: LoginParamsType) {
		return instance.post<ResponseType<{ data: ResponseLoginType }>>(
			'auth/login',
			data
		)
	},

	logout() {},
}

// ========================== TYPES ==========================

export type LoginParamsType = {
	email: string
	password: string
	rememberMe: boolean
	captcha?: boolean
}

type ResponseLoginType = {
	token: string
	userId: number
}
