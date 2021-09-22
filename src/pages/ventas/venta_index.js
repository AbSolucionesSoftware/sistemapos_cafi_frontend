import React from 'react'
import VentasGenerales from './VentasGenerales';
import { VentasProvider } from '../../context/Ventas/ventasGeneralesContext';

export default function venta_index() {
    return (
        <VentasProvider>
            <VentasGenerales />
        </VentasProvider>
    )
}
