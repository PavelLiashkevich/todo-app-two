import styled from 'styled-components'

import { Task } from './Task'
import { TaskStatus } from '../../enums/enums'
import { TodolistDomainType } from 'features/reducers/Todolists'
import { useAppSelector } from 'app/store'
import { selectTasks } from 'features/reducers/Tasks'

type Props = {
	todolist: TodolistDomainType
	filter: string
}

export const TasksList = ({ todolist, filter }: Props) => {
	const tasksN = useAppSelector(selectTasks)

	let filteredTasks = tasksN[todolist.id]

	if (filter === 'active') {
		filteredTasks = filteredTasks.filter(task => task.status === TaskStatus.New)
	}
	if (filter === 'completed') {
		filteredTasks = filteredTasks.filter(
			task => task.status === TaskStatus.Completed
		)
	}

	return (
		<StyledList>
			{filteredTasks.map(task => {
				return <Task key={task.id} task={task} />
			})}
		</StyledList>
	)
}

const StyledList = styled.ul`
	margin-bottom: 50px;
	margin-top: 50px;
`
