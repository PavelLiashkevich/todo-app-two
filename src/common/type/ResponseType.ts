export type ResponseType<T = {}> = {
	resultCode: number
	messages: string[]
	fieldsErrors: FieldErrorType[]
	data: T
}

type FieldErrorType = {
	error: string
	field: string
}