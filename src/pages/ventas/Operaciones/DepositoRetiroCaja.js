import React, { Fragment, useContext, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { OBTENER_CONTABILIDAD } from "../../../gql/Catalogos/contabilidad";
import {
  CREAR_HISTORIAL_CAJA,
  OBTENER_PRE_CORTE_CAJA,
} from "../../../gql/Cajas/cajas";
import useStyles from "../styles";
import moment from "moment";
import "moment/locale/es";
import { useMutation, useQuery } from "@apollo/client";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { Done } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DepositoRetiroCaja() {
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [CrearHistorialCaja] = useMutation(CREAR_HISTORIAL_CAJA);

  moment.locale("es");
  const classes = useStyles();

  const { setAlert } = useContext(VentasContext);
  const [open, setOpen] = useState(false);
  const [error_data, setError] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [datosMovimiento, setDatosMovimiento] = useState({
    tipo_movimiento: "DEPOSITO",
  });

  const { loading, data, error } = useQuery(OBTENER_CONTABILIDAD, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
  });

  const input = {
    horario_en_turno: "ABRIR TURNO",
    id_caja: turnoEnCurso ? turnoEnCurso.id_caja : "",
    id_usuario: sesion._id,
    token_turno_user: turnoEnCurso ? turnoEnCurso.token_turno_user : "",
  };

  const preCorteDeCaja = useQuery(OBTENER_PRE_CORTE_CAJA, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: input,
    },
  });

  const handleClickOpen = () => {
    setOpen(!open);
    preCorteDeCaja.refetch();
  };

  var dineroEnCaja = 0;

  if (!data || !preCorteDeCaja.data) {
    return <ComponenteSinConexion />;
  } else {
    dineroEnCaja =
      preCorteDeCaja.data.obtenerPreCorteCaja.monto_efectivo_precorte;
  }

  if (loading || error || preCorteDeCaja.loading || preCorteDeCaja.error)
    return <ComponenteSinConexion />;

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 68) {
      handleClickOpen();
    }
  }

  const obtenerDatos = (e) => {
    setDatosMovimiento({ ...datosMovimiento, [e.target.name]: e.target.value });
  };

  const enviarDatos = async () => {
    setCargando(true);
    try {
      if (!turnoEnCurso && sesion?.turno_en_caja_activo === false) {
        setCargando(false);
        setAlert({
          message: `Por el momento no hay ningun turno activo.`,
          status: "error",
          open: true,
        });
        return null;
      } else {
        if (
          !datosMovimiento.tipo_movimiento ||
          !datosMovimiento.monto_efectivo ||
          !datosMovimiento.concepto
        ) {
          setError(true);
          setCargando(false);
          setAlert({
            message: `Por favor complete los datos.`,
            status: "error",
            open: true,
          });
          return null;
        } else {
          if (
            datosMovimiento.tipo_movimiento === "RETIRO" &&
            dineroEnCaja < parseFloat(datosMovimiento.monto_efectivo)
          ) {
            setCargando(false);
            setAlert({
              message:
                "Lo sentimos no hay dinero suficiente en la caja para esta acción.",
              status: "error",
              open: true,
            });
            return null;
          }
          const input = {
            tipo_movimiento: datosMovimiento.tipo_movimiento,
            concepto: datosMovimiento.concepto,
            numero_caja: parseInt(turnoEnCurso.numero_caja),
            id_Caja: turnoEnCurso.id_caja,
            horario_turno: turnoEnCurso.horario_en_turno,
            rol_movimiento: "CAJA",
            hora_moviento: {
              hora: moment().format("hh"),
              minutos: moment().format("mm"),
              segundos: moment().format("ss"),
              completa: moment().format("HH:mm:ss"),
            },
            fecha_movimiento: {
              year: moment().format("YYYY"),
              mes: moment().format("DD"),
              dia: moment().format("MM"),
              no_semana_year: moment().week().toString(),
              no_dia_year: moment().dayOfYear().toString(),
              completa: moment().locale("es-mx").format(),
            },
            id_User: sesion._id,
            numero_usuario_creador: sesion.numero_usuario,
            nombre_usuario_creador: sesion.nombre,
            montos_en_caja: {
              monto_efectivo: {
                monto: parseFloat(datosMovimiento.monto_efectivo),
                metodo_pago: "01",
              },
              monto_tarjeta_debito: {
                monto: 0,
                metodo_pago: "28",
              },
              monto_tarjeta_credito: {
                monto: 0,
                metodo_pago: "04",
              },
              monto_creditos: {
                monto: 0,
                metodo_pago: "99",
              },
              monto_monedero: {
                monto: 0,
                metodo_pago: "05",
              },
              monto_transferencia: {
                monto: 0,
                metodo_pago: "03",
              },
              monto_cheques: {
                monto: 0,
                metodo_pago: "02",
              },
              monto_vales_despensa: {
                monto: 0,
                metodo_pago: "08",
              },
            },
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
          };
          await CrearHistorialCaja({
            variables: {
              empresa: sesion.empresa._id,
              sucursal: sesion.sucursal._id,
              input,
            },
          });
          setAlert({
            message: `Registro de movimiento exitoso.`,
            status: "success",
            open: true,
          });
          handleClickOpen();
          setCargando(false);
        }
      }
    } catch (error) {
      setCargando(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      handleClickOpen();
    }
  };

  const handleTipoMovimiento = (e, tipo_movimiento) => {
    setDatosMovimiento({ ...datosMovimiento, tipo_movimiento });
  };

  return (
    <>
      <Button
        onClick={() => {
          handleClickOpen();
        }}
        style={{ textTransform: "none", height: "100%", width: "100%" }}
        disabled={!turnoEnCurso}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register2.svg"
              alt="icono caja"
              style={{ width: 20 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Deposito/Retiro</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + D</b>
            </Typography>
          </Box>
        </Box>
      </Button>

      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClickOpen();
          }
        }}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Box display="flex" textAlign="center">
            <Box display="flex" justifyContent="center" flexGrow={1}>
              <Box>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register2.svg"
                  alt="icono caja"
                  className={classes.iconSizeDialogs}
                />
              </Box>
              <Box m={2}>
                <Divider orientation="vertical" />
              </Box>
              <Box mt={1}>
                <Box>
                  <Typography variant="h6">Deposito/Retiro Caja</Typography>
                </Box>
                <Box display="flex" textAlign="right">
                  <Box textAlign="right">
                    <Typography variant="caption">
                      {moment().format("MM/DD/YYYY")}
                    </Typography>
                  </Box>
                  <Box textAlign="right" ml={2}>
                    <Typography variant="caption">
                      <b>{moment().format("h:mm")} hrs.</b>
                    </Typography>
                  </Box>
                  <Box textAlign="right" ml={2}>
                    <Typography variant="caption">
                      <b>Caja: </b>
                      {turnoEnCurso?.numero_caja}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box ml={10} mb={7} display="flex" alignItems="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
                disabled={cargando}
              >
                <CloseIcon />
              </Button>
            </Box>
          </Box>
          <Box m={2}>
            {sesion.turno_en_caja_activo === true ? (
              <Fragment>
                <Box width="100%">
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="position"
                      name="position"
                      value={datosMovimiento.tipo_movimiento}
                      onChange={handleTipoMovimiento}
                    >
                      <FormControlLabel
                        value="DEPOSITO"
                        control={<Radio color="primary" />}
                        label="Deposito"
                      />
                      <FormControlLabel
                        value="RETIRO"
                        control={<Radio color="primary" />}
                        label="Retiro"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box width="100%">
                  <Typography>Monto:</Typography>
                  <Box display="flex">
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      name="monto_efectivo"
                      onChange={obtenerDatos}
                      id="form-producto-codigo-barras"
                      variant="outlined"
                      error={error_data && !datosMovimiento.monto_efectivo}
                    />
                  </Box>
                </Box>
                <Box width="100%">
                  <Typography>Concepto de Movimiento:</Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={error_data && !datosMovimiento.concepto}
                  >
                    <Select
                      id="form-producto-tipo"
                      onChange={obtenerDatos}
                      name="concepto"
                    >
                      <MenuItem value="">
                        <em>Selecciona uno</em>
                      </MenuItem>
                      {data?.obtenerContabilidad.map((concepto, index) => {
                        return (
                          <MenuItem key={index} value={concepto.nombre_servicio}>
                            {concepto.nombre_servicio}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </Fragment>
            ) : (
              <Box textAlign="center" p={2}>
                <Typography variant="h6">
                  <b>Por el momento no hay un turno en sesión</b>
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={enviarDatos}
            variant="contained"
            color="primary"
            size="large"
            disabled={cargando}
            startIcon={
              cargando ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Done />
              )
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const ComponenteSinConexion = () => {
  return (
    <Button
      disabled
      style={{
        textTransform: "none",
        height: "100%",
        width: "100%",
        pointerEvents: "none",
        opacity: 0.5,
      }}
    >
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register2.svg"
            alt="icono caja"
            style={{ width: 20 }}
          />
        </Box>
        <Typography variant="body2">
          <b>Deposito/Retiro</b>
        </Typography>
        <Typography variant="caption" style={{ color: "#808080" }}>
          <b>Alt + D</b>
        </Typography>
      </Box>
    </Button>
  );
};
