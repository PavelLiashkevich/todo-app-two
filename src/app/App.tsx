import './App.css'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/store'

import AutohideSnackbar from 'common/components/snackbar/Snackbar'
import {
	AppBar,
	Button,
	CircularProgress,
	Container,
	IconButton,
	LinearProgress,
	Toolbar,
	Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import { TaskType } from 'api/task-api'
import { LogOutTC, authSelector, meTC } from 'features/auth/model/auth-reducer'
import { selectIsInitialized, selectStatus } from 'features/reducers/App/app-reducer'

export type TasksType = {
	[key: string]: TaskType[]
}

export const App = () => {
	const status = useAppSelector(selectStatus)

	const isLoggedIn = useAppSelector(authSelector.selectIsLoggedIn)

	const isInitialized = useAppSelector(selectIsInitialized)

	const dispatch = useAppDispatch()

	const logOut = () => {
		dispatch(LogOutTC())
	}

	useEffect(() => {
		dispatch(meTC())
	}, [])

	if (!isInitialized) {
		return (
			<div
				style={{
					position: 'fixed',
					top: '30%',
					textAlign: 'center',
					width: '100%',
				}}
			>
				<CircularProgress />
			</div>
		)
	}

	return (
		<div className='App'>
			<AutohideSnackbar />
			<AppBar position='static'>
				<Toolbar variant='dense'>
					<IconButton
						edge='start'
						color='inherit'
						aria-label='menu'
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant='h6' color='inherit' component='div'>
						TodoList
					</Typography>
					{isLoggedIn && (
						<Button onClick={logOut} color='inherit'>
							Log Out
						</Button>
					)}
				</Toolbar>
				{status === 'loading' && <LinearProgress color='secondary' />}
			</AppBar>
			<Container fixed>
				<Outlet />
			</Container>
		</div>
	)
}
