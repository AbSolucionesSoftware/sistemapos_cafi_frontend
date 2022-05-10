import React,{useState, useContext, useEffect} from 'react';
import { Box, Grid, makeStyles, Typography, TextField, IconButton } from '@material-ui/core';
import HistoryIcon from '@material-ui/icons/History';
import DetailsIcon from '@material-ui/icons/Details';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import {
	formatoFechaCorta,
    formatoMexico
  } from "../../../../../../../config/reuserFunctions";
import DetalleVentaCredito from './DetalleVentaCredito';
import HistorialAbonos from './HistorialAbonos';
import IconLiquidar from '../Liquidar';
import {AbonosCtx} from "../../../../../../../context/Tesoreria/abonosCtx";

const useStyles = makeStyles({
    root: {
      minWidth: 332,
      maxWidth: 332,
      height: 260,
      maxHeight: 260,  
    },
    content:{
      height: 200,
      
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 16,
    },
    pos: {
      marginBottom: 12,
    },
  });

export default function CardVenta(props){
    
    const classes = useStyles();
    const datos = props.datos;
    const abonos = props.datos.abonos;
    const [openDetalle, setOpenDetalle] = useState(false);
    const [openHistorial, setOpenHistorial] = useState(false);
 
    const[cantidad, setCantidad] = useState(0)
   
   /*  const enviarDatos = (e) =>{
        let abonosHere = abonos;
        if(e.target.value <= datos.saldo_credito_pendiente && e.target.value >= 0){
            setCantidad( e.target.value);
           
            let exist = false;
        
            abonosHere.forEach((abono, index) => {
                if (abono.idVenta === datos._id) {
                    if(e.target.value === '0'){
                        abonosHere.splice(index,1)
                    }else{
                        abono.cantidad_abonar = e.target.value;
                    }
                    exist = true;
                }      
            });
            if(!exist){
                abonosHere.push({idVenta: datos._id, cantidad_abonar:e.target.value});
            }
        }    
        setAbonos(abonosHere);
    }; */
    const toSetCantidad =  (cantidad) =>{
        if(cantidad >= 0 && cantidad <= datos.saldo_credito_pendiente ){
            setCantidad(cantidad);
            props.enviarCantidad(cantidad, props.index, datos._id);
        }
        
    }
    return(
    <Box
        sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'stretch',
       
        p: 1,
        m: 1,
        }}
    >
        <Card className={classes.root}>
        <CardContent className={classes.content}>
           
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between">
                <Typography className={classes.title} color="textSecondary" >
                    <b>Fecha de venta </b>
                </Typography>
                <Typography className={classes.title} color="textSecondary" >
                {` ${formatoFechaCorta(datos.fecha_registro)}`}
                   
                </Typography>
            </Box>
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between">
                <Typography className={classes.title} color="textSecondary" >
                    <b>Folio </b>
                </Typography>
                <Typography className={classes.title} color="textSecondary" >
                    {datos.folio}
                </Typography>
            </Box>
            {
                (datos.abonos.length) ? 
                <Box display='flex' flexDirection="row" m={1}>
                    <Typography className={classes.title} color="textSecondary" >
                        <b>Último abono </b>
                        
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" >
                        {datos.abonos[datos.abonos.length].fecha_movimiento.completa}
                    </Typography>
                </Box>
                :
                <div/>

            }
          
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between" >
                <Typography className={classes.title} color="textSecondary" >
                    <b>Total venta </b>
                </Typography>
                <Typography className={classes.title} color="textSecondary" >
                   ${ formatoMexico(datos.total)}
                </Typography>
            </Box>
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between">
                <Typography className={classes.title} color="textSecondary" >
                    <b>Debe </b>
                </Typography>
                <Typography className={classes.title} color="textSecondary"  ml={2} >
                    ${ formatoMexico(datos.saldo_credito_pendiente)}
                </Typography>
            </Box>
            <Box display='flex' flexDirection="row" m={1} justifyContent="space-between">
                <Typography style={{marginTop:5, marginRight:10}}>
                    <b>Abono </b>
                </Typography>
                <TextField
                    style={{width:'45%', marginLeft:15}}
                    type="number"
                    size="small"
                    variant="outlined"
                    onChange={ (e) => toSetCantidad(e.target.value)} 
                    value={cantidad}
                />
            </Box>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
            <Tooltip title="Liquidar venta">
               <IconLiquidar isIcon={true}  cliente={props.selectedClient} total_ventas={datos.saldo_credito_pendiente} empresa={props.empresa._id} sucursal={props.sucursal._id} setAlert={props.setAlert}/>
            </Tooltip>    
            <Tooltip title="Historial abonos">
            <IconButton aria-label="historial" onClick={() =>setOpenHistorial(true)} >
                <HistoryIcon />   
            </IconButton>
            </Tooltip>    
            <Tooltip title="Detalles de venta">
            <IconButton aria-label="detalle" onClick={() => setOpenDetalle(true)} >
                <DetailsIcon />   
            </IconButton>
            </Tooltip>    
            
        </CardActions>
        </Card>
        <DetalleVentaCredito openDetalle ={openDetalle} setOpenDetalle={setOpenDetalle} datos={datos} />
        <HistorialAbonos openHistorial ={openHistorial} setOpenHistorial={setOpenHistorial} historialAbonos={abonos} />
    </Box>
    )
}