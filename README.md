<p align="center">
  <a href="https://expressjs.com/" target="_blank"><img src="https://miro.medium.com/v2/resize:fit:1400/0*-VVwL0nee9RgEhJB.png" width="90" alt="Logo Express" /></a>



# 🧩 App Express

Sistema de gestión de mediaciones elaborada en Express y TypeScript

---

## 🧪 Cómo ejecutar desde git

### 1. Clona el repositorio

```bash
git clone https://github.com/danielsamx/mediatech-server.git
```

### 2. Instalar las dependencias

- Moverse el directorio correspondiente

```bash
cd mediatech-server
```

- Instalar las dependencias

```bash
npm install
```

### 3. Ejecución del proyecto

Ejecuta el proyecto en modo desarrollador con:

```bash
npm run dev
```
### 4. Crear BD:

Abrir sqlserver(ssms) y ejecutar el script:

```bash
mediatech.sql
```

### 5. Variable de entorno:

Crear un archivo .env y definir las siguientes variables de entorno:

```bash
PORT = 3000
DB_SERVER=TU_SERVIDOR_DE_BASE_DE_DATOS
DB_DATABASE=Mediatech
DB_USER=TU_USUARIO
DB_PASSWORD=TU_CONTRASEÑA
```

### 6. Acceder a la aplicación:

Una vez que el servidor esté corriendo, podrás acceder a la documentación en:

```bash
http://localhost:3000/api-docs
```
