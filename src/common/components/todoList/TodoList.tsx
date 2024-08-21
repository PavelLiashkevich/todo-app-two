import styled from 'styled-components'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from 'app/store'

import { Delete } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'

import { TaskType } from 'api/task-api.types'
import { TasksList } from '../tasksList/TasksList'
import { FilterButtons } from '../buttons/FilterButtons'
import { AddItemForm } from '../addItemForm/AddItemForm'
import { EditableSpan } from '../editableSpan/EditableSpan'

import { RequestStatusType } from 'features/reducers/App'
import { addTask, getTasks } from 'features/reducers/Tasks'
import {
	changeTodolistsTitle,
	removeTodolists,
} from 'features/reducers/Todolists'

type Props = {
	id: string
	title: string
	filter: string
	entityStatus: RequestStatusType
}

export const TodoList = React.memo(
	({ id, title, filter, entityStatus }: Props) => {
		const tasks = useAppSelector<TaskType[]>(state => state.tasks[id])

		const dispatch = useAppDispatch()

		useEffect(() => {
			dispatch(getTasks(id))
		}, [])

		const [isCollapsed, setIsCollapsed] = useState(false)

		const changeCollapseStatusHandler = () => {
			setIsCollapsed(!isCollapsed)
		}

		const addTaskHandler = (title: string) => {
			dispatch(addTask({ todolistId: id, title }))
		}

		const removeTodolistHandler = () => {
			dispatch(removeTodolists(id))
		}

		const changeTodolistTitleHandler = (title: string) => {
			dispatch(changeTodolistsTitle({ todolistId: id, title }))
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
					<Button onClick={changeCollapseStatusHandler} variant='outlined'>
						{!isCollapsed ? 'Close' : 'Open'}
					</Button>
				</StyledBlock>

				{isCollapsed ? null : (
					<>
						<AddItemForm
							disable={entityStatus === 'loading'}
							addItem={addTaskHandler}
						/>

						{tasks.length === 0 ? (
							<StyledInfo>The tasks wasn't found</StyledInfo>
						) : (
							<TasksList tasks={tasks} filter={filter} />
						)}

						<FilterButtons id={id} filter={filter}/>
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
