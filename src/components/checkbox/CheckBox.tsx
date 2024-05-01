import React from 'react'

import { Checkbox } from '@mui/material'
import { ChangeEvent } from 'react'

type CheckBoxPropsType = {
	onChange: (newStatusValue: boolean) => void
	checked: boolean
}

export const CheckBox = ({ onChange, checked }: CheckBoxPropsType) => {
	const onChangeTaskStatusHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const newStatusValue = event.currentTarget.checked

		onChange(newStatusValue)
	}

	return <Checkbox checked={checked} onChange={onChangeTaskStatusHandler} />
}
