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
import {
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import Facturama from "../../../../../billing/Facturama/facturama.api";
import { CREAR_CODIGO_PRODUCTO } from "../../../../../gql/CatalogosSat/catalogoProductosSat";
import { useMutation } from "@apollo/client";

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
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = React.useState(false);
  const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState({});
  const [error, setError] = useState("");

  const [crearCodigoProducto] = useMutation(CREAR_CODIGO_PRODUCTO);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const limpiarDataModal = () => {
    setSelectedIndex({});
    setProductos([]);
    setBusqueda("");
    handleClose();
  };

  const handleOk = async () => {
    const { Name, Value } = selectedIndex;
    setDatosGenerales({
      ...datos_generales,
      clave_producto_sat: {
        Name,
        Value,
      },
    });
    //Crear Codigo product a la BD
    // antes buscar si ya existe, si existe no hacer la consulta

    const result = await crearCodigoProducto({
      variables: {
        input: {
          Name,
          Value,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      },
    });

    console.log(result);
    /* limpiarDataModal(); */
  };

  const handleCancel = () => {
    limpiarDataModal();
  };

  const obtenerCampos = (data) => {
    console.log(data);
    if (!data) {
      setDatosGenerales({
        ...datos_generales,
        clave_producto_sat: {
          Name: "",
          Value: "",
        },
      });
      return null;
    }
    console.log(data);
    setDatosGenerales({
      ...datos_generales,
      clave_producto_sat: {
        Name: data.Name,
        Value: data.Value,
      },
    });
  };

  const buscarCatalogo = async (e) => {
    e.preventDefault();
    if (!busqueda) {
      setProductos([]);
      return;
    }
    setLoading(true);
    try {
      await Facturama.Catalogs.ProductsOrServices(
        busqueda,
        function (result) {
          setProductos(result);
          setLoading(false);
        },
        function (error) {
          if (error && error.responseJSON) {
            console.log("errores", error.responseJSON);
            setError(error.responseJSON);
          }
          setLoading(false);
        }
      );
    } catch (error) {
      if (error && error.responseJSON) {
        setError(error.responseJSON.Message);
      }
      setLoading(false);
    }
  };

  const top100Films = [
    { Name: "The Shawshank Redemption", Value: "1994" },
    { Name: "The Godfather", Value: "1972" },
    { Name: "The Godfather: Part II", Value: "1974" },
    { Name: "The Dark Knight", Value: "2008" },
    { Name: "12 Angry Men", Value: "1957" },
    { Name: "Schindler's List", Value: "1993" },
    { Name: "Pulp Fiction", Value: "1999" },
    { Name: "Sistemas de exploración y desarrollo", Value: "20102000" },
  ];

  return (
    <div>
      <Typography>Clave de producto SAT</Typography>
      <Box display="flex">
        <Autocomplete
          id="catalogos-bd-productos"
          size="small"
          options={top100Films}
          getOptionLabel={(option) => `${option.Value} - ${option.Name}`}
          fullWidth
          renderInput={(params) => <TextField {...params} variant="outlined" />}
          onChange={(_, data) => obtenerCampos(data)}
          getOptionSelected={(option) => `${option.Value} - ${option.Name}`}
          value={datos_generales.clave_producto_sat}
        />
        <Button color="primary" onClick={handleClickOpen}>
          <Search />
        </Button>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCancel}
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
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setError("");
                }}
                value={busqueda}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={buscarCatalogo}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={error ? true : false}
                helperText={error ? error : ""}
              />
            </form>
          </Box>
          <Box my={3} className={classes.root}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="25vh"
              >
                <CircularProgress />
              </Box>
            ) : (
              <List dense component="nav" aria-label="main mailbox folders">
                {productos.map((res, index) => (
                  <SelectedListItem
                    key={index}
                    producto={res}
                    busqueda={busqueda}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                  />
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={() => handleCancel()}>Cancelar</Button>
          <Button onClick={() => handleOk()} color="primary">
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const SelectedListItem = ({
  producto,
  busqueda,
  selectedIndex,
  setSelectedIndex,
}) => {
  const handleListItemClick = (data) => {
    console.log(data);
    setSelectedIndex(data);
  };

  const contiene = busqueda.includes("potacio");
  if (producto.Value === "0" && !contiene) {
    return null;
  }

  return (
    <Fragment>
      <ListItem
        button
        selected={selectedIndex.Value === producto.Value}
        onClick={() => handleListItemClick(producto)}
      >
        <ListItemText primary={`${producto.Value} - ${producto.Name}`} />
      </ListItem>
      <Divider />
    </Fragment>
  );
};
