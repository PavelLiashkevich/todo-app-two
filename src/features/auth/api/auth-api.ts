import { instance } from 'common/instance/instance'
import { BaseResponse } from 'common/types/BaseResponse'
import {
	LoginParamsType,
	LoginResponseType,
	UserLoginType,
} from './auth-api.types'

export const authApi = {
	login(data: LoginParamsType) {
		return instance.post<BaseResponse<{ data: LoginResponseType }>>(
			'auth/login',
			data
		)
	},

	logout() {
		return instance.delete<BaseResponse>('auth/login')
	},

	me() {
		return instance.get<BaseResponse<{ data: UserLoginType }>>('auth/me')
	},
}
