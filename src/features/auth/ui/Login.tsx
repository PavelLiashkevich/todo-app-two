import React from 'react'
import { useAppDispatch, useAppSelector } from 'app/store'
import { Navigate } from 'react-router-dom'
import { FormikHelpers, useFormik } from 'formik'
import { loginTC } from 'features/auth/model/auth-reducer'

import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { error } from 'console'

type ErrorType = {
	email?: string
	password?: string
}

type FormValuesType = {
	email: string
	password: string
	rememberMe: boolean
}

export const Login = () => {
	const dispatch = useAppDispatch()

	const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

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
			} else if (values.password.length < 6) {
				errors.password = 'Password must be at least 6 characters'
			} else if (values.password.length > 32) {
				errors.password = 'Password must not be more than 32 characters'
			}

			return errors
		},

		onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
			const res = await dispatch(loginTC(values))

			if (loginTC.rejected.match(res)) {
				if (res.payload?.fieldsErrors?.length) {
					const error = res.payload.fieldsErrors[0]
					formikHelpers.setFieldError(error.field, error.error)
				}
			}
			formik.resetForm()
		},
	})

	if (isLoggedIn) {
		return <Navigate to={'/todolists'} />
	}

	return (
		<Grid container justifyContent={'center'} sx={{ mt: 25 }}>
			<Grid item justifyContent={'center'}>
				<FormControl>
					<FormLabel>
						<p>
							To log in get registered&nbsp;
							<a
								href={'https://social-network.samuraijs.com/'}
								target={'_blank'}
								rel='noreferrer'
							>
								here
							</a>
						</p>
						<p>or use common test account credentials:</p>
						<p>Email: free@samuraijs.com</p>
						<p>Password: free</p>
					</FormLabel>
					<form onSubmit={formik.handleSubmit}>
						<FormGroup>
							<TextField
								label='Email'
								margin='normal'
								error={!!(formik.touched.email && formik.errors.email)}
								{...formik.getFieldProps('email')}
							/>
							{formik.touched.email && formik.errors.email ? (
								<div style={{ color: 'red' }}>{formik.errors.email}</div>
							) : null}
							<TextField
								type='password'
								label='Password'
								margin='normal'
								error={!!(formik.touched.password && formik.errors.password)}
								{...formik.getFieldProps('password')}
							/>
							{formik.touched.password && formik.errors.password ? (
								<div style={{ color: 'red' }}>{formik.errors.password}</div>
							) : null}
							<FormControlLabel
								label={'Remember me'}
								control={
									<Checkbox
										checked={formik.values.rememberMe}
										{...formik.getFieldProps('rememberMe')}
									/>
								}
							/>
							<Button type={'submit'} variant={'contained'} color={'primary'}>
								Login
							</Button>
						</FormGroup>
					</form>
				</FormControl>
			</Grid>
		</Grid>
	)
}
