import React, { forwardRef, Fragment, useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { CircularProgress, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function EliminarProducto({ datos, productosRefetch }) {
	const [ open, setOpen ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	/* const [ alert, setAlert ] = useState({ message: '', status: '', open: false }); */

	const handleToggleModal = () => setOpen(!open);

	const eliminarProductoBD = async () => {

	};

	return (
		<Fragment>
			{/* <SnackBarMessages alert={alert} setAlert={setAlert} /> */}
			<IconButton onClick={() => handleToggleModal()}>
				<Delete color="error" />
			</IconButton>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => handleToggleModal()}
				aria-labelledby="alert-dialog-delete-producto"
			>
				<DialogTitle id="alert-dialog-delete-producto">
					{'¿Estás seguro de eliminar este producto?'}
				</DialogTitle>
				<DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
					<Button onClick={() => handleToggleModal()} color="inherit">
						Cancelar
					</Button>
					<Button onClick={() => eliminarProductoBD()} color="secondary" startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
