import React, { Fragment } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';

export default function RegistroAlmacen() {
	return (
		<Fragment>
			<IconButton color="primary">
				<AddIcon />
			</IconButton>
		</Fragment>
	);
}
