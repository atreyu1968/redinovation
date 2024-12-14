```javascript
import { db } from '../database.js';

export const seedDatabase = async () => {
  try {
    await db.run('BEGIN TRANSACTION');

    // Networks
    await db.run(`INSERT INTO networks (id, code, name, description) VALUES
      ('1', 'RED-INNOVA-1', 'Red de Innovación Tenerife', 'Red principal de centros de FP de Tenerife'),
      ('2', 'RED-INNOVA-2', 'Red de Innovación Gran Canaria', 'Red principal de centros de FP de Gran Canaria')`);

    // Centers
    await db.run(`INSERT INTO centers (id, code, name, network, address, municipality, province, island, phone, email) VALUES 
      ('1', 'CIFP-CM', 'CIFP César Manrique', 'RED-INNOVA-1', 'Av. Principal 123', 'Santa Cruz', 'Santa Cruz de Tenerife', 'Tenerife', '922123456', 'cifp.cesarmanrique@edu.es'),
      ('2', 'CIFP-SC', 'CIFP San Cristóbal', 'RED-INNOVA-2', 'C/ Secundaria 45', 'Las Palmas', 'Las Palmas', 'Gran Canaria', '928654321', 'cifp.sancristobal@edu.es')`);

    // Departments
    await db.run(`INSERT INTO departments (id, code, name, description, headTeacher, email) VALUES
      ('1', 'DEP-INF', 'Departamento de Informática', 'Departamento de Informática y Comunicaciones', 'Juan Pérez', 'dpto.informatica@edu.es'),
      ('2', 'DEP-ADM', 'Departamento de Administración', 'Departamento de Administración y Gestión', 'María García', 'dpto.administracion@edu.es')`);

    // Professional Families
    await db.run(`INSERT INTO families (id, code, name, description) VALUES
      ('1', 'INF', 'Informática y Comunicaciones', 'Familia profesional de tecnologías de la información'),
      ('2', 'ADM', 'Administración y Gestión', 'Familia profesional de administración')`);

    // Studies
    await db.run(`INSERT INTO studies (id, familyId, code, name, level) VALUES
      ('1', '1', 'DAW', 'Desarrollo de Aplicaciones Web', 'higher'),
      ('2', '1', 'DAM', 'Desarrollo de Aplicaciones Multiplataforma', 'higher'),
      ('3', '2', 'ADF', 'Administración y Finanzas', 'higher')`);

    // Groups
    await db.run(`INSERT INTO groups (id, studyId, code, name, shift, year) VALUES
      ('1', '1', 'DAW1M', 'DAW 1º Mañana', 'morning', 1),
      ('2', '1', 'DAW2M', 'DAW 2º Mañana', 'morning', 2),
      ('3', '2', 'DAM1T', 'DAM 1º Tarde', 'afternoon', 1),
      ('4', '3', 'ADF1M', 'ADF 1º Mañana', 'morning', 1)`);

    // Academic Year
    await db.run(`INSERT INTO academic_years (id, name, startDate, endDate, isActive) VALUES
      ('1', 'Curso 2023-2024', '2023-09-01', '2024-06-30', 1)`);

    // Quarters
    await db.run(`INSERT INTO quarters (id, academicYearId, name, startDate, endDate, isActive) VALUES
      ('1', '1', 'Primer Trimestre', '2023-09-01', '2023-12-22', 0),
      ('2', '1', 'Segundo Trimestre', '2024-01-08', '2024-03-27', 1),
      ('3', '1', 'Tercer Trimestre', '2024-04-08', '2024-06-30', 0)`);

    // Sample Actions
    await db.run(`INSERT INTO actions (id, name, location, description, startDate, endDate, studentParticipants, teacherParticipants, rating, comments, createdBy, network, center, quarter) VALUES
      ('1', 'Taller de Innovación Tecnológica', 'CIFP César Manrique', 'Taller práctico sobre nuevas tecnologías', '2024-02-15', '2024-02-15', 25, 3, 4, 'Excelente participación', '1', 'RED-INNOVA-1', 'CIFP César Manrique', '2'),
      ('2', 'Jornada de Emprendimiento', 'CIFP San Cristóbal', 'Jornada dedicada al emprendimiento', '2024-03-01', '2024-03-01', 40, 5, 5, 'Gran interés de los participantes', '2', 'RED-INNOVA-2', 'CIFP San Cristóbal', '2')`);

    // Action Relationships
    await db.run(`INSERT INTO action_departments (actionId, departmentCode) VALUES
      ('1', 'DEP-INF'),
      ('2', 'DEP-ADM')`);

    await db.run(`INSERT INTO action_families (actionId, familyCode) VALUES
      ('1', 'INF'),
      ('2', 'ADM')`);

    await db.run('COMMIT');
    console.log('Database seeded successfully');
  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  }
};
```