import React, { useContext, useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  TextField,
  Button,
  Dialog,
  Avatar,
  DialogContent,
  Container,
} from "@material-ui/core";
import {
  Slide,
  Typography,
  Toolbar,
  AppBar,
  Divider,
  DialogActions,
} from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@material-ui/icons/Close";
import { FcNook } from "react-icons/fc";
import { useMutation, useQuery } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import ErrorPage from "../../../../components/ErrorPage";
import {
  OBTENER_DATOS_SUCURSAL, ACTUALIZAR_SUCURSAL
} from "../../../../gql/Empresa/sucursales";
import { cleanTypenames } from "../../../../config/reuserFunctions";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    fontSize: 100,
  },
  subtitle: {
    marginLeft: "10px",
    width: "100%",
  },
  require: {
    "& span": {
      color: "red",
    },
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    border: "dashed 2px black",
    borderRadius: "100%",
  },
  avatar: {
    width: "90%",
    height: "90%",
    "& > .icon": {
      fontSize: 100,
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DatosSucursal() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();
  const [loadingPage, setLoadingPage] = React.useState(false);
  const [bloqueo] = useState(
    sesion.accesos.mi_empresa.datos_empresa.editar === false ? true : false
  );
  const [preview, setPreview] = useState("");
  const [open, setOpen] = React.useState(false);
  const [errorPage, setErrorPage] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState(
    useState({ error: false, message: "" })
  );

  const [alert, setAlert] = useState({ message: "", status: "", open: false });
 

  const [actualizarSucursal] = useMutation(ACTUALIZAR_SUCURSAL);

  /* Queries */
  const { loading, data, refetch, error } = useQuery(OBTENER_DATOS_SUCURSAL, {
    variables: { id: sesion.sucursal._id },
  });

  const [sucursalDatos, setSucursalDatos] = useState({
    nombre_sucursal: "",
    descripcion: "",
    telefono:"",
    direccion: {
      calle: "",
      no_ext: "",
      no_int: "",
      codigo_postal: "",
      colonia: "",
      municipio: "",
      localidad: "",
      estado: "",
      pais: "",
    }    
  });
  
  useEffect(() => {
    try {
      refetch();
    } catch (errorCatch) {
      // console.log("SESSIONREFECTUPDATE",errorCatch)
    }
  },  [refetch]);
  useEffect(() => {
    try {
      setLoadingPage(loading);
    } catch (errorCatch) {
      // console.log("SESSIONREFECTUPDATE",errorCatch)
    }
  }, [loading]);
  useEffect(() => {
    try {
      if (data !== undefined) {
        
        setSucursalDatos(data.obtenerDatosSucursal[0]);
      }
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [data, setSucursalDatos]);
  useEffect(() => {
    try {
      setErrorPage(error);
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [error]);
  

  const actEmp = async () => {
    try {
      setLoadingPage(true);
      /* const input = cleanTypenames(empresaDatos); */
      await actualizarSucursal({
        variables: {
          id: sesion.empresa._id,
          input: sucursalDatos,
        },
      });
     
      setLoadingPage(false);
      setAlert({
        message: "Se han actualizado correctamente los datos.",
        status: "success",
        open: true,
      });
      setErrorForm(false);
    } catch (errorCatch) {
      console.log(errorCatch);
      if (errorCatch.networkError) {
        console.log(errorCatch.networkError.result);
      } else if (errorCatch.graphQLErrors) {
        console.log(errorCatch.graphQLErrors);
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoadingPage(false);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const obtenerCampos = (e) => {
    setSucursalDatos({
      ...sucursalDatos,
      [e.target.name]: e.target.value,
    });
  };
  const obtenerCamposDireccion = (e) => {
    setSucursalDatos({
      ...sucursalDatos,
      direccion: { ...sucursalDatos.direccion, [e.target.name]: e.target.value },
    });
  };

  //dropzone
  const onDrop = useCallback(
    (acceptedFiles) => {
      let reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onload = function () {
        let image = reader.result;
        setPreview(image);
      };
      setSucursalDatos({
        ...sucursalDatos,
        imagen: acceptedFiles[0],
      });
    },
    [sucursalDatos, setSucursalDatos]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FcNook className={classes.icon} />
          </Box>
          Datos de sucursal
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <BackdropComponent loading={loadingPage} setLoading={setLoadingPage} />

        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Datos
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {errorPage ? (
            <ErrorPage error={errorPage} />
          ) : (
            <Container style={{ marginTop: 8 }}>
              <Grid container spacing={3} className={classes.require}>
              
                <Grid item md={4} flexdirection='row'>
                  <Box>
                    <Typography>
                      <span>* </span>Nombre de empresa
                    </Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      type="text"
                      size="small"
                      error={errorForm.error && !sucursalDatos.nombre_sucursal}
                      name="nombre_empresa"
                      variant="outlined"
                      value={
                        sucursalDatos.nombre_sucursal
                          ? sucursalDatos.nombre_sucursal
                          : ""
                      }
                      helperText={
                        errorForm.error &&
                        errorForm.message !== "El campo nombre es obligatorio"
                          ? errorForm.message
                          : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      Descripción
                    </Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      type="text"
                      size="small"
                      error={errorForm.error && !sucursalDatos.descripcion}
                      name="nombre_dueno"
                      variant="outlined"
                      value={
                        sucursalDatos.descripcion
                          ? sucursalDatos.descripcion
                          : ""
                      }
                      helperText={
                        errorForm.error &&
                        errorForm.message !== "El campo nombre es obligatorio"
                          ? errorForm.message
                          : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Box>
                 {/*  <Box>
                    <Typography>Teléfono</Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      size="small"
                      name="telefono_dueno"
                      variant="outlined"
                      value={
                        sucursalDatos.telefono_dueno
                          ? sucursalDatos.telefono_dueno
                          : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Box> */}
                </Grid>
                
              </Grid>

              <Box mt={5}>
                <Typography className={classes.subtitle}>
                  <b>Domicilio</b>
                </Typography>
                <Divider />
              </Box>
              <Grid container spacing={3} className={classes.require}>
                <Grid item md={4}>
                  <Box>
                    <Typography>Calle</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="calle"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.calle
                          ? sucursalDatos.direccion.calle
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>Num. Ext</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="no_ext"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.no_ext
                          ? sucursalDatos.direccion.no_ext
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>Num. Int</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="no_int"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.no_int
                          ? sucursalDatos.direccion.no_int
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                </Grid>
                <Grid item md={4}>
                  <Box>
                    <Typography>C.P. </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="codigo_postal"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.codigo_postal
                          ? sucursalDatos.direccion.codigo_postal
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>Colonia</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="colonia"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.colonia
                          ? sucursalDatos.direccion.colonia
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>Municipio</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="municipio"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.municipio
                          ? sucursalDatos.direccion.municipio
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                </Grid>
                <Grid item md={4}>
                  <Box>
                    <Typography>Localidad</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="localidad"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.localidad
                          ? sucursalDatos.direccion.localidad
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>Estado</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="estado"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.estado
                          ? sucursalDatos.direccion.estado
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>Pais</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="pais"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.pais
                          ? sucursalDatos.direccion.pais
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Container>
          )}
        </DialogContent>
        {sesion.accesos.mi_empresa.datos_empresa.editar === false ? null : (
          <DialogActions style={{ justifyContent: "center" }}>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => actEmp()}
              color="primary"
              variant="contained"
              autoFocus
            >
              Guardar
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
