export type BaseResponse<T = {}> = {
	resultCode: number
	messages: string[]
	fieldsErrors: FieldErrorType[]
	data: T
}

export type FieldErrorType = {
	error: string
	field: string
}