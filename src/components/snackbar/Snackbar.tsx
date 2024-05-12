import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

export default function AutohideSnackbar() {
	const [open, setOpen] = React.useState(true)

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	return (
		<div>
			<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
				<Stack sx={{ width: '100%' }} spacing={2}>
					<Alert severity='error'>This is an error Alert.</Alert>
				</Stack>
			</Snackbar>
		</div>
	)
}
