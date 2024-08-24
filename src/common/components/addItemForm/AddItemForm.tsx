import React from 'react'
import styled from 'styled-components'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useAppSelector } from 'app/store'

import { IconButton, TextField } from '@mui/material'
import { AddCircle } from '@mui/icons-material'
import { unwrapResult } from '@reduxjs/toolkit'
import { BaseResponse } from 'common/types/BaseResponse'

type Props = {
	addItem: (title: string) => Promise<any>
	disable?: boolean
}

export const AddItemForm = React.memo(({ addItem, disable }: Props) => {
	let [title, setTitle] = useState('')

	let [error, setError] = useState<string | null | false>(null)

	const status = useAppSelector(state => state.app.status)

	const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
		if (error !== null) {
			setError(null)
		}
		if (event.key === 'Enter') {
			addTaskHandler()
		}
	}

	const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.currentTarget.value)
		event.currentTarget.value.length > 15 && setError(error)
		setError(null)
	}

	const addTaskHandler = () => {
		if (title.trim() !== '') {
			addItem(title.trim())
				.then(unwrapResult)
				.then(() => {
					setTitle('')
				})
				.catch((error: BaseResponse) => {
					if (error?.resultCode) {
						setError(error.messages[0])
					}
				})
		} else {
			setError('Title is required')
		}
	}

	return (
		<StyledItemForm>
			<TextField
				error={!!error}
				value={title}
				onChange={onChangeHandler}
				onKeyPress={onKeyPressHandler}
				label='Max 15 symbols'
				helperText={error}
				disabled={disable}
			/>

			<IconButton
				onClick={addTaskHandler}
				disabled={status === 'loading'}
				color='secondary'
			>
				<AddCircle />
			</IconButton>
		</StyledItemForm>
	)
})

const StyledItemForm = styled.div`
	margin: 20px 10px;
	display: flex;
	align-items: center;
`
