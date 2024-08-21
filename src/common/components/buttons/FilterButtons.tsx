import styled from 'styled-components'
import { useAppDispatch } from 'app/store'
import { FilterValuesType, todolistsActions } from 'features/reducers/Todolists'
import { Button } from '@mui/material'

type Props = {
	id: string
	filter: string
}

export const FilterButtons = ({ id, filter }: Props) => {
	const dispatch = useAppDispatch()

	const onClickHandler = (filter: FilterValuesType) => {
		dispatch(todolistsActions.changeFilter({ todolistId: id, filter }))
	}

	return (
		<StyledFilterButtons>
			<Button
				variant={filter === 'all' ? 'outlined' : 'text'}
				onClick={() => onClickHandler('all')}
				color='inherit'
			>
				All
			</Button>
			<Button
				variant={filter === 'active' ? 'outlined' : 'text'}
				onClick={() => onClickHandler('active')}
				color='primary'
			>
				Active
			</Button>
			<Button
				variant={filter === 'completed' ? 'outlined' : 'text'}
				onClick={() => onClickHandler('completed')}
				color='secondary'
			>
				Completed
			</Button>
		</StyledFilterButtons>
	)
}

const StyledFilterButtons = styled.div`
	margin-top: 1rem;
`
