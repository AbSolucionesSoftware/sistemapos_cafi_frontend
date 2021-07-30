export default function validaciones(datos1, datos2) {
    /* si no hay datos1 y datos 2 */
    if (
        !datos1.clave_alterna ||
        !datos1.tipo_producto ||
        !datos1.nombre_generico ||
        !datos1.nombre_comercial
    ) {
        if (!datos2.precio_de_compra.precio_con_impuesto ||
            !datos2.precio_de_compra.precio_sin_impuesto ||
            !datos2.unidad_de_compra.cantidad) {
            return { error: true, message: 'Campo obligatorio', vista1: true, vista2: true };
        }
        return { error: true, message: 'Campo obligatorio', vista1: true };
    } else if (
        /* si solo hay datos1 */
        !datos2.precio_de_compra.precio_con_impuesto || !datos2.precio_de_compra.precio_sin_impuesto || !datos2.unidad_de_compra.cantidad
    ) {
        return { error: true, message: 'Campo obligatorio', vista2: true };
    } else if (
        /* si solo hay datos2 */
        !datos1.clave_alterna || !datos1.tipo_producto || !datos1.nombre_generico || !datos1.nombre_comercial
    ) {
        return { error: true, message: 'Campo obligatorio', vista1: true };
    } else {
        /* si hay todos los datos */
        return { error: false, message: '' };
    }




}