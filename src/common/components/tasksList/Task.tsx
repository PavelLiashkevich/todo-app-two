import styled from 'styled-components'
import { ChangeEvent, memo } from 'react'

import { Checkbox, IconButton } from '@mui/material'
import { DeleteOutlined } from '@mui/icons-material'

import { EditableSpan } from '../editableSpan/EditableSpan'
import { TaskType } from 'api/task-api.types'
import { TaskStatus } from '../../enums/enums'
import { useAppDispatch } from 'app/store'
import { tasksThunks } from 'features/reducers/Tasks'

type Props = {
	task: TaskType
	todolistId: string
}

export const Task = memo(({ task, todolistId }: Props) => {
	const dispatch = useAppDispatch()

	const removeTaskHandler = () => {
		dispatch(
			tasksThunks.removeTask({ todolistId: todolistId, taskId: task.id })
		)
	}

	const changeTaskTitleHandler = (newValue: string) => {
		dispatch(
			tasksThunks.updateTask({
				todolistId,
				taskId: task.id,
				model: { title: newValue },
			})
		)
	}

	const changeTaskStatusHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const status = event.target.checked
			? TaskStatus.Completed
			: TaskStatus.InProgress
		dispatch(
			tasksThunks.updateTask({
				todolistId,
				taskId: task.id,
				model: { status },
			})
		)
	}

	return (
		<StyledTask key={task.id}>
			<Checkbox
				checked={task.status === TaskStatus.Completed}
				onChange={changeTaskStatusHandler}
				color='secondary'
			/>
			<EditableSpan
				oldTitle={task.title}
				isDone={!!task.status}
				onChange={changeTaskTitleHandler}
			></EditableSpan>
			<IconButton onClick={removeTaskHandler} color='secondary'>
				<DeleteOutlined />
			</IconButton>
		</StyledTask>
	)
})

const StyledTask = styled.li`
	display: flex;
	align-items: center;
`
