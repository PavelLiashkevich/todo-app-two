import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { App } from '../App'
import { ReduxStoreProviderDecorator } from './decorators/ReduxStoreProviderDecorator'

const meta: Meta<typeof App> = {
	title: 'TODOLISTS/AppWithRedux',
	component: App,

	parameters: {
		layout: 'centered',
	},

	tags: ['autodocs'],

	decorators: [ReduxStoreProviderDecorator],
}

export default meta
type Story = StoryObj<typeof App>

export const AppWithReduxStory: Story = {}
