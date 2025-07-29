
# Gestor de Tareas

Una aplicación de gestión de tareas estilo Trello que permite a los usuarios autenticarse, gestionar tareas por columnas dinámicas, arrastrar y soltar tareas, y mantener persistencia de datos.

## Tecnologías Utilizadas

- [Next.js](https://nextjs.org/) – Framework React para SSR y SSG
- [TypeScript](https://www.typescriptlang.org/) – Tipado estático
- [Redux Toolkit](https://redux-toolkit.js.org/) – Gestión de estado
- [Styled Components](https://styled-components.com/) – Estilos con CSS-in-JS
- [ESLint](https://eslint.org/) – Linter de código
- [NeDB](https://github.com/louischatriot/nedb) – Base de datos en formato JSON para desarrollo
- OTP + WASM – Autenticación con código dinámico y ofuscación binaria

---

##  Descripción General

- Los usuarios pueden **autenticarse** y gestionar sus propias tareas.
- Interfaz tipo tablero **kanban** con columnas y tareas movibles mediante *drag and drop*.
- Las columnas son **dinámicas** desde base de datos.
- Cada tarea puede marcarse como **favorita**.
- Uso de código **OTP** generado con WebAssembly para mayor seguridad en el acceso.

---

## Arquitectura del Store

El estado global (Redux) está dividido en tres secciones:

- `auth`: Maneja la autenticación del usuario.
- `columns`: Información y estado de las columnas del tablero.
- `tasks`: Lista y estado de las tareas de cada usuario.

---

## Control de Acceso

- Inicio de sesión con **correo electrónico y contraseña**.
- Se genera un **código OTP** (One-Time Password) como verificación adicional.
- Se utiliza **WASM** para generar el código en binario, añadiendo una capa de ocultación.

---

## API REST

| Método | Endpoint                            | Entidad |
|--------|-------------------------------------|---------|
| GET    | `/api/columns`                      | Columns |
| GET    | `/api/tasks`                        | Tasks   |
| PUT    | `/api/tasks/{id}`                   | Task    |

---

## Usuarios de Prueba

Estos correos pueden usarse para probar el login. **La contraseña puede ser cualquiera**:

- emma.wong@reqres.in  
- george.bluth@reqres.in  
- eve.holt@reqres.in  
- tracey.ramos@reqres.in  
- janet.weaver@reqres.in  
- charles.morris@reqres.in  

---

## Instrucciones de Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/rdelanoy/to-do.git
cd to-do
```

### 2. Instalar dependencias

```bash
npm install

### 3. Ejecutar el entorno de desarrollo

```bash
npm run dev


Abre `http://localhost:3000` en tu navegador.

---

## Base de Datos

Este proyecto usa **NeDB**, una base de datos basada en archivos JSON, ideal para desarrollo. Los archivos se guardan automáticamente en el sistema local.

---

## Compilar para Producción

```bash
npm run build
npm start
```

---

## Notas Finales

- Proyecto orientado a pruebas y desarrollo, no preparado aún para producción.
- El código OTP y su verificación están implementados con WebAssembly como prueba de concepto de seguridad.

---

## Autor / Mantenimiento
Rafael Gonzalez Delanoy
Desarrollado para prueba tecnica.
