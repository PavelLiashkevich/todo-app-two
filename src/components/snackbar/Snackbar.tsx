import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { appActions } from '../../reducers/App/app-reducer'

export default function AutohideSnackbar() {
	const error = useAppSelector(state => state.app.error)

	const dispatch = useAppDispatch()

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		dispatch(appActions.setError({error: null}))
	}

	return (
		<div>
			<Snackbar open={!!error} autoHideDuration={3000} onClose={handleClose}>
				<Stack sx={{ width: '100%' }} spacing={2}>
					<Alert severity='error'>{error}</Alert>
				</Stack>
			</Snackbar>
		</div>
	)
}
