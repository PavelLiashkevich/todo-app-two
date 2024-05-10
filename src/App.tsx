import './App.css'

import { TodoList } from './components/todoList'
import { TaskStatus, TaskType } from './api/task-api'
import { AddItemForm } from './components/addItemForm/AddItemForm'
import {
	AppBar,
	Container,
	Grid,
	IconButton,
	Paper,
	Toolbar,
	Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import {
	FilterValuesType,
	TodolistDomainType,
	addTodolistAC,
	changeFilterAC,
	changeTodolistTitleAC,
	getTodos,
	removeTodolistAC,
} from './reducers/Todolists/todolists-reducer'
import {
	addTaskAC,
	changeTaskStatusAC,
	changeTaskTitleAC,
	removeTaskAC,
} from './reducers/Tasks/tasks-reducer'
import { useAppDispatch, useAppSelector } from './store/store'
import { useCallback, useEffect } from 'react'

export type TasksType = {
	[key: string]: TaskType[]
}

export const App = () => {
	const todolists = useAppSelector<TodolistDomainType[]>(
		state => state.todolists
	)

	const tasks = useAppSelector<TasksType>(state => state.tasks)

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(getTodos)
	}, [])

	//* TODOLISTS

	// Добавление нового тудулиста
	const addTodolist = useCallback((title: string) => {
		dispatch(addTodolistAC(title))
	}, [])

	// Удаление тудулиста при нажатии на крестик
	const removeTodolist = useCallback((todolistId: string) => {
		dispatch(removeTodolistAC(todolistId))
	}, [])

	// Сохранение тудулиста после редактирование
	const changeTodolistTitle = useCallback(
		(todolistId: string, newValue: string) => {
			dispatch(changeTodolistTitleAC(todolistId, newValue))
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

	//* TASKS

	// Добавление новой таски
	const addTask = useCallback((title: string, todolistId: string) => {
		dispatch(addTaskAC(title, todolistId))
	}, [])

	// Удаление таски при нажатии на крестик
	const removeTask = useCallback((taskId: string, todolistId: string) => {
		dispatch(removeTaskAC(taskId, todolistId))
	}, [])

	// Изменение чекбокса
	const changeTaskStatus = useCallback(
		(todolistId: string, taskId: string, status: TaskStatus) => {
			dispatch(changeTaskStatusAC(todolistId, taskId, status))
		},
		[]
	)

	// Редактирование и перезапись таски
	const changeTaskTitle = useCallback(
		(taskId: string, newValue: string, todolistId: string) => {
			dispatch(changeTaskTitleAC(taskId, newValue, todolistId))
		},
		[]
	)

	return (
		<div className='App'>
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
										key={todolist.id}
										id={todolist.id}
										title={todolist.title}
										tasks={tasks[todolist.id]}
										removeTask={removeTask}
										changeFilter={changeFilter}
										addTask={addTask}
										changeTaskStatus={changeTaskStatus}
										changeTaskTitle={changeTaskTitle}
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
