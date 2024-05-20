import { Grid, Paper } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { AddItemForm } from '../addItemForm/AddItemForm';
import { FilterValuesType, TodolistDomainType, addTodolistTC, changeFilterAC, changeTodolistTitleTC, getTodosTC, removeTodolistTC } from '../../reducers/Todolists/todolists-reducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TodoList } from '../todoList/TodoList';

export const TodoLists = () => {
	const todolists = useAppSelector<TodolistDomainType[]>(
		state => state.todolists
	)

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
		<>
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
		</>
	);
};
