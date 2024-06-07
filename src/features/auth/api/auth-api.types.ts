export type LoginParamsType = {
	email: string
	password: string
	rememberMe: boolean
	captcha?: boolean
}

export type UserLoginType = {
	id: number
	email: string
	login: string
}

export type LoginResponseType = {
	token: string
	userId: number
}
