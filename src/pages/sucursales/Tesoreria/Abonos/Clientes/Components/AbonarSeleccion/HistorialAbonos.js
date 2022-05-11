import React, { Fragment} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import {
  Dialog,
  Typography,
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Chip,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core";

import {  Done } from "@material-ui/icons";
import { formatoMexico,formatoFecha } from "../../../../../../../config/reuserFunctions";

const useStyles = makeStyles({
    
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistorialAbonos(props){
    const classes = useStyles();
   
    const theme = useTheme();
    const handleOpen = () =>{
        props.setOpenHistorial(!props.openHistorial)
    }
    return(
      <Fragment>
      <Dialog
          open={props.openHistorial}
          onClose={handleOpen}
          fullWidth
          maxWidth="sm"
          TransitionComponent={Transition}
      >
      <DialogTitle>
          <Box display="flex">
              <Typography variant="h6" style={{ flexGrow: 1 }}>
              Historial de abonos
              </Typography>
              <Button
              variant="text"
              color="primary"
              onClick={handleOpen}
              size="large"
              >
              <CloseIcon style={{ fontSize: 30 }} />
              </Button>
          </Box>
          </DialogTitle>
          <DialogContent>
              <Paper className={classes.root}>
                      <TableContainer className={classes.container}>
                      <Table stickyHeader size="small" aria-label="a dense table">
                          <TableHead>
                          <TableRow>
                              <TableCell>Fecha</TableCell>
                              <TableCell>Cantidad abono</TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                          {props.historialAbonos?.map((abono, index) => {
                             
                              return (
                              <TableRow hover tabIndex={-1} key={index}>
                                   <TableCell>
                                  {formatoFecha(abono.fecha_movimiento.completa)}
                                  </TableCell>
                                  <TableCell padding="checkbox">
                                  <b>${formatoMexico(abono.monto_total_abonado)}</b>
                                  </TableCell>
                                 
                                
                              </TableRow>
                              );
                          })}
                          </TableBody>
                      </Table>
                      </TableContainer>
                  </Paper>
          </DialogContent>
          <DialogActions>
          <Button
              variant="text"
              color="primary"
              size="large"
              startIcon={<Done />}
              onClick={() => handleOpen()}
          >
              Aceptar
          </Button>
          </DialogActions>
      </Dialog>   
 </Fragment>
    )
};