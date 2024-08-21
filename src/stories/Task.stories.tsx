import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Task } from '../common/components/tasksList/Task'
import { v1 } from 'uuid'
import { TaskPriority, TaskStatus } from 'common/enums'

const meta: Meta<typeof Task> = {
	title: 'TODOLISTS/Task',
	component: Task,

	parameters: {
		layout: 'centered',
	},

	tags: ['autodocs'],

	args: {
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
