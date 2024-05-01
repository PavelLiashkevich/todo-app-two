import React, { memo } from 'react'
import { useCallback } from 'react'
import styled from 'styled-components'

import { EditableSpan } from '../editableSpan/EditableSpan'
import { CheckBox } from '../checkbox/CheckBox'
import { IconButton } from '@mui/material'
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
		taskId: string,
		newValue: string,
		todolistId: string
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
				changeTaskTitle(task.id, newValue, todolistId)
			},
			[changeTaskTitle, task.id, todolistId]
		)

		// Принимаем данные для редактирования статуса таски
		const onChangeTaskStatusHandler = () => {
			changeTaskStatus(todolistId, task.id, task.status)
		}

		return (
			<StyledTask key={task.id}>
				<CheckBox
					checked={!!task.status}
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
