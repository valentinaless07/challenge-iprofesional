# Proyecto de Evaluación: Calculadora E-Commerce

Este proyecto consiste en el desarrollo de un e-commerce básico con gestión de productos, categorías, y descuentos, y la capacidad de calcular el costo final de un pedido aplicando descuentos específicos. Utiliza Symfony 7 para el backend, MySQL para la base de datos y Next.js para el frontend.

# 🗂 Estructura del Proyecto

El repositorio está dividido en dos carpetas principales:

## frontend

Contiene el código fuente del **frontend** desarrollado con **Next.js**.

## backend

Contiene el código fuente del **backend** desarrollado con **Symfony**.

# 📋Requerimientos

- **PHP**: 8.4.2 o superior
- **MySQL**: 8.0.4 o superior
- **Composer**: 2.8.4 o superior
- **Node.js**: 20.10.0 o superior
- **Symfony CLI**
- **NPM**: o **Yarn**


## ⚙ Instalación y Configuración
1. Clonar el repositorio:
```bash
git clone https://github.com/valentinaless07/challenge-iprofesional
```


### Backend (Symfony)



1. Entra en la carpeta `backend` y ejecuta:

```bash
composer install
```
2. Renombrar el archivo .env.example a .env:

```bash
mv .env.example .env
```
3. En el archivo `.env` del backend, configura los parámetros de conexión a la base de datos MySQL:

```bash
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/ecommerce_challenge"
```

4. Crear la base de datos y las tablas:

```bash
php bin/console doctrine:database:create
```
5. Generar las migraciones pendientes:

```bash
php bin/console doctrine:migrations:diff
```
6. Aplicar las migraciones:

```bash
php bin/console doctrine:migrations:migrate
```
7. Iniciar el servidor backend:

```bash
symfony serve
```

### Frontend (Next.js)

1. Instalar dependencias del frontend:

```bash
npm install
```
2. En el archivo `.env` establecer la conexión con el backend:
```bash
NEXT_PUBLIC_API_BASE_URL="https://localhost:<port>"
```

3. Iniciar el servidor frontend:
```bash
npm run dev
```
# Estructura de la Base de Datos (MySQL)

## Tablas

### Productos
- **ID**: Identificador único del producto.
- **Nombre**: Nombre del producto.
- **Descripción**: Descripción detallada del producto.
- **Costo**: Costo del producto.
- **Categoría(s)**: Categoría o categorías asociadas al producto.

### Categorías
- **ID**: Identificador único de la categoría.
- **Nombre**: Nombre de la categoría.
- **Descripción**: Descripción detallada de la categoría.

### Códigos de Descuento
- **ID**: Identificador único del código de descuento.
- **Nombre**: Nombre del código de descuento.
- **Categoría asociada**: Categoría a la que se aplica el descuento.
- **Porcentaje**: Porcentaje de descuento aplicado.


# API Endpoints

## GET /products
Obtiene la lista de productos disponibles.

### Respuesta:
- **Status:** 200 OK
- **Cuerpo:** JSON con los productos, incluyendo:
  - `name`: Nombre del producto.
  - `description`: Descripción del producto.
  - `image`: Imagen del producto.
  - `categories`: Lista de categorías del producto.
  - `price`: Costo del producto.
  - `discount`: Descuento aplicado al producto.
  - `total_price`: Precio final del producto.

---

## POST /order
Calcula el costo final de un pedido.

### Cuerpo:
- **products**: (Requerido) Lista de productos seleccionados. Cada producto debe incluir los siguientes detalles:
  - `id`: El identificador del producto.
  - `quantity`: La cantidad del producto.
- **discountCode**: Código de descuento (opcional).


### Respuesta:

- **Status:** 200 OK
- **Cuerpo:** JSON con los detalles de la compra, incluyendo:
  - `total`: El total de la compra antes del descuento.
  - `subtotal`: Valor total de los productos sin aplicar el descuento.
  - `discount`: Un objeto que contiene:
    - `id`: El identificador del descuento aplicado.
    - `percentage`: El porcentaje de descuento.
    - `category_id`: El identificador de la categoría a la que se aplica el descuento.
  - `totalDiscounted`: El descuento total aplicado a la orden.
  - `discountCodeName`: El código de descuento utilizado.


---

## GET /code/{code}
Obtiene los detalles de un código de descuento.

### Parámetros:
- **code**: El código de descuento a consultar.

### Respuesta:

- **Status:** 200 OK
- **Cuerpo:** JSON con los detalles del código, incluyendo:
  - `id`: Identificador del código.
  - `name`: Nombre del código.
  - `percentage`: Porcentaje de descuento del código.
  - `category`: Un objeto que contiene:
    - `id`: El identificador de la categoría asociada.
    - `name`: Nombre de la categoría.

# Frontend (Next.js)

## Landing Page
- Muestra una lista de productos disponibles con:
  - Nombre
  - Precio
  - Categoría(s)
- Permite agregar productos al carrito.

## Carrito de Compra
- Muestra los productos seleccionados con su precio (antes y después de aplicar descuentos).
- Permite eliminar productos del carrito.

## Página de Checkout
- Incluye un formulario para introducir un código de descuento.
- Botón para calcular el precio final basado en los productos seleccionados y el descuento aplicado.
- Muestra el desglose de costos:
  - Subtotal
  - Descuentos aplicados
  - Total

# 🛠 Tecnologías Usadas

## Backend
- **Symfony**
- **MySQL**

## Frontend
- **Next.js**
- **React**
- **Tailwind CSS**
