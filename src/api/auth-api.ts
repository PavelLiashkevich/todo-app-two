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
		return instance.get<ResponseType<{ data: UserLoginType }>>('auth/me')
	},

	login(data: LoginParamsType) {
		return instance.post<ResponseType<{ data: LoginResponseType }>>(
			'auth/login',
			data
		)
	},

	logout() {
		return instance.delete<ResponseType>('auth/login')
	},
}

// ========================== TYPES ==========================

export type LoginParamsType = {
	email: string
	password: string
	rememberMe: boolean
	captcha?: boolean
}

type UserLoginType = {
	id: number
	email: string
	login: string
}

type LoginResponseType = {
	token: string
	userId: number
}
