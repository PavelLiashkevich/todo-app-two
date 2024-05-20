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

export type TasksType = {
	[key: string]: TaskType[]
}

export const App = () => {
	const todolists = useAppSelector<TodolistDomainType[]>(
		state => state.todolists
	)

	const status = useAppSelector(state => state.app.status)

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(getTodosTC())
	}, [])

	//* TODOLISTS

	// Добавление нового тудулиста
	const addTodolist = useCallback((title: string) => {
		dispatch(addTodolistTC(title))
	}, [])

	// Удаление тудулиста при нажатии на крестик
	const removeTodolist = useCallback((todolistId: string) => {
		dispatch(removeTodolistTC(todolistId))
	}, [])

	// Сохранение тудулиста после редактирование
	const changeTodolistTitle = useCallback(
		(todolistId: string, newValue: string) => {
			dispatch(changeTodolistTitleTC(todolistId, newValue))
		},
		[]
	)

	// Фильтрация тасок при нажатии на кнопки
	const changeFilter = useCallback(
		(todolistId: string, value: FilterValuesType) => {
			dispatch(changeFilterAC(todolistId, value))
		},
		[]
	)

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
				<Grid container>
					<AddItemForm addItem={addTodolist} />
				</Grid>
				<Grid container spacing={3}>
					{todolists.map((todolist, index) => {
						return (
							<Grid key={index} item>
								<Paper>
									<TodoList
										id={todolist.id}
										entityStatus={todolist.entityStatus}
										title={todolist.title}
										changeFilter={changeFilter}
										changeTodolistTitle={changeTodolistTitle}
										removeTodolist={removeTodolist}
										filter={todolist.filter}
									/>
								</Paper>
							</Grid>
						)
					})}
				</Grid>
			</Container>
		</div>
	)
}
