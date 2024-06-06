import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Task } from '../common/components/tasksList/Task'
import { TaskPriority, TaskStatus } from '../api/task-api'
import { v1 } from 'uuid'

const meta: Meta<typeof Task> = {
	title: 'TODOLISTS/Task',
	component: Task,

	parameters: {
		layout: 'centered',
	},

	tags: ['autodocs'],

	args: {
		changeTaskStatus: action('Status changed inside Task'),
		changeTaskTitle: action('Title changed inside Task'),
		removeTask: action('Remove Button clicked changed inside Task'),
		task: {
			id: '12wsdewfijdei',
			title: 'JS',
			status: TaskStatus.Completed,
			todoListId: v1(),
			description: '',
			startDate: '',
			deadline: '',
			addedDate: '',
			order: 0,
			priority: TaskPriority.Low,
		},
		todolistId: 'fgdosrg8rgjuh',
	},
}

export default meta
type Story = StoryObj<typeof Task>

export const TaskIsNotDoneStory: Story = {}

export const TaskIsDoneStory: Story = {
	args: {
		task: {
			id: '12wsdewfijdei2343',
			title: 'CSS',
			status: TaskStatus.Completed,
			todoListId: v1(),
			description: '',
			startDate: '',
			deadline: '',
			addedDate: '',
			order: 0,
			priority: TaskPriority.Low,
		},
	},
}
