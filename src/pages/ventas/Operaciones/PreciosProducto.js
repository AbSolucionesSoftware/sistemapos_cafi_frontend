import React, { useState, useContext, Fragment } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid,   Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Checkbox } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import useStyles from '../styles';
import { VentasContext } from '../../../context/Ventas/ventasContext';


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function PreciosProductos() {
    
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [ setSelectPrisingProduct ] = useState({});

    const { productoCambioPrecio } = useContext(VentasContext);

    // console.log(productoCambioPrecio);
    
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    const handleClick = (name) => {
        console.log("llego a click");
        let newSelected = [];
        const exist = selected.indexOf(name) !== -1;
        if(exist){
          newSelected = [];
        }else{
          newSelected = newSelected.concat([], name);
        }
        setSelectPrisingProduct(name);
        setSelected(newSelected);
      };

      const TwoClickInRowTableBuy = (e, producto) => {
        try {
          let timer;
          clearTimeout(timer);
          if (e.detail === 2) {
            handleClick(producto);
            setSelectPrisingProduct(producto);
          }
        } catch (error) {
          console.log(error);
        }
      };

    const isSelected = (name) => {
        if(name.precio_neto === productoCambioPrecio.precio) setSelected(name);
        return selected.indexOf(name) !== -1 || name.precio_neto === productoCambioPrecio.precio;
      };

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.keyCode === 114){ 
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
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/money.svg' 
                            alt="icono money" 
                            style={{fontSize: 35}} 
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Precios</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>F3</b>
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
                <Grid container item lg={12}>
                    <Box 
                        display="flex" 
                        justifyContent="center" 
                    >
                        <Box mt={3}>
                            <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/money.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box>
                            <Box textAlign="right" mb={1}>
                                <Button variant="contained" color="secondary" onClick={handleClickOpen} size="medium">
                                    <CloseIcon />
                                </Button>
                            </Box>
                            <Box mt={2}>
                                <Typography variant="h6">
                                    Precios de Producto
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    </Grid>
                    <Grid>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                   Nombre:  { productoCambioPrecio ? productoCambioPrecio.id_producto.datos_generales.nombre_comercial : ""}
                                </Typography>
                            </Box>
                        </div>
                        <Paper className={classes.root}>
                            <TableContainer className={classes.container}>
                                <Table stickyHeader size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ width: 25 }}></TableCell>
                                            <TableCell style={{ width: 20 }}>Precio</TableCell>
                                            <TableCell style={{ width: 20 }}>Precio neto</TableCell>
                                            <TableCell style={{ width: 200 }}>Unidad mayoreo</TableCell>
                                            <TableCell style={{ width: 100 }}>% Utilidad</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productoCambioPrecio?.id_producto?.precios?.precios_producto?.map((precio, index) => {
                                            const isItemSelected = isSelected(precio);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (
                                                <RenderTableRows
                                                  key={index}
                                                  precio={precio}
                                                  isItemSelected={isItemSelected}
                                                  labelId={labelId}
                                                  handleClick={handleClick}
                                                  selected={selected}
                                                  setSelected={setSelected}
                                                  TwoClickInRowTableBuy={TwoClickInRowTableBuy}
                                                />
                                              );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

const RenderTableRows = ({
    precio,
    isItemSelected,
    labelId,
    handleClick,
    selected,
    setSelected,
    TwoClickInRowTableBuy
  }) => {

    return (
        <Fragment>
          <TableRow
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={precio.numero_precio}
            selected={isItemSelected}
            hover
            onClick={(e) => TwoClickInRowTableBuy(e,precio)}
            >
            <TableCell padding="checkbox">
                <Checkbox
                    onClick={(event) => {
                        handleClick(precio);
                    }}
                    checked={isItemSelected}
                    inputProps={{ "aria-labelledby": labelId }}
                />
            </TableCell>
          <TableCell align={'center'} >
            {precio.numero_precio}
          </TableCell>
          <TableCell align={'center'} >
            {precio.precio_neto}
          </TableCell>
          <TableCell align={'center'} >
            {precio.unidad_mayoreo}
          </TableCell>
          <TableCell align={'center'} >
            {precio.utilidad}
          </TableCell>
        </TableRow>
      </Fragment>
    );
  };