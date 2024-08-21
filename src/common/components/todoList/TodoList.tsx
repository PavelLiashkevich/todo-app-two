import styled from 'styled-components'
import React, { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'app/store'

import { Delete } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'

import { TaskType } from 'api/task-api.types'
import { TasksList } from '../tasksList/TasksList'
import { FilterButtons } from '../buttons/FilterButtons'
import { AddItemForm } from '../addItemForm/AddItemForm'
import { EditableSpan } from '../editableSpan/EditableSpan'

import { RequestStatusType } from 'features/reducers/App'
import { tasksThunks } from 'features/reducers/Tasks'
import {
	changeTodolistsTitle,
	FilterValuesType,
} from 'features/reducers/Todolists'

type Props = {
	title: string
	id: string
	filter: string
	changeFilter: (todolistId: string, value: FilterValuesType) => void
	removeTodolist: (todolistId: string) => void
	entityStatus: RequestStatusType
}

export const TodoList = React.memo(
	({
		id,
		title,
		filter,
		changeFilter,
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

		const changeTodolistTitleHandler = (newValue: string) => {
			dispatch(changeTodolistsTitle({ todolistId: id, newValue }))
		}

		return (
			<StyledTodoList>
				<StyledBlock>
					<EditableSpan
						oldTitle={title}
						onChange={changeTodolistTitleHandler}
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
							<TasksList tasks={tasks} filter={filter} todolistId={id} />
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
