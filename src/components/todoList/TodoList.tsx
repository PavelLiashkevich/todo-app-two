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
import { useAppDispatch } from '../../store/store'
import { getTasksTC } from '../../reducers/Tasks/tasks-reducer'

type TodoListPropsType = {
	title: string
	id: string
	filter: string
	tasks: Array<TaskType>
	removeTask: (taskId: string, todolistId: string) => void
	changeFilter: (todolistId: string, value: FilterValuesType) => void
	addTask: (todolistId: string, title: string) => void
	changeTaskStatus: (
		todolistId: string,
		taskId: string,
		status: TaskStatus
	) => void
	changeTaskTitle: (
		todolistId: string,
		taskId: string,
		newValue: string,
	) => void
	changeTodolistTitle: (todolistId: string, newValue: string) => void
	removeTodolist: (todolistId: string) => void
}

export const TodoList = React.memo(
	({
		id,
		title,
		filter,
		tasks,
		removeTask,
		changeFilter,
		addTask,
		changeTaskStatus,
		changeTaskTitle,
		changeTodolistTitle,
		removeTodolist,
	}: TodoListPropsType) => {

		const dispatch = useAppDispatch()

		useEffect(() => {
			dispatch(getTasksTC(id))
		}, [])

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
					<IconButton onClick={removeTodolistHandler} color='secondary'>
						<Delete />
					</IconButton>
					<Button onClick={changeCollapseStatus} variant='outlined'>
						{!isCollapsed ? 'Close' : 'Open'}
					</Button>
				</StyledBlock>

				{isCollapsed ? null : (
					<>
						<AddItemForm addItem={addTaskNew} />

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
