import React, { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'app/store'

import styled from 'styled-components'
import { Delete } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'

import { TaskType } from 'api/task-api.types'
import { TaskStatus } from '../../enums/enums'
import { TasksList } from '../tasksList/TasksList'
import { FilterButtons } from '../buttons/FilterButtons'
import { AddItemForm } from '../addItemForm/AddItemForm'
import { EditableSpan } from '../editableSpan/EditableSpan'

import { RequestStatusType } from 'features/reducers/App'
import { tasksThunks } from 'features/reducers/Tasks'
import { FilterValuesType } from 'features/reducers/Todolists'

type Props = {
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
	}: Props) => {
		const tasks = useAppSelector<TaskType[]>(state => state.tasks[id])

		const dispatch = useAppDispatch()

		useEffect(() => {
			dispatch(tasksThunks.getTasks(id))
		}, [])

		const addTask = useCallback((todolistId: string, title: string) => {
			dispatch(tasksThunks.addTask({ todolistId, title }))
		}, [])

		const changeTaskStatus = useCallback(
			(todolistId: string, taskId: string, status: TaskStatus) => {
				dispatch(
					tasksThunks.updateTask({ todolistId, taskId, model: { status } })
				)
			},
			[]
		)

		const changeTaskTitle = useCallback(
			(todolistId: string, taskId: string, newValue: string) => {
				dispatch(
					tasksThunks.updateTask({
						todolistId,
						taskId,
						model: { title: newValue },
					})
				)
			},
			[]
		)

		const [isCollapsed, setIsCollapsed] = useState(false)

		const changeCollapseStatus = () => {
			setIsCollapsed(!isCollapsed)
		}

		const removeTodolistHandler = () => {
			removeTodolist(id)
		}

		const addTaskNew = useCallback(
			(title: string) => {
				addTask(id, title)
			},
			[id, addTask]
		)

		const onChangeTodolistTitleHandler = useCallback(
			(newValue: string) => {
				changeTodolistTitle(id, newValue)
			},
			[id, changeTodolistTitle]
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
