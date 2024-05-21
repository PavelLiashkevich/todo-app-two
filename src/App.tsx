import './App.css'
import { Outlet } from 'react-router-dom'
import { useAppSelector } from './store/store'
import { TaskType } from './api/task-api'
import {
	AppBar,
	Container,
	IconButton,
	LinearProgress,
	Toolbar,
	Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AutohideSnackbar from './components/snackbar/Snackbar'

export type TasksType = {
	[key: string]: TaskType[]
}

export const App = () => {
	const status = useAppSelector(state => state.app.status)

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
				</Toolbar>
				{/*{status === 'loading' && <LinearProgress color='secondary' />}*/}
			</AppBar>
			<Container fixed>
				<Outlet />
			</Container>
		</div>
	)
}
