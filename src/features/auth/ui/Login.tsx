import styled from 'styled-components'
import { Navigate } from 'react-router-dom'
import { useLogin } from '../lib/useLogin'
import { useAppSelector } from 'app/store'

import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export const Login = () => {
	const formik = useLogin()

	const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

	if (isLoggedIn) {
		return <Navigate to={'/todolists'} />
	}

	return (
		<Grid container justifyContent={'center'} sx={{ mt: 19 }}>
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
								<StyledErrorMessage>{formik.errors.email}</StyledErrorMessage>
							) : null}
							<TextField
								type='password'
								label='Password'
								margin='normal'
								error={!!(formik.touched.password && formik.errors.password)}
								{...formik.getFieldProps('password')}
							/>
							{formik.touched.password && formik.errors.password ? (
								<StyledErrorMessage>
									{formik.errors.password}
								</StyledErrorMessage>
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

const StyledErrorMessage = styled.span`
	color: red;
	font-size: 1rem;
`
