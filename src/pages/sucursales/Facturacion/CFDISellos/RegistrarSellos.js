import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close, CloudUpload, Done, Visibility, VisibilityOff } from "@material-ui/icons";
import SnackBarMessages from "../../../../components/SnackBarMessages";

export default function RegistroSellos() {
  const [open, setOpen] = useState(false);
  const [datos, setDatos] = useState({
    certificate: "",
    private_key: "",
    private_key_password: "",
  });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [show, setShow] = useState(false);
  const [ loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDatos({ certificate: "", private_key: "", private_key_password: "" });
  };

  const handleClickShowPassword = () => setShow(!show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const obtenerFiles = (e) => {
    const { name, files } = e.target;
    setDatos({
      ...datos,
      [name]: files[0],
    });
  };

  const obtenerDatos = (e) => {
    setDatos({
      ...datos,
      private_key_password: e.target.value,
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const guardarBD = () => {
    if( !datos.certificate || !datos.private_key || !datos.private_key_password) return
    let data = { ...datos };
    let cer = data.certificate;
    let key = data.private_key;
    getBase64(cer)
      .then((result) => {
        data.certificate = result;
      })
      .catch((err) => {
        console.log(err);
      });
    getBase64(key)
      .then((result) => {
        data.private_key = result;
      })
      .catch((err) => {
        console.log(err);
      });

    /* METER RFC */
    data.rfc = sesion.empresa.rfc;

    console.log(data);

    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        handleClose();
        /* refetch(); */
        /* message: `¡Listo! ${result.data.crearSerieCFDI.message}`, */
        setAlert({
          message: `¡Listo! `,
          status: "success",
          open: true,
        });
        
      }, 2000);
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      console.log(error);
      if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  return (
    <div>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={() => handleClickOpen()}
          color="primary"
          variant="contained"
          size="large"
        >
          Registrar sello CFDi
        </Button>
      </Box>
      <Dialog maxWidth="xs" fullWidth open={open} onClose={() => handleClose()}>
        <DialogTitle>Registrar sello digital</DialogTitle>
        <DialogContent>
          <Box mb={2}>
          {sesion.empresa.rfc ? (
            <Typography>{`RFC: ${sesion.empresa.rfc}`}</Typography>
          ) : 
          (<Typography color="error">*No tienes registrado un RFC</Typography>)}
          </Box>
          <Box width="100%">
            <Typography>
              Archivo *.cer <b>Certificado de Sello Digital</b>
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                value={datos.certificate ? datos.certificate.name : ""}
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="archivo-cer-sello-digital">
                        <Button
                          startIcon={<CloudUpload />}
                          color="primary"
                          component="span"
                          disableElevation
                        >
                          Upload
                        </Button>
                      </label>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
              <input
                accept=".cer"
                style={{ display: "none" }}
                id="archivo-cer-sello-digital"
                multiple
                type="file"
                name="certificate"
                onChange={obtenerFiles}
              />
            </Box>
          </Box>
          <Box width="100%" mt={2}>
            <Typography>
              Archivo *.key <b>Llave Privada de Sello Digital</b>
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                value={datos.private_key ? datos.private_key.name : ""}
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="archivo-key-llave_privada">
                        <Button
                          startIcon={<CloudUpload />}
                          color="primary"
                          component="span"
                          disableElevation
                        >
                          Upload
                        </Button>
                      </label>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
              <input
                accept=".key"
                style={{ display: "none" }}
                id="archivo-key-llave_privada"
                multiple
                type="file"
                name="private_key"
                onChange={obtenerFiles}
              />
            </Box>
          </Box>
          <Box width="100%" my={2}>
            <Typography>
              Contraseña de la llave <b>Privada de Sello Digital</b>
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                type={show ? 'text' : 'password'}
                size="small"
                variant="outlined"
                name="private_key_password"
                onChange={obtenerDatos}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {show ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            startIcon={<Close />}
            size="large"
            onClick={() => handleClose()}
          >
            Cancelar
          </Button>
          <Button
            startIcon={loading ? <CircularProgress size={20} /> : <Done />}
            color="primary"
            size="large"
            onClick={() => guardarBD()}
            disabled={loading || !sesion.empresa.rfc}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
