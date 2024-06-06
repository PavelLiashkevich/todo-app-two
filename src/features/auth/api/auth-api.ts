import { instance } from 'common/instance/instance'
import { ResponseType } from '../../../common/type/ResponseType'

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
