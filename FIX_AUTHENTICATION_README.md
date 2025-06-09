# Fix Authentication Issues - Change "contraseña" to "contrasena"

## Problem Description
Users were experiencing authentication issues with the error "Credenciales inválidas" when trying to log in. The root cause was identified as the special character "ñ" in the field name "contraseña", which was causing inconsistencies in handling between the backend code and the database.

## Solution
Change all occurrences of "contraseña" to "contrasena" (without the ñ character) throughout the codebase and database.

## Files Changed
1. Entity files:
   - `src/modulos/usuario/entities/usuario.entity.ts`: Changed column name from `contraseña` to `contrasena`

2. DTOs:
   - `src/modulos/auth/dto/auth.dto.ts`: Changed field name from `contraseña` to `contrasena`

3. Services:
   - `src/modulos/auth/auth.service.ts`: Updated references from `contraseña` to `contrasena`

4. Database Schema:
   - `database-schema-new.sql`: Updated column name
   - `esquemafinal.sql`: Updated column name

5. Utility Scripts:
   - `fix-passwords.js`, `fix-passwords-correct.js`, `fix-passwords-final.js`: Updated SQL queries
   - All password update scripts were updated to use "contrasena" instead of "contraseña"

## How to Apply Changes

### 1. Update Database Column Name
Run the following script to update the column name in the database:

```bash
node update-column-name.js
```

This will rename the column from "contraseña" to "contrasena" in the usuario table.

### 2. Rebuild the Backend Application
Rebuild the backend application to ensure all code changes are applied:

```bash
cd backend/ingeso-back
npm install
npm run build
```

### 3. Start the Application
Start the application to verify the changes:

```bash
npm run start:dev
```

### 4. Testing
Test the login functionality to ensure users can now log in correctly with the updated field names.

## Known Issues
If you encounter any issues with existing user passwords after this change, you may need to run one of the password update scripts to reset the passwords:

```bash
node fix-passwords-correct.js
```

This will set all test user passwords to "password123".
