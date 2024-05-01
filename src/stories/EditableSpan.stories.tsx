import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { EditableSpan } from '../components/editableSpan/EditableSpan'

const meta: Meta<typeof EditableSpan> = {
	title: 'TODOLISTS/EditableSpan',
	component: EditableSpan,

	parameters: {
		layout: 'centered',
	},

	tags: ['autodocs'],

	args: {
		onChange: action('Value EditableSpan changed'),
		oldTitle: 'Start Value',
	},
}

export default meta
type Story = StoryObj<typeof EditableSpan>

export const EditableSpanStory: Story = {}
