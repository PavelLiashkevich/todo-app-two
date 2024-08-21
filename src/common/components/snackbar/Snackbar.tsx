import { useAppDispatch, useAppSelector } from 'app/store'
import { appActions } from 'features/reducers/App'

import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

export const AutohideSnackbar = () => {
	const error = useAppSelector(state => state.app.error)

	const dispatch = useAppDispatch()

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		dispatch(appActions.setError({ error: null }))
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
