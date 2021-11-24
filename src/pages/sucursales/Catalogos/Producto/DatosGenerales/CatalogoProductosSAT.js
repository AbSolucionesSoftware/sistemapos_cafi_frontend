import React, { Fragment, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { Search } from "@material-ui/icons";
import { IconButton, InputAdornment } from "@material-ui/core";
import Facturama from '../../../../../billing/Facturama/facturama.api'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CatalogosProductosSAT() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);
  const [busqueda, setBusqueda] = useState("");
  /* const Facturama = new valuesFacturama;
 */
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const obtenerCampos = (data) => {
    console.log(data);
    setDatosGenerales({
      ...datos_generales,
      clave_producto_sat: data.value,
    });
  };



  /* const Facturama = require('../../../../../billing/Facturama/facturama.api') */
  /* console.log(Facturama); */

  const buscarCatalogo = (e) => {
    e.preventDefault();
    console.log(busqueda);

    Facturama.Catalogs.ProductsOrServices(
      "desarrollo",
      function (result) {
        console.log("Lista de códigos de producto: ", result);
      },
      function (error) {
        if (error && error.responseJSON) {
          console.log("errores", error.responseJSON);
        }
      } 
    );
  };

  const top100Films = [
    { product: "The Shawshank Redemption", value: 1994 },
    { product: "The Godfather", value: 1972 },
    { product: "The Godfather: Part II", value: 1974 },
    { product: "The Dark Knight", value: 2008 },
    { product: "12 Angry Men", value: 1957 },
    { product: "Schindler's List", value: 1993 },
    { product: "Pulp Fiction", value: 1999 },
  ];

  return (
    <div>
      <Typography>Clave de producto SAT</Typography>
      <Box display="flex">
        <Autocomplete
          id="catalogos-bd-productos"
          options={top100Films}
          getOptionLabel={(option) => `${option.value} - ${option.product}`}
          fullWidth
          renderInput={(params) => (
            <TextField {...params} variant="outlined" size="small" />
          )}
          onChange={(_, data) => obtenerCampos(data)}
          /*  getOptionSelected={(option) => option.value} */
          /* value={
            datos_generales.clave_producto_sat
              ? datos_generales.clave_producto_sat
              : null
          } */
        />
        <Button color="primary" onClick={handleClickOpen}>
          <Search />
        </Button>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-clave-producto"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-clave-producto">
          {"Catalogo de productos y servicios SAT"}
        </DialogTitle>
        <DialogContent style={{ height: "50vh" }}>
          <Box>
            <form onSubmit={buscarCatalogo}>
              <TextField
                variant="outlined"
                label="producto, servicio o giro de la empresa"
                fullWidth
                size="small"
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={buscarCatalogo}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>
          <Box my={3} className={classes.root}>
            <List dense component="nav" aria-label="main mailbox folders">
              <SelectedListItem />
            </List>
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose} color="primary">
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const SelectedListItem = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Fragment>
      <ListItem
        button
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0)}
      >
        <ListItemText primary="Inbox" />
      </ListItem>
      <Divider />
      <ListItem
        button
        selected={selectedIndex === 1}
        onClick={(event) => handleListItemClick(event, 1)}
      >
        <ListItemText primary="Drafts" />
      </ListItem>
    </Fragment>
  );
};
