import React from 'react'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { IconButton, TextField } from '@mui/material'
import { AddCircle } from '@mui/icons-material'
import styled from 'styled-components'

type AddTaskButtonPropsType = {
	addItem: (title: string) => void
}

export const AddItemForm = React.memo(({ addItem }: AddTaskButtonPropsType) => {
	// Состояние инпута
	let [title, setTitle] = useState('')

	// Состояние ошибки при вводе некорректных данных или вообще не вводе данных
	let [error, setError] = useState<string | null | false>(null)

	// Добавление новой таски при нажатии клавиши Enter
	const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
		if (error !== null) {
			setError(null)
		}
		if (event.key === 'Enter') {
			addTaskHandler()
		}
	}

	//  Отслеживаем ввод данных в инпут
	const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.currentTarget.value)
		event.currentTarget.value.length > 15 && setError(error)
		setError(null)
	}

	// Добавление новой таски, а также учет содержимого в инпуте
	const addTaskHandler = () => {
		if (title.trim() !== '') {
			addItem(title.trim())
			setTitle('')
		} else {
			setError('Title is required')
		}
	}

	// Отключение кнопки, если символов > 15
	//const isAddTaskBtnDisabled = title.length > 15

	return (
		<StyledItemForm>
			<TextField
				error={!!error}
				value={title}
				onChange={onChangeHandler}
				onKeyPress={onKeyPressHandler}
				label='Max 15 symbols'
				helperText={error}
			/>

			<IconButton
				onClick={addTaskHandler}
				//disabled={isAddTaskBtnDisabled}
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
