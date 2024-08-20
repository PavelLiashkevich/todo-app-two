import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'app/store'

import { Grid, Paper } from '@mui/material'
import { AddItemForm } from '../addItemForm/AddItemForm'
import {
	FilterValuesType,
	TodolistDomainType,
	setTodolists,
	removeTodolists,
	addTodolists,
	todolistsActions,
	changeTodolistsTitle,
} from 'features/reducers/Todolists'
import { TodoList } from '../todoList/TodoList'
import { Navigate } from 'react-router-dom'
import { selectStatus } from 'features/reducers/App'
import { selectIsLoggedIn } from 'features/auth/model'

export const TodoLists = () => {
	const todolists = useAppSelector<TodolistDomainType[]>(
		state => state.todolists
	)

	const status = useAppSelector(selectStatus)

	const isLoggedIn = useAppSelector(selectIsLoggedIn)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!isLoggedIn) return
		dispatch(setTodolists())
	}, [])

	const addTodolist = useCallback((title: string) => {
		dispatch(addTodolists(title))
	}, [])

	const removeTodolist = useCallback((todolistId: string) => {
		dispatch(removeTodolists(todolistId))
	}, [])

	const changeTodolistTitle = useCallback(
		(todolistId: string, newValue: string) => {
			dispatch(changeTodolistsTitle({ todolistId, newValue }))
		},
		[]
	)

	const changeFilter = useCallback(
		(todolistId: string, filter: FilterValuesType) => {
			dispatch(todolistsActions.changeFilter({ todolistId, filter }))
		},
		[]
	)

	if (!isLoggedIn) {
		return <Navigate to='/login' />
	}

	return (
		<>
			<Grid container>
				<AddItemForm addItem={addTodolist} disable={status === 'loading'} />
			</Grid>
			<Grid container spacing={3} sx={{ justifyContent: 'center' }}>
				{todolists?.map((todolist, index) => {
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
