import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { useAppSelector } from '../../store/store'

export default function AutohideSnackbar() {

	const error = useAppSelector(state => state.app.error)	

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
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
