import React, { ChangeEvent, memo } from 'react'
import { useCallback } from 'react'
import styled from 'styled-components'

import { EditableSpan } from '../editableSpan/EditableSpan'
import { Checkbox, IconButton } from '@mui/material'
import { DeleteOutlined } from '@mui/icons-material'
import { TaskStatus, TaskType } from '../../api/task-api'

type TaskPropsType = {
	task: TaskType
	todolistId: string
	removeTask: (taskId: string, todolistId: string) => void
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
}

export const Task = memo(
	({
		task,
		todolistId,
		removeTask,
		changeTaskStatus,
		changeTaskTitle,
	}: TaskPropsType) => {
		// Принимаем данные для удаления таски из нужного тудулиста
		const onClickHandler = () => removeTask(task.id, todolistId)

		// Принимаем данные для редактирования таски при двойном нажатии
		const onChangeTitleHandler = useCallback(
			(newValue: string) => {
				changeTaskTitle(todolistId, task.id, newValue)
			},
			[changeTaskTitle, task.id, todolistId]
		)

		// Изменение статуса таски
		const onChangeTaskStatusHandler = useCallback(
			(event: ChangeEvent<HTMLInputElement>) => {
				let newIsDoneValue = event.currentTarget.checked
				changeTaskStatus(
					todolistId,
					task.id,
					newIsDoneValue ? TaskStatus.Completed : TaskStatus.New
				)
			},
			[todolistId, task.id]
		)

		return (
			<StyledTask key={task.id}>
				<Checkbox
					checked={task.status === TaskStatus.Completed}
					onChange={onChangeTaskStatusHandler}
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
