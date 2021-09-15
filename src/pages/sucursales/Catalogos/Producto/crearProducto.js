import React, { useState, Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import {
  Button,
  AppBar,
  Badge,
  Typography,
  CircularProgress,
  Backdrop,
  IconButton,
} from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import almacenIcon from "../../../../icons/tarea-completada.svg";
import imagenesIcon from "../../../../icons/imagenes.svg";
import ventasIcon from "../../../../icons/etiqueta-de-precio.svg";
import registroIcon from "../../../../icons/portapapeles.svg";
import costosIcon from "../../../../icons/costos.svg";
import calendarIcon from "../../../../icons/calendar.svg";
import tallasColoresIcon from "../../../../icons/tallas-colores.svg";
import RegistroInfoGenerales from "./DatosGenerales/registrarInfoGeneral";
import RegistroInfoAdidional from "../Producto/PreciosVenta/registrarInfoAdicional";
import CargarImagenesProducto from "./Imagenes/cargarImagenesProducto";
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";
import RegistroAlmacenInicial from "./Inventario&Almacen/AlmacenInicial";
import ColoresTallas from "./TallasColores/TallasColores";
import ErrorPage from "../../../../components/ErrorPage";

import { useMutation, useQuery } from "@apollo/client";
import {
  CREAR_PRODUCTO,
  OBTENER_CONSULTAS,
  ACTUALIZAR_PRODUCTO,
} from "../../../../gql/Catalogos/productos";
import { validaciones } from "./validaciones";
import CentroCostos from "./CentroCostos/CentroCostos";
import PrecioPlazos from "./PrecioPlazos/PrecioPlazos";

import {
  initial_state_datos_generales,
  initial_state_precios,
  initial_state_unidadVentaXDefecto,
  initial_state_almacen_inicial,
  initial_state_centro_de_costos,
  initial_state_preciosPlazos,
} from "../../../../context/Catalogos/initialStatesProducto";
import {
  Add,
  Close,
  Edit,
  NavigateBefore,
  NavigateNext,
} from "@material-ui/icons";
/* import SnackBarMessages from '../../../../components/SnackBarMessages'; */

export const initial_state_preciosP = [
  {
    numero_precio: 1,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
  },
  {
    numero_precio: 2,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
  },
  {
    numero_precio: 3,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
  },
  {
    numero_precio: 4,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
  },
  {
    numero_precio: 5,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
  },
  {
    numero_precio: 6,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-reg-product-${index}`}
      aria-labelledby={`reg-product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} height="70vh">
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `reg-product-tab-${index}`,
    "aria-controls": `tabpanel-reg-product-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  iconSvg: {
    width: 50,
  },
  dialogContent: {
    padding: 0,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function CrearProducto({
  accion,
  datos,
  productosRefetch,
  fromCompra,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const {
    datos_generales,
    setDatosGenerales,
    precios,
    setPrecios,
    validacion,
    setValidacion,
    preciosP,
    setPreciosP,
    imagenes,
    setImagenes,
    unidadesVenta,
    setUnidadesVenta,
    almacen_inicial,
    setAlmacenInicial,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    centro_de_costos,
    setCentroDeCostos,
    setUpdate,
    preciosPlazos,
    setPreciosPlazos,
    setSubcategorias,
    setOnPreview,
    setSubcostos,
    imagenes_eliminadas,
    setImagenesEliminadas,
    presentaciones,
    setPresentaciones,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
  } = useContext(RegProductoContext);

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  /* const [ alert, setAlert ] = useState({ message: '', status: '', open: false }); */
  const { alert, setAlert } = useContext(RegProductoContext);
  const [loading, setLoading] = useState(false);
  const tipo = datos_generales.tipo_producto;

  /* Mutations */
  const [crearProducto] = useMutation(CREAR_PRODUCTO);
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

  const toggleModal = (producto) => {
    setOpen(!open);
    setUpdate(accion);
    if (producto && accion) {
      setInitialStates(producto);
    } else {
      resetInitialStates();
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /* ###### GUARDAR LA INFO EN LA BD ###### */

  const saveData = async () => {
    const validate = validaciones(
      datos_generales,
      precios,
      almacen_inicial,
      presentaciones,
      datos
    );

    if (validate.error) {
      setValidacion(validate);
      return;
    }
    setValidacion(validate);

    if (unidadesVenta.length === 0) {
      unidadesVenta.push(unidadVentaXDefecto);
    } else {
      const unidadxdefecto = unidadesVenta.filter(
        (unidades) => unidades.default
      );
      if (unidadxdefecto.length === 0) unidadesVenta.push(unidadVentaXDefecto);
    }

    precios.precios_producto = preciosP;

    let imagenes_without_aws = imagenes;
    if (accion) {
      imagenes_without_aws = imagenes.filter((res) => !res.key_imagen);
    }

    let input = {
      datos_generales: await validateJsonEdit(
        datos_generales,
        "datos_generales"
      ),
      precios,
      imagenes: imagenes_without_aws,
      imagenes_eliminadas,
      almacen_inicial,
      centro_de_costos,
      unidades_de_venta: await validateJsonEdit(
        unidadesVenta,
        "unidades_de_venta"
      ),
      presentaciones,
      presentaciones_eliminadas,
      precio_plazos: preciosPlazos,
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      usuario: sesion._id,
    };

    setLoading(true);
    try {
      if (accion) {
        const result = await actualizarProducto({
          variables: {
            input,
            id: datos._id,
          },
        });
        setAlert({
          message: `¡Listo! ${result.data.actualizarProducto.message}`,
          status: "success",
          open: true,
        });
      } else {
        const result = await crearProducto({
          variables: {
            input,
          },
        });
        setAlert({
          message: `¡Listo! ${result.data.crearProducto.message}`,
          status: "success",
          open: true,
        });
      }
      productosRefetch();
      setLoading(false);
      toggleModal();
    } catch (error) {
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      setLoading(false);
    }
  };

  const validateJsonEdit = async (data, tipo) => {
    if (tipo === "datos_generales") {
      let object_date = {
        clave_alterna: data.clave_alterna,
        tipo_producto: data.tipo_producto,
        nombre_comercial: data.nombre_comercial,
        nombre_generico: data.nombre_generico,
        receta_farmacia: data.receta_farmacia,
      };
      if (data.codigo_barras !== null && data.codigo_barras !== "")
        object_date = { ...object_date, codigo_barras: data.codigo_barras };
      if (data.descripcion !== null && data.descripcion !== "")
        object_date = { ...object_date, descripcion: data.descripcion };
      if (data.id_categoria !== null && data.id_categoria !== "")
        object_date = { ...object_date, id_categoria: data.id_categoria };
      if (data.categoria !== null && data.categoria !== "")
        object_date = { ...object_date, categoria: data.categoria };
      if (data.subcategoria !== null && data.subcategoria !== "")
        object_date = { ...object_date, subcategoria: data.subcategoria };
      if (data.id_subcategoria !== null && data.id_subcategoria !== "")
        object_date = { ...object_date, id_subcategoria: data.id_subcategoria };
      if (data.id_departamento !== null && data.id_departamento !== "")
        object_date = { ...object_date, id_departamento: data.id_departamento };
      if (data.departamento !== null && data.departamento !== "")
        object_date = { ...object_date, departamento: data.departamento };
      if (data.id_marca !== null && data.id_marca !== "")
        object_date = { ...object_date, id_marca: data.id_marca };
      if (data.marca !== null && data.marca !== "")
        object_date = { ...object_date, marca: data.marca };
      if (data.clave_producto_sat !== null && data.clave_producto_sat !== "")
        object_date = {
          ...object_date,
          clave_producto_sat: data.clave_producto_sat,
        };
      return object_date;
    } else if (tipo === "unidades_de_venta") {
      let end_array = [];
      for (var i = 0; i < data.length; i++) {
        let object = {
          _id: data[i]._id,
          cantidad: data[i].cantidad,
          id_producto: data[i].id_producto,
          precio: data[i].precio,
          unidad_principal: data[i].unidad_principal,
          unidad: data[i].unidad,
        };
        if (data[i].codigo_barras !== null && data[i].codigo_barras !== "")
          object = { ...object, codigo_barras: data[i].codigo_barras };
        if (data[i].default !== null && data[i].default !== "")
          object = { ...object, default: data[i].default };
        end_array.push(object);
      }
      return end_array;
    }
  };

  /* ###### RESET STATES ###### */
  const resetInitialStates = () => {
    setDatosGenerales(initial_state_datos_generales);
    setPrecios(initial_state_precios);
    setUnidadVentaXDefecto(initial_state_unidadVentaXDefecto);
    setPreciosP(initial_state_preciosP);
    setUnidadesVenta([]);
    setAlmacenInicial(initial_state_almacen_inicial);
    setCentroDeCostos({});
    setPreciosPlazos(initial_state_preciosPlazos);
    setSubcategorias([]);
    setImagenes([]);
    setOnPreview({ index: "", image: "" });
    setValidacion({ error: false, message: "" });
    setSubcostos([]);
    setImagenesEliminadas([]);
    setPresentaciones([]);
    setPresentacionesEliminadas([]);
    setValue(0);
  };

  /* SET STATES WHEN UPDATING */
  const setInitialStates = (producto) => {
    const { precios_producto, ...new_precios } = producto.precios;
    const unidadxdefecto = producto.unidades_de_venta.filter(
      (res) => res.default
    );

    setDatosGenerales(producto.datos_generales);
    setPrecios(new_precios);
    setCentroDeCostos(
      producto.centro_de_costos
        ? producto.centro_de_costos
        : initial_state_centro_de_costos
    );
    setImagenes(producto.imagenes);
    setPreciosPlazos(producto.precio_plazos);
    setUnidadesVenta(producto.unidades_de_venta);
    setPreciosP(producto.precios.precios_producto);
    setUnidadVentaXDefecto(unidadxdefecto[0]);
    setPresentaciones(
      producto.medidas_producto ? producto.medidas_producto : []
    );
  };

  function funcion_tecla(event) {
    const { keyCode } = event;
    if (keyCode === 114) {
      document.getElementById("modal-registro-product").click();
    }
  } /* CODIGO PARA PODER EJECUTAR LAS VENTANAS A BASE DE LAS TECLAS */

  window.onkeydown = funcion_tecla;

  const saveButton = (
    <Button
      variant="contained"
      color="primary"
      onClick={() => saveData()}
      size="large"
      startIcon={<DoneIcon />}
      disabled={
        !datos_generales.clave_alterna ||
        !datos_generales.tipo_producto ||
        !datos_generales.nombre_generico ||
        !datos_generales.nombre_comercial ||
        !precios.precio_de_compra.precio_con_impuesto ||
        !precios.precio_de_compra.precio_sin_impuesto ||
        !precios.unidad_de_compra.cantidad
          ? true
          : false
      }
    >
      Guardar
    </Button>
  );

  const ButtonActions = () => {
    if (!accion && value === 5) {
      return saveButton;
    } else if (accion && tipo === "OTROS" && value === 5) {
      return saveButton;
    } else if (accion && tipo !== "OTROS" && value === 6) {
      return saveButton;
    } else {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setValue(value + 1)}
          size="large"
          endIcon={<NavigateNext />}
          disableElevation
        >
          Siguiente
        </Button>
      );
    }
  };

  return (
    <Fragment>
      {/* <SnackBarMessages alert={alert} setAlert={setAlert} /> */}

      {!accion ? (
        fromCompra ? (
          <Button
            color="primary"
            onClick={() => toggleModal()}
            startIcon={<Add />}
            size="large"
          >
            Registrar nuevo producto
          </Button>
        ) : (
          <Button
            id="modal-registro-product"
            color="primary"
            variant="contained"
            size="large"
            onClick={() => toggleModal()}
            startIcon={<Add />}
          >
            Nuevo producto
          </Button>
        )
      ) : (
        <IconButton
          color="default"
          variant="contained"
          onClick={() => toggleModal(datos)}
        >
          <Edit />
        </IconButton>
      )}
      <Dialog
        open={open}
        onClose={toggleModal}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        disableEscapeKeyDown
        disableBackdropClick
      >
        <AppBar position="static" color="default" elevation={0}>
          <Box display="flex" justifyContent="space-between">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
              aria-label="scrollable force tabs example"
            >
              <Tab
                label="Datos generales"
                icon={
                  <Badge
                    color="secondary"
                    badgeContent={<Typography variant="h6">!</Typography>}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    invisible={
                      validacion.error && validacion.vista1 ? false : true
                    }
                  >
                    <img
                      src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/portapapeles.svg"
                      alt="icono registro"
                      className={classes.iconSvg}
                    />
                  </Badge>
                }
                {...a11yProps(0)}
              />
              <Tab
                label="Precios de venta"
                icon={
                  <Badge
                    color="secondary"
                    badgeContent={<Typography variant="h6">!</Typography>}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    invisible={
                      validacion.error && validacion.vista2 ? false : true
                    }
                  >
                    <img
                      src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/etiqueta-de-precio.svg"
                      alt="icono venta"
                      className={classes.iconSvg}
                    />
                  </Badge>
                }
                {...a11yProps(1)}
              />
              <Tab
                label="Inventario y almacen"
                icon={
                  <Badge
                    color="secondary"
                    badgeContent={<Typography variant="h6">!</Typography>}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    invisible={
                      validacion.error && validacion.vista3 ? false : true
                    }
                  >
                    <img
                      src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/tarea-completada.svg"
                      alt="icono almacen"
                      className={classes.iconSvg}
                    />
                  </Badge>
                }
                {...a11yProps(2)}
              />
              <Tab
                label="Centro de costos"
                icon={
                  <img
                    src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/costos.svg"
                    alt="icono almacen"
                    className={classes.iconSvg}
                  />
                }
                {...a11yProps(3)}
              />
              <Tab
                label="Precios a plazos"
                icon={
                  <img
                    src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/calendar.svg"
                    alt="icono almacen"
                    className={classes.iconSvg}
                  />
                }
                {...a11yProps(4)}
              />
              <Tab
                label="Imagenes"
                icon={
                  <img
                    src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/imagenes.svg"
                    alt="icono imagenes"
                    className={classes.iconSvg}
                  />
                }
                {...a11yProps(5)}
              />
              {accion ? (
                datos_generales.tipo_producto !== "OTROS" ? (
                  <Tab
                    label="Tallas y colores"
                    icon={
                      <Badge
                        color="secondary"
                        badgeContent={<Typography variant="h6">!</Typography>}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        invisible={
                          validacion.error && validacion.vista7 ? false : true
                        }
                      >
                        <img
                          src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/tallas-colores.svg"
                          alt="icono colores"
                          className={classes.iconSvg}
                        />
                      </Badge>
                    }
                    {...a11yProps(6)}
                  />
                ) : null
              ) : null}
            </Tabs>
            {/* <Box m={1}>
							<Button variant="contained" color="secondary" onClick={() => toggleModal()} size="large">
								<CloseIcon />
							</Button>
						</Box> */}
          </Box>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <ContenidoModal value={value} datos={datos} />
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setValue(value - 1)}
            size="large"
            startIcon={<NavigateBefore />}
            disabled={value === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => toggleModal()}
            size="large"
            startIcon={<Close />}
            disableElevation
          >
            Cancelar
          </Button>
          <ButtonActions />
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

const ContenidoModal = ({ value, datos }) => {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CONSULTAS, {
    variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
  });

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );

  if (error) return <ErrorPage error={error} />;

  const { obtenerConsultasProducto } = data;

  return (
    <div className={classes.root}>
      <TabPanel value={value} index={0}>
        <RegistroInfoGenerales
          obtenerConsultasProducto={obtenerConsultasProducto}
          refetch={refetch}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RegistroInfoAdidional />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RegistroAlmacenInicial
          obtenerConsultasProducto={obtenerConsultasProducto}
          refetch={refetch}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CentroCostos
          obtenerConsultasProducto={obtenerConsultasProducto}
          refetch={refetch}
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <PrecioPlazos />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <CargarImagenesProducto />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <ColoresTallas
          obtenerConsultasProducto={obtenerConsultasProducto}
          refetch={refetch}
          datos={datos}
        />
      </TabPanel>
    </div>
  );
};
