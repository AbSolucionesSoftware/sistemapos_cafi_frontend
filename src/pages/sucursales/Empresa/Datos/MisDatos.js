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
import { EmpresaContext } from "../../../../context/Catalogos/empresaContext";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import ErrorPage from "../../../../components/ErrorPage";
import {
  ACTUALIZAR_EMPRESA,
  OBTENER_DATOS_EMPRESA,
} from "../../../../gql/Empresa/empresa";
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

export default function MisDatos() {
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
  const { empresa, update, setEmpresa, setUpdate } = useContext(EmpresaContext);

  const [actualizarEmpresa] = useMutation(ACTUALIZAR_EMPRESA);

  /* Queries */
  const { loading, data, refetch, error } = useQuery(OBTENER_DATOS_EMPRESA, {
    variables: { id: sesion.empresa._id },
  });

  const [empresaDatos, setEmpresaDatos] = useState({
    nombre_empresa: "",
    nombre_dueno: "",
    telefono_dueno: "",
    celular: "",
    correo_empresa: "",
    nombre_fiscal: "",
    rfc: "",
    regimen_fiscal: "",
    curp: "",
    info_adicio: "",
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
    },
    direccionFiscal: {
      calle: "",
      no_ext: "",
      no_int: "",
      codigo_postal: "",
      colonia: "",
      municipio: "",
      localidad: "",
      estado: "",
      pais: "",
    },
    datosBancarios: {
      cuenta: "",
      sucursal: "",
      clave_banco: "",
    },
    imagen: null,
  });
  useEffect(() => {
    try {
      refetch();
    } catch (errorCatch) {
      // console.log("SESSIONREFECTUPDATE",errorCatch)
    }
  }, [update, refetch]);
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
        setEmpresa(data.obtenerEmpresa);
      }
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [data, setEmpresa]);
  useEffect(() => {
    try {
      setErrorPage(error);
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [error]);
  useEffect(() => {
    try {
      setEmpresaDatos({
        nombre_empresa: empresa.nombre_empresa,
        nombre_dueno: empresa.nombre_dueno,
        telefono_dueno: empresa.telefono_dueno,
        celular: empresa.celular,
        correo_empresa: empresa.correo_empresa,
        direccion: empresa.direccion,
        imagen: empresa.imagen,
      });
    } catch (errorCatch) {
      // console.log(errorCatch)
    }
  }, [empresa]);

  const actEmp = async () => {
    try {
      setLoadingPage(true);
      /* const input = cleanTypenames(empresaDatos); */
      await actualizarEmpresa({
        variables: {
          id: sesion.empresa._id,
          input: empresaDatos,
        },
      });
      setUpdate(true);
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
    setEmpresaDatos({
      ...empresaDatos,
      [e.target.name]: e.target.value,
    });
  };
  const obtenerCamposDireccion = (e) => {
    setEmpresaDatos({
      ...empresaDatos,
      direccion: { ...empresaDatos.direccion, [e.target.name]: e.target.value },
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
      setEmpresaDatos({
        ...empresaDatos,
        imagen: acceptedFiles[0],
      });
    },
    [empresaDatos, setEmpresaDatos]
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
          Datos de empresa
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
                <Grid item md={2}>
                  <Box className={classes.avatarContainer} {...getRootProps()}>
                    <input {...getInputProps()} />
                    {preview ? (
                      <Avatar className={classes.avatar} src={`${preview}`} />
                    ) : (
                      <Avatar
                        className={classes.avatar}
                        src={`${empresa.imagen}`}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item md={4}>
                  <Box>
                    <Typography>
                      <span>* </span>Nombre de empresa
                    </Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      type="text"
                      size="small"
                      error={errorForm.error && !empresaDatos.nombre_empresa}
                      name="nombre_empresa"
                      variant="outlined"
                      value={
                        empresaDatos.nombre_empresa
                          ? empresaDatos.nombre_empresa
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
                      <span>* </span>Nombre dueño
                    </Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      type="text"
                      size="small"
                      error={errorForm.error && !empresaDatos.nombre_dueno}
                      name="nombre_dueno"
                      variant="outlined"
                      value={
                        empresaDatos.nombre_dueno
                          ? empresaDatos.nombre_dueno
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
                    <Typography>Teléfono</Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      size="small"
                      name="telefono_dueno"
                      variant="outlined"
                      value={
                        empresaDatos.telefono_dueno
                          ? empresaDatos.telefono_dueno
                          : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Box>
                </Grid>
                <Grid item md={4}>
                  <Box>
                    <Typography>Celular</Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      size="small"
                      name="celular"
                      variant="outlined"
                      value={empresaDatos.celular ? empresaDatos.celular : ""}
                      onChange={obtenerCampos}
                    />
                  </Box>
                  <Box>
                    <Typography>E-mail</Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      size="small"
                      name="correo_empresa"
                      variant="outlined"
                      value={
                        empresaDatos.correo_empresa
                          ? empresaDatos.correo_empresa
                          : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box mt={5}>
                <Typography className={classes.subtitle}>
                  <b>Domicilio empresa</b>
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
                        empresaDatos.direccion.calle
                          ? empresaDatos.direccion.calle
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
                        empresaDatos.direccion.no_ext
                          ? empresaDatos.direccion.no_ext
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
                        empresaDatos.direccion.no_int
                          ? empresaDatos.direccion.no_int
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
                        empresaDatos.direccion.codigo_postal
                          ? empresaDatos.direccion.codigo_postal
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
                        empresaDatos.direccion.colonia
                          ? empresaDatos.direccion.colonia
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
                        empresaDatos.direccion.municipio
                          ? empresaDatos.direccion.municipio
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
                        empresaDatos.direccion.localidad
                          ? empresaDatos.direccion.localidad
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
                        empresaDatos.direccion.estado
                          ? empresaDatos.direccion.estado
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
                        empresaDatos.direccion.pais
                          ? empresaDatos.direccion.pais
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
