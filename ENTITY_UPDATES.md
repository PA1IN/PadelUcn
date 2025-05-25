# Entity Updates for PadelUcn Restructuring

## Summary of Changes

As part of the database restructuring project, we've made the following updates to align our entity models with the new database schema:

### Database Schema Changes
- Removed the `admin` table
- Renamed `user` table to `usuario` and added `is_admin` flag
- Added `historial_reserva` table for tracking reservation history
- Added `mantenimiento` field to `cancha` table

### Entity Updates

1. **User Entity**
   - Mapped to `usuario` table
   - Added `isAdmin` flag 
   - Added relation to `HistorialReserva` entity
   - Removed relation to `BoletaEquipamiento` entity (no longer applicable)

2. **Reserva Entity**
   - Fixed duplicate `boletas` property
   - Updated property names to match database column names
   - Added relation to `HistorialReserva` entity

3. **HistorialReserva Entity**
   - Created new entity to track reservation history
   - Set up relations to `User` and `Reserva` entities

4. **Cancha Entity**
   - Added `mantenimiento` boolean field
   - Ensured all column mappings match the database schema

5. **Equipamiento Entity**
   - Updated all columns to be non-nullable where appropriate

6. **BoletaEquipamiento Entity**
   - Removed relation to `User` entity (no longer applicable)
   - Updated nullable constraints to match database schema

### Service Updates

Updated all service files to use the correct property names for queries:
- Changed `id_equipamiento` to `id` in `EquipamientoService`
- Changed `id_reserva` to `id` in `ReservaService`
- Changed `id_boleta` to `id` in `BoletaEquipamientoService`
- Ensured all relation properties use the correct field names

## Testing Instructions

1. Start the application with:
   ```powershell
   cd c:\Users\manue\OneDrive\Documentos\repo1\PadelUcn
   docker-compose up -d
   ```

2. Verify that the API endpoints work correctly with the new database schema by testing:
   - User authentication
   - Court reservation creation and management
   - Equipment rental
   - Admin functionality through the `isAdmin` flag

## Notes

- The database schema migration script (`database-schema-new.sql`) should be run before starting the application
- Sample data for testing is available in `sample-data-new.sql`
- The application has been configured to not automatically synchronize with the database (`synchronize: false` in `app.module.ts`)
