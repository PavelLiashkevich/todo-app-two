import styled from 'styled-components'
import { ChangeEvent, memo } from 'react'

import { Checkbox, IconButton } from '@mui/material'
import { DeleteOutlined } from '@mui/icons-material'

import { EditableSpan } from '../editableSpan/EditableSpan'
import { TaskType } from 'api/task-api.types'
import { TaskStatus } from '../../enums/enums'
import { useAppDispatch } from 'app/store'
import { removeTask, updateTask } from 'features/reducers/Tasks'

type Props = {
	task: TaskType
}

export const Task = memo(({ task }: Props) => {
	const { title, id: taskId, todoListId: todolistId, status } = task

	const dispatch = useAppDispatch()

	const removeTaskHandler = () => {
		dispatch(removeTask({ todolistId, taskId }))
	}

	const changeTaskTitleHandler = (title: string) => {
		dispatch(
			updateTask({
				todolistId,
				taskId,
				model: { title },
			})
		)
	}

	const changeTaskStatusHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const status = event.target.checked ? TaskStatus.Completed : TaskStatus.New
		dispatch(
			updateTask({
				todolistId,
				taskId,
				model: { status },
			})
		)
	}

	return (
		<StyledTask key={taskId}>
			<Checkbox
				checked={status === TaskStatus.Completed}
				onChange={changeTaskStatusHandler}
				color='secondary'
			/>
			<EditableSpan
				oldTitle={title}
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
