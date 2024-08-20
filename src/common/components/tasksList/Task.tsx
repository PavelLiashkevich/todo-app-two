import styled from 'styled-components'
import { useCallback } from 'react'
import { ChangeEvent, memo } from 'react'

import { Checkbox, IconButton } from '@mui/material'
import { DeleteOutlined } from '@mui/icons-material'

import { EditableSpan } from '../editableSpan/EditableSpan'
import { TaskType } from 'api/task-api.types'
import { TaskStatus } from '../../enums/enums'
import { useAppDispatch } from 'app/store'
import { tasksThunks } from 'features/reducers/Tasks'

type TaskPropsType = {
	task: TaskType
	todolistId: string
	changeTaskStatus: (
		todolistId: string,
		taskId: string,
		status: TaskStatus
	) => void
	changeTaskTitle: (
		todolistId: string,
		taskId: string,
		newValue: string
	) => void
}

export const Task = memo(
	({ task, todolistId, changeTaskStatus, changeTaskTitle }: TaskPropsType) => {
		const dispatch = useAppDispatch()

		const onClickHandler = () => {
			dispatch(
				tasksThunks.removeTask({ todolistId: todolistId, taskId: task.id })
			)
		}

		const onChangeTitleHandler = useCallback(
			(newValue: string) => {
				changeTaskTitle(todolistId, task.id, newValue)
			},
			[changeTaskTitle, task.id, todolistId]
		)

		const onChangeTaskStatusHandler = useCallback(
			(event: ChangeEvent<HTMLInputElement>) => {
				let newIsDoneValue = event.currentTarget.checked
				changeTaskStatus(
					todolistId,
					task.id,
					newIsDoneValue ? TaskStatus.Completed : TaskStatus.New
				)
			},
			[changeTaskStatus, todolistId, task.id]
		)

		return (
			<StyledTask key={task.id}>
				<Checkbox
					checked={task.status === TaskStatus.Completed}
					onChange={onChangeTaskStatusHandler}
					color='secondary'
				/>
				<EditableSpan
					oldTitle={task.title}
					isDone={!!task.status}
					onChange={onChangeTitleHandler}
				></EditableSpan>
				<IconButton onClick={onClickHandler} color='secondary'>
					<DeleteOutlined />
				</IconButton>
			</StyledTask>
		)
	}
)

const StyledTask = styled.li`
	display: flex;
	align-items: center;
`
