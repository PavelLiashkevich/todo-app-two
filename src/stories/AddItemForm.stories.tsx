import type { Meta, StoryObj } from '@storybook/react'
import { AddItemForm } from '../common/components/addItemForm/AddItemForm'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof AddItemForm> = {
	title: 'TODOLISTS/AddItemForm',
	component: AddItemForm,

	parameters: {
		layout: 'centered',
	},

	tags: ['autodocs'],

	argTypes: {
		addItem: {
			description: 'Button clicked inside form',
		},
	},
}

export default meta
type Story = StoryObj<typeof AddItemForm>

export const AddItemFormStory: Story = {
	args: {
		addItem: async (title: string) =>
			action('Button clicked inside form')(title),
	},
}
