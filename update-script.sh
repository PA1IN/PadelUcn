#!/bin/bash
psql -U ingeso -d padelucn << EOF
UPDATE usuario SET "contraseña" = '\$2b\$10\$GXF3j2LvGNquB5dnvSLM8ukSgtKlOD/RuK2Bi32b6YP3MOUr5mI.a' WHERE rut = '11111111-1';
UPDATE usuario SET "contraseña" = '\$2b\$10\$GXF3j2LvGNquB5dnvSLM8ukSgtKlOD/RuK2Bi32b6YP3MOUr5mI.a' WHERE rut = '22222222-2';
UPDATE usuario SET "contraseña" = '\$2b\$10\$GXF3j2LvGNquB5dnvSLM8ukSgtKlOD/RuK2Bi32b6YP3MOUr5mI.a' WHERE rut = '33333333-3';
SELECT rut, "contraseña" FROM usuario WHERE rut IN ('11111111-1', '22222222-2', '33333333-3');
EOF
