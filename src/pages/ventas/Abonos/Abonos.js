import React, { useState } from 'react';
import { Box, Button,  Dialog, DialogActions, DialogContent, Slide } from '@material-ui/core'
import useStyles from '../styles';
import { FcDonate } from 'react-icons/fc';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Abonos() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => { 
		setOpen(!open);
	};
    return (
        <>
            <Button 
                className={classes.borderBoton}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <FcDonate style={{fontSize: 110}} />
                    </Box>
                    <Box>
                        Abonos
                    </Box>
                </Box>
            </Button>
            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
                <DialogContent>
                    Abonitos
                </DialogContent>
                <DialogActions>

                </DialogActions>

            </Dialog>
            
        </>
    )
}
