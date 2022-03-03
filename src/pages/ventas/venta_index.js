import React, { useContext, useEffect, useState } from "react";
import VentasGenerales from "./VentasGenerales";
import { ClienteProvider } from "../../context/Catalogos/crearClienteCtx";
import AbrirTurno from "../ventas/AbrirCerrarTurno/AbrirTurno";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { VentasContext } from "../../context/Ventas/ventasContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VentaIndex() {
  const { turnoActivo, setTurnoActivo } = useContext(VentasContext);
  const [varActive, setVarActive] = useState(false);
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  useEffect(() => {
    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
    setVarActive(sesion.turno_en_caja_activo);
    setTurnoActivo(false);
  }, [turnoActivo]);

  return (
    <ClienteProvider>
      <Box height="100%">
        {varActive === true && turnoEnCurso ? (
          <VentasGenerales />
        ) : (
          <AbrirTurnoEnVentas />
        )}
      </Box>
    </ClienteProvider>
  );
}

function AbrirTurnoEnVentas() {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      keepMounted
      TransitionComponent={Transition}
      disableEscapeKeyDown={false}
    >
      <Box p={2} textAlign="center">
        <Typography variant="h6">
          Si deseas realizar ventas inicia tu turno primeramente.
        </Typography>
      </Box>
      <AbrirTurno type="FRENTE" setLoading={setLoading} loading={loading} />
    </Dialog>
  );
}
