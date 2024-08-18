import { instance } from 'common/instance/instance'
import { BaseResponse } from '../../../common/type/BaseResponse'
import {
	LoginParamsType,
	LoginResponseType,
	UserLoginType,
} from './auth-api.types'

// ========================== API ==========================

export const authApi = {
	me() {
		return instance.get<BaseResponse<{ data: UserLoginType }>>('auth/me')
	},

	login(data: LoginParamsType) {
		return instance.post<BaseResponse<{ data: LoginResponseType }>>(
			'auth/login',
			data
		)
	},

	logout() {
		return instance.delete<BaseResponse>('auth/login')
	},
}
