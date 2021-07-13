import React, { useState } from 'react';
import { EmpresaProvider } from '../../../context/Catalogos/empresaContext';
import MiEmpresa from './MiEmpresa';

export default function Empresa() {
    return(
        <div>
            <EmpresaProvider>
                <MiEmpresa/>
            </EmpresaProvider>
        </div>
    )
}