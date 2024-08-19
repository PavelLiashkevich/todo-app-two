import { useAppDispatch } from 'app/store'
import { BaseResponse } from 'common/type/BaseResponse'
import { FormikHelpers, useFormik } from 'formik'
import { login } from '../model/auth-reducer'

type ErrorType = {
	email?: string
	password?: string
}

type FormValuesType = {
	email: string
	password: string
	rememberMe: boolean
}

export const useLogin = () => {
	const dispatch = useAppDispatch()

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			rememberMe: false,
		},

		validate: values => {
			const errors: ErrorType = {}
			const isNotValid = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
				values.email
			)

			if (!values.email) {
				errors.email = 'Email is required'
			} else if (isNotValid) {
				errors.email = 'Invalid email address'
			}

			if (!values.password) {
				errors.password = 'Password is required'
			} else if (values.password.length < 4) {
				errors.password = 'Password must be at least 4 characters'
			} else if (values.password.length > 32) {
				errors.password = 'Password must not be more than 32 characters'
			}

			return errors
		},

		onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
			const res = await dispatch(login(values))
				.unwrap()
				.then(() => {})
				.catch((res: BaseResponse) => {
					if (res.fieldsErrors) {
						res.fieldsErrors.forEach(elem => {
							formikHelpers.setFieldError(elem.field, elem.error)
						})
					}
				})

			formik.resetForm()
		},
	})

	return formik
}
