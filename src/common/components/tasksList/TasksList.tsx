import styled from 'styled-components'

import { Task } from './Task'
import { TaskType } from 'api/task-api.types'
import { TaskStatus } from '../../enums/enums'

type Props = {
	tasks: Array<TaskType>
	todolistId: string
	filter: string
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

export const TasksList = ({
	tasks,
	todolistId,
	filter,
	changeTaskStatus,
	changeTaskTitle,
}: Props) => {
	const filteredTasks = () => {
		let tasksFilteredTodoList = tasks

		if (filter === 'active') {
			tasksFilteredTodoList = tasks.filter(
				task => task.status === TaskStatus.New
			)
		}
		if (filter === 'completed') {
			tasksFilteredTodoList = tasks.filter(
				task => task.status === TaskStatus.Completed
			)
		}

		return tasksFilteredTodoList
	}

	return (
		<StyledList>
			{filteredTasks()?.map(task => {
				return (
					<Task
						key={task.id}
						task={task}
						changeTaskStatus={changeTaskStatus}
						changeTaskTitle={changeTaskTitle}
						todolistId={todolistId}
					/>
				)
			})}
		</StyledList>
	)
}

const StyledList = styled.ul`
	margin-bottom: 50px;
	margin-top: 50px;
`
