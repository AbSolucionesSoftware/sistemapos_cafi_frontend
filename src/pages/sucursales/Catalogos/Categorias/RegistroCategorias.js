import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Box, Button, Divider, IconButton, TextField } from '@material-ui/core';
import { Add, Delete, Edit } from '@material-ui/icons';

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	flexGrow: {
		flexGrow: 1
	}
});

export default function RegistroCategorias() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Typography variant="h6">Categorias</Typography>
			<Box display="flex" alignItems="center" mb={2}>
				<TextField
					/* error */
					id="outlined-error-helper-text"
					defaultValue="Ropa"
					/* helperText="Incorrect entry." */
					variant="outlined"
					size="small"
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation>
					<Add />Guardar
				</Button>
			</Box>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-label="Expand"
					aria-controls="additional-actions1-content"
					id="additional-actions1-header"
				>
					<Box display="flex" alignItems="center" width="100%">
						<Typography variant="h6">categoria 1</Typography>
						<div className={classes.flexGrow} />
						<IconButton
							onClick={(event) => event.stopPropagation()}
							onFocus={(event) => event.stopPropagation()}
						>
							<Edit />
						</IconButton>
						<IconButton
							onClick={(event) => event.stopPropagation()}
							onFocus={(event) => event.stopPropagation()}
						>
							<Delete />
						</IconButton>
					</Box>
				</AccordionSummary>
				<AccordionDetails>
					<Box width="100%">
						<Divider />
						<Box mb={2} />
						<Box ml={5} width="100%" display="flex">
							<Typography variant="h6">Subcategorias</Typography>
							<Box mr={2} />
							<Box display="flex" alignItems="center" mb={2}>
								<TextField
									/* error */
									id="outlined-error-helper-text"
									defaultValue="playeras"
									/* helperText="Incorrect entry." */
									variant="outlined"
									size="small"
								/>
								<Box ml={1} />
								<Button color="primary" variant="contained" size="large" disableElevation>
									<Add />Guardar
								</Button>
							</Box>
						</Box>
						<Box ml={5} >
							<Box display="flex" alignItems="center">
								<Typography>Subcategoria 1</Typography>
								<div className={classes.flexGrow} />
								<IconButton
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
								>
									<Edit />
								</IconButton>
								<IconButton
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
								>
									<Delete />
								</IconButton>
							</Box>
                            <Divider />
                            <Box display="flex" alignItems="center">
								<Typography>Subcategoria 2</Typography>
								<div className={classes.flexGrow} />
								<IconButton
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
								>
									<Edit />
								</IconButton>
								<IconButton
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
								>
									<Delete />
								</IconButton>
							</Box>
                            <Divider />
                            <Divider />
                            <Box display="flex" alignItems="center">
								<Typography>Subcategoria 3</Typography>
								<div className={classes.flexGrow} />
								<IconButton
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
								>
									<Edit />
								</IconButton>
								<IconButton
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
								>
									<Delete />
								</IconButton>
							</Box>
                            <Divider />
						</Box>
					</Box>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}
