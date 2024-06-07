import { instance } from 'common/instance/instance'
import { ResponseType } from '../../../common/type/ResponseType'
import { LoginParamsType, LoginResponseType, UserLoginType  } from './auth-api.types'

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
