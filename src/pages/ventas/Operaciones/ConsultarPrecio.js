import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import ItemsCarousel from "react-items-carousel";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "../styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Search } from "@material-ui/icons";
import { CONSULTA_PRODUCTO_UNITARIO } from "../../../gql/Ventas/ventas_generales";
import { useApolloClient } from "@apollo/client";
import ErrorPage from "../../../components/ErrorPage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConsultarPrecio() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  let turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [value, setValue] = useState("");
  const [dataQuery, setDataQuery] = useState({
    data: undefined,
    loading: false,
    error: undefined,
  });
  const client = useApolloClient();

  const obtenerProducto = async () => {
    try {
      setDataQuery({ ...dataQuery, loading: true });
    const response = await client.query({
      query: CONSULTA_PRODUCTO_UNITARIO,
      variables: {
        datosProductos: value.toUpperCase(),
        empresa: sesion.empresa._id,
        sucursal: sesion.sucursal._id,
      },
      fetchPolicy: "network-only",
    });
    const { loading, data, error } = response;
    setDataQuery({ data, loading, error });
    } catch (error) {
      console.log(error)
    }
  };

  let productoBase = null;
  if (dataQuery.data) productoBase = dataQuery.data.obtenerUnProductoVentas;

  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(!open);
    productoBase = [];
  };

  const keyUpEvent = async (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      obtenerProducto();
    }
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.keyCode === 120) {
      handleClickOpen();
    }
  }
  const chevronWidth = 40;

  useEffect(() => {
    turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  }, [turnoEnCurso]);

  return (
    <Fragment>
      <Button
        className={classes.borderBotonChico}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso}
      >
        <Box>
          <Box>
            <img
              src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/precios.svg"
              alt="icono ventas"
              style={{ width: 36 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Consultar Precio</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>F9</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <img
                src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/productos.svg"
                alt="icono productos"
                style={{ width: 50 }}
              />
              <Box mx={1} />
              <Typography variant="h6">Precio Producto</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box my={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Buscar producto por CLAVE ALTERNA"
              onKeyUp={keyUpEvent}
              onChange={(e) => setValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={(e) => obtenerProducto(e)}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Box>
          {dataQuery.loading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="53vh"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {productoBase?.id_producto?.imagenes.length > 0 ? (
                  <Box px={10}>
                    <ItemsCarousel
                      requestToChangeActive={setActiveItemIndex}
                      activeItemIndex={activeItemIndex}
                      numberOfCards={1}
                      leftChevron={
                        <IconButton
                          aria-label="delete"
                          disabled
                          color="primary"
                        >
                          <ArrowBackIosIcon />
                        </IconButton>
                      }
                      rightChevron={
                        <IconButton
                          aria-label="delete"
                          disabled
                          color="primary"
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                      }
                      infiniteLoop={true}
                      outsideChevron
                      chevronWidth={chevronWidth}
                    >
                      {productoBase?.id_producto?.imagenes.map(
                        (image, index) => {
                          return (
                            <Box
                              key={index}
                              className={classes.containerImagenesProducto}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <img
                                alt="Imagen producto"
                                src={image.url_imagen}
                                className={classes.imagenProducto}
                              />
                            </Box>
                          );
                        }
                      )}
                    </ItemsCarousel>
                  </Box>
                ) : (
                  <Box
                    height="200px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <PhotoLibraryIcon style={{ fontSize: 100 }} />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box width="100%" mb={5} textAlign="center">
                  <Typography>
                    <b>{`Codigo de barras: ${productoBase?.codigo_barras}`}</b>
                  </Typography>
                  <Typography variant="h6">
                    <b>
                      {
                        productoBase?.id_producto?.datos_generales
                          .nombre_comercial
                      }
                    </b>
                  </Typography>
                  <Box display="flex" justifyContent="center">
                    <Box textAlign="center" mx={1}>
                      <Typography>
                        <b>{`Unidad: ${productoBase?.unidad}`}</b>
                      </Typography>
                    </Box>
                    <Box textAlign="center" mx={1}>
                      <Typography>
                        <b>
                          {`Existencias: ${
                            productoBase?.inventario_general
                              ? productoBase?.inventario_general[0]
                                  ?.cantidad_existente
                              : 0
                          }`}
                        </b>
                      </Typography>
                    </Box>
                  </Box>
                  <Box my={1}>
                    <Typography style={{ color: "red" }}>
                      {productoBase?.descuento_activo === true ? (
                        <b>Precio Promoción</b>
                      ) : null}
                    </Typography>
                    <Typography variant="h3">
                      {productoBase?.descuento_activo === true ? (
                        <b style={{ color: "red" }}>
                          ${productoBase?.descuento?.precio_neto.toFixed(2)}
                        </b>
                      ) : (
                        <b style={{ color: "green" }}>
                          ${productoBase?.precio}
                        </b>
                      )}
                    </Typography>
                    {productoBase?.descuento_activo === true ? (
                      <div className={classes.formInputFlex}>
                        <Box width="100%" textAlign="center">
                          <Typography>
                            <b>Precio sin descuento</b>
                          </Typography>
                          <Typography variant="h4">
                            <b> ${productoBase?.precio} </b>
                          </Typography>
                        </Box>
                      </div>
                    ) : null}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
          {dataQuery.error ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="40vh"
            >
              <ErrorPage />
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
