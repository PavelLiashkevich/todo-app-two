import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useCallback, useState } from 'react'

import { FilterValuesType } from '../../reducers/Todolists/todolists-reducer'
import { TaskStatus, TaskType } from '../../api/task-api'
import { TasksList } from '../tasksList/TasksList'
import { FilterButtons } from '../buttons/FilterButtons'
import { AddItemForm } from '../addItemForm/AddItemForm'
import { EditableSpan } from '../editableSpan/EditableSpan'
import { Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../store/store'
import {
	addTaskTC,
	deleteTaskTC,
	getTasksTC,
	updateTaskTC,
} from '../../reducers/Tasks/tasks-reducer'
import { RequestStatusType } from '../../reducers/App/app-reducer'

type TodoListPropsType = {
	title: string
	id: string
	filter: string
	changeFilter: (todolistId: string, value: FilterValuesType) => void
	changeTodolistTitle: (todolistId: string, newValue: string) => void
	removeTodolist: (todolistId: string) => void
	entityStatus: RequestStatusType
}

export const TodoList = React.memo(
	({
		id,
		title,
		filter,
		changeFilter,
		changeTodolistTitle,
		removeTodolist,
		entityStatus,
	}: TodoListPropsType) => {
		const tasks = useAppSelector<TaskType[]>(state => state.tasks[id])

		const dispatch = useAppDispatch()

		useEffect(() => {
			dispatch(getTasksTC(id))
		}, [])

		//* TASKS

		// Добавление новой таски
		const addTask = useCallback((todolistId: string, title: string) => {
			dispatch(addTaskTC(todolistId, title))
		}, [])

		// Удаление таски при нажатии на крестик
		const removeTask = useCallback((taskId: string, todolistId: string) => {
			dispatch(deleteTaskTC(todolistId, taskId))
		}, [])

		// Изменение чекбокса
		const changeTaskStatus = useCallback(
			(todolistId: string, taskId: string, status: TaskStatus) => {
				dispatch(updateTaskTC(todolistId, taskId, { status }))
			},
			[]
		)

		// Редактирование и перезапись таски
		const changeTaskTitle = useCallback(
			(todolistId: string, taskId: string, newValue: string) => {
				dispatch(updateTaskTC(todolistId, taskId, { title: newValue }))
			},
			[]
		)

		// Состояние для открытия/закрытия тасок внутри тудулиста
		const [isCollapsed, setIsCollapsed] = useState(false)

		const changeCollapseStatus = () => {
			setIsCollapsed(!isCollapsed)
		}

		const removeTodolistHandler = () => {
			removeTodolist(id)
		}

		// Посредник для редактирования таски
		const addTaskNew = useCallback(
			(title: string) => {
				addTask(id, title)
			},
			[addTask, id]
		)

		const onChangeTodolistTitleHandler = useCallback(
			(newValue: string) => {
				changeTodolistTitle(id, newValue)
			},
			[changeTodolistTitle, id]
		)

		return (
			<StyledTodoList>
				<StyledBlock>
					<EditableSpan
						oldTitle={title}
						onChange={onChangeTodolistTitleHandler}
					/>
					<IconButton
						onClick={removeTodolistHandler}
						color='secondary'
						disabled={entityStatus === 'loading'}
					>
						<Delete />
					</IconButton>
					<Button onClick={changeCollapseStatus} variant='outlined'>
						{!isCollapsed ? 'Close' : 'Open'}
					</Button>
				</StyledBlock>

				{isCollapsed ? null : (
					<>
						<AddItemForm
							disable={entityStatus === 'loading'}
							addItem={addTaskNew}
						/>

						{tasks.length === 0 ? (
							<StyledInfo>The tasks wasn't found</StyledInfo>
						) : (
							<TasksList
								tasks={tasks}
								filter={filter}
								removeTask={removeTask}
								changeTaskStatus={changeTaskStatus}
								changeTaskTitle={changeTaskTitle}
								todolistId={id}
							/>
						)}

						<FilterButtons changeFilter={changeFilter} id={id} />
					</>
				)}
			</StyledTodoList>
		)
	}
)
const StyledTodoList = styled.div`
	padding: 30px;
	margin: 10px;
`

const StyledBlock = styled.div`
	display: flex;
	align-items: center;
`

const StyledInfo = styled.p`
	margin-bottom: 50px;
	margin-top: 60px;
`
