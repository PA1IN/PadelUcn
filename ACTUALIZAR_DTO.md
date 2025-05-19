# Instrucciones para Actualizar CreateHistorialReservaDto

El error que estás experimentando se debe a que hay un desajuste entre los estados permitidos en la validación de `CreateHistorialReservaDto` y los estados que realmente se usan en el código, incluyendo `PAGADO` y `NO_PAGADO`.

## Problema

Cuando se implementó el sistema de pagos, se añadieron dos nuevos estados (`PAGADO` y `NO_PAGADO`) para el historial de reservas, pero estos no se incluyeron en la validación de `CreateHistorialReservaDto`.

## Archivo a Modificar

Archivo: `backend/ingeso-back/src/modulos/reserva/historial-reserva/dto/create-historial-reserva.dto.ts`

## Cambio Necesario

Busca este código:

```typescript
export class CreateHistorialReservaDto {
  @IsNotEmpty()
  @IsEnum(['Cancelado', 'Modificado', 'Completado', 'Pendiente'], {
    message: 'El estado debe ser: Cancelado, Modificado, Completado o Pendiente'
  })
  estado: string;
  
  // Resto del código...
}
```

Y reemplázalo con:

```typescript
export class CreateHistorialReservaDto {
  @IsNotEmpty()
  @IsEnum(['Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'], {
    message: 'El estado debe ser: Cancelado, Modificado, Completado, Pendiente, PAGADO o NO_PAGADO'
  })
  estado: string;
  
  // Resto del código...
}
```

## Actualización de Documentación

También debes actualizar la documentación de la API para incluir estos nuevos estados:

Archivo: `API_ENDPOINTS.md`

Busca la sección "Estados del historial de reservas" y asegúrate de que incluya `PAGADO` y `NO_PAGADO` en la lista de estados posibles.

## Reconstruir el Proyecto

Después de hacer estos cambios, necesitarás reconstruir el backend:

```powershell
docker-compose down
docker-compose build padelucn-backend
docker-compose up -d
```
