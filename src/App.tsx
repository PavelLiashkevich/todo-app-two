import './App.css'

import { TodoList } from './components/todoList'
import { TaskStatus, TaskType } from './api/task-api'
import { AddItemForm } from './components/addItemForm/AddItemForm'
import {
	AppBar,
	Container,
	Grid,
	IconButton,
	LinearProgress,
	Paper,
	Toolbar,
	Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import {
	FilterValuesType,
	TodolistDomainType,
	addTodolistTC,
	changeFilterAC,
	changeTodolistTitleTC,
	getTodosTC,
	removeTodolistTC,
} from './reducers/Todolists/todolists-reducer'
import {
	addTaskTC,
	deleteTaskTC,
	updateTaskTC,
} from './reducers/Tasks/tasks-reducer'
import { useAppDispatch, useAppSelector } from './store/store'
import { useCallback, useEffect } from 'react'
import AutohideSnackbar from './components/snackbar/Snackbar'
import { Outlet } from 'react-router-dom'

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
				{status === 'loading' && <LinearProgress color='secondary' />}
			</AppBar>
			<Container fixed>
				<Outlet />
			</Container>
		</div>
	)
}
