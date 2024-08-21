import styled from 'styled-components'
import { useCallback, useState } from 'react'
import { Button } from '@mui/material'

import { FilterValuesType } from 'features/reducers/Todolists'

type Props = {
	id: string
	changeFilter: (todolistId: string, value: FilterValuesType) => void
}

export function FilterButtons({ id, changeFilter }: Props) {
	const [isAll, setIsAll] = useState(true)
	const [isActive, setIsActive] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)

	const onAllClickHandler = useCallback(() => {
		changeFilter(id, 'all')
		setIsAll(true)
		setIsActive(false)
		setIsCompleted(false)
	}, [changeFilter, id])

	const onActiveClickHandler = useCallback(() => {
		changeFilter(id, 'active')
		setIsActive(true)
		setIsAll(false)
		setIsCompleted(false)
	}, [changeFilter, id])

	const onCompletedClickHandler = useCallback(() => {
		changeFilter(id, 'completed')
		setIsCompleted(true)
		setIsAll(false)
		setIsActive(false)
	}, [changeFilter, id])

	return (
		<StyledFilterButtons>
			<Button variant={isAll ? 'outlined' : 'text'} onClick={onAllClickHandler}>
				All
			</Button>
			<Button
				variant={isActive ? 'outlined' : 'text'}
				onClick={onActiveClickHandler}
			>
				Active
			</Button>
			<Button
				variant={isCompleted ? 'outlined' : 'text'}
				onClick={onCompletedClickHandler}
			>
				Completed
			</Button>
		</StyledFilterButtons>
	)
}

const StyledFilterButtons = styled.div`
	margin-top: 1rem;
`
