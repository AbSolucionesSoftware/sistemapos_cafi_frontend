import React, { useState } from 'react';
import { Box, Button,  Dialog, DialogActions, DialogContent, Slide, Typography } from '@material-ui/core'
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
    
    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.keyCode === 117){ 
            handleClickOpen();
        } 
    };

    return (
        <>
            <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <FcDonate style={{fontSize: 35}} />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Abonos</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>F6</b>
                        </Typography>
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
