import { Grid, Paper } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { AddItemForm } from '../addItemForm/AddItemForm'
import {
	FilterValuesType,
	TodolistDomainType,
	addTodolistTC,
	changeFilterAC,
	changeTodolistTitleTC,
	getTodosTC,
	removeTodolistTC,
} from '../../reducers/Todolists/todolists-reducer'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { TodoList } from '../todoList/TodoList'
import { Navigate } from 'react-router-dom'

export const TodoLists = () => {
	const todolists = useAppSelector<TodolistDomainType[]>(
		state => state.todolists
	)

	const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!isLoggedIn) return
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

	if (!isLoggedIn) {
		return <Navigate to='/login' />
	}

	return (
		<>
			<Grid container>
				<AddItemForm addItem={addTodolist} />
			</Grid>
			<Grid container spacing={3} sx={{ justifyContent: 'center' }}>
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
		</>
	)
}
