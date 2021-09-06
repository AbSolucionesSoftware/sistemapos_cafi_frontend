import React, { Fragment } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Button, Box } from '@material-ui/core';

export default function RegistroAlmacen() {
	return (
		<Fragment>
			<Button color="primary" startIcon={<AddIcon />}>
				Nuevo
			</Button>
		</Fragment>
	);
}
