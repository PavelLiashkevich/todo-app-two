import styled from 'styled-components'

import { Task } from './Task'
import { TaskType } from 'api/task-api.types'
import { TaskStatus } from '../../enums/enums'

type Props = {
	tasks: Array<TaskType>
	filter: string
}

export const TasksList = ({ tasks, filter }: Props) => {
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
				return <Task key={task.id} task={task} />
			})}
		</StyledList>
	)
}

const StyledList = styled.ul`
	margin-bottom: 50px;
	margin-top: 50px;
`
