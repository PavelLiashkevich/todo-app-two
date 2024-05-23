import './App.css'
import { Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/store'
import { TaskType } from './api/task-api'
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
import AutohideSnackbar from './components/snackbar/Snackbar'
import { useEffect } from 'react'
import { LogOutTC, meTC } from './reducers/Auth/auth-reducer'
import { RequestStatusType } from './reducers/App/app-reducer'

export type TasksType = {
	[key: string]: TaskType[]
}

export const App = () => {
	const status = useAppSelector<RequestStatusType>(state => state.app.status)

	const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

	const isInitialized = useAppSelector<boolean>(
		state => state.app.isInitialized
	)

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
