import React from 'react'
import VentasGenerales from './VentasGenerales';
import { ClienteProvider } from '../../context/Catalogos/crearClienteCtx';

export default function venta_index() {
    return (
        <ClienteProvider>
            <VentasGenerales />
        </ClienteProvider>
    )
}
