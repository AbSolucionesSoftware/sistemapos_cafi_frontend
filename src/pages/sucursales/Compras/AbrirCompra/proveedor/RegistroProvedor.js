import React, { Fragment } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Button, Box } from '@material-ui/core';

export default function RegistroProvedor() {
	return (
		<Fragment>
			<Button color="primary" startIcon={<AddIcon />}>
				Nuevo
			</Button>
		</Fragment>
	);
}