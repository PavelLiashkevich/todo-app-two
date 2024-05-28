import styled from 'styled-components'
import { TaskStatus, TaskType } from '../../api/task-api'
import { Task } from './Task'

type TasksListPropsType = {
	tasks: Array<TaskType>
	todolistId: string
	filter: string
	removeTask: (taskId: string, todolistId: string) => void
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
	removeTask,
	changeTaskStatus,
	changeTaskTitle,
}: TasksListPropsType) => {
	// Фильтрация тасок при нажатии на кнопки
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
						removeTask={removeTask}
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
