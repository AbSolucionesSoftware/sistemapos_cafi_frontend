import React, { forwardRef, Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
	const [ open, setOpen ] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Fragment>
			<IconButton onClick={() => handleClickOpen()}>
				<Delete color="error" />
			</IconButton>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-delete-producto"
			>
				<DialogTitle id="alert-dialog-delete-producto">
					{'¿Estás seguro de eliminar este producto?'}
				</DialogTitle>
				<DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
					<Button onClick={handleClose} color="inherit">
						Cancelar
					</Button>
					<Button onClick={handleClose} color="secondary">
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
