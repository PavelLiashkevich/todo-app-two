import React from 'react'
import { ChangeEvent, useState } from 'react'
import { TextField } from '@mui/material'

type Props = {
	oldTitle: string
	isDone?: boolean
	onChange: (title: string) => void
}

export const EditableSpan = React.memo(
	({ oldTitle, isDone, onChange }: Props) => {
		let [editMode, setEditMode] = useState(false)
		let [newTitle, setNewTitle] = useState('')

		const activateEditMode = () => {
			setEditMode(true)
			setNewTitle(oldTitle)
		}
		const activateViewMode = () => {
			setEditMode(false)
			onChange(newTitle)
		}

		const onChangeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
			setNewTitle(event.currentTarget.value)
		}

		return editMode ? (
			<TextField
				value={newTitle}
				onChange={onChangeTitleHandler}
				onBlur={activateViewMode}
				className={isDone ? 'is-done' : ''}
				variant='standard'
				autoFocus
			/>
		) : (
			<span
				onDoubleClick={activateEditMode}
				className={isDone ? 'is-done' : ''}
			>
				{oldTitle}
			</span>
		)
	}
)
