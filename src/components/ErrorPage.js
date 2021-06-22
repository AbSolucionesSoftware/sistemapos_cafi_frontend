import React from 'react';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Box, Typography } from '@material-ui/core';

export default function ErrorPage() {
	return (
		<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={400}>
			<ErrorOutlineIcon style={{ fontSize: 100, color: 'rgba(17,85,204, 0.7)' }} />
			<Typography align="center" style={{ fontSize: 18, color: 'rgba(17,85,204)' }}>
				Ups... hay un problema
			</Typography>
		</Box>
	);
}
