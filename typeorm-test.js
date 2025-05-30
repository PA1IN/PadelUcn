const { DataSource } = require('typeorm');
const bcrypt = require('bcryptjs');

// Create a test DataSource
async function testTypeORM() {
  console.log('Starting TypeORM test...');

  const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'ingeso',
    password: '12342',
    database: 'padelucn',
    entities: [],
    synchronize: false,
    logging: true
  });

  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Test a raw query to check column names
    console.log('\nGetting column names from database:');
    const columns = await AppDataSource.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuario' 
      ORDER BY ordinal_position;
    `);
    console.table(columns);

    // Try to insert a user using raw SQL
    const rut = '99999999-9';
    const nombre = 'Test TypeORM';
    const correo = 'typeorm@test.com';
    const password = await bcrypt.hash('123456', 10);
    const telefono = '+56955555555';

    console.log('\nInserting user with raw SQL:');
    try {
      const insertResult = await AppDataSource.query(`
        INSERT INTO usuario (rut, "contrase??a", nombre_usuario, correo, telefono)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `, [rut, password, nombre, correo, telefono]);

      console.log('Insert successful!');
      console.log(insertResult);
    } catch (err) {
      console.error('Error inserting with raw SQL:', err.message);
    }

    // Try to create a dynamic entity based on the actual column names
    console.log('\nCreating dynamic entity:');
    const EntitySchema = require('typeorm').EntitySchema;

    const UserEntity = new EntitySchema({
      name: 'User',
      tableName: 'usuario',
      columns: {
        id: {
          primary: true,
          type: 'int',
          name: 'id_usuario',
          generated: 'increment'
        },
        rut: {
          type: 'varchar',
          unique: true
        },
        password: {
          type: 'varchar',
          name: 'contrase??a'
        },
        nombre: {
          type: 'varchar',
          name: 'nombre_usuario'
        },
        correo: {
          type: 'varchar'
        },
        telefono: {
          type: 'varchar',
          nullable: true
        },
        saldo: {
          type: 'int',
          default: 0
        },
        isAdmin: {
          type: 'boolean',
          default: false,
          name: 'is_admin'
        }
      }
    });

    // Register the entity with the DataSource
    AppDataSource.hasMetadata(UserEntity) || AppDataSource.registerEntitySchema(UserEntity);

    // Try to create a user with the dynamic entity
    const userRepository = AppDataSource.getRepository(UserEntity);

    try {
      const newUser = userRepository.create({
        rut: '12121212-1',
        password: await bcrypt.hash('123456', 10),
        nombre: 'Test Dynamic Entity',
        correo: 'dynamic@test.com',
        telefono: '+56911111111'
      });

      const savedUser = await userRepository.save(newUser);
      console.log('User created with dynamic entity!');
      console.log(JSON.stringify(savedUser, null, 2));
    } catch (err) {
      console.error('Error creating user with dynamic entity:', err);
    }

  } catch (error) {
    console.error('Error during TypeORM test:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Data source has been closed.');
    }
  }
}

testTypeORM();
