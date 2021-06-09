import { Box, makeStyles, Snackbar, Typography } from '@material-ui/core';
/* import { Alert } from '@material-ui/lab'; */
import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
	snack: {
		zIndex: 10000
	}
}));

export default function SnackBarMessages({ alert, setAlert }) {
	const classes = useStyles();

	const handleClose = () => {
		setAlert({ open: false, status: alert.status, message: '' });
	};

	return (
		<Snackbar
			className={classes.snack}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={alert.open}
			onClose={handleClose}
			message={
				<Box display="flex">
					{alert.status === 'success' ? (
						<CheckCircleIcon style={{ color: '#22bb33' }} />
					) : (
						<ErrorIcon style={{ color: 'red' }} />
					)}
					<Box mr={1} />
					<Typography>{alert.message}</Typography>
				</Box>
			}
		/>
	);
	/* return (
		<Snackbar
			className={classes.snack}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			open={alert.open}
			onClose={handleClose}
			autoHideDuration={2000}
		>
			<Alert onClose={handleClose} severity={alert.status}>
				{alert.message}
			</Alert>
		</Snackbar>
	); */
}
