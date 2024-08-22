# Proyecto de Tema Shopify - Dawn

¡Bienvenido al repositorio del tema Shopify Dawn! Este archivo README proporciona instrucciones claras sobre cómo configurar y personalizar el tema, así como detalles sobre el desarrollo específico que se ha realizado.

---

## Contenidos

1. [Documentación del Schema](#documentación-del-schema)
2. [Desarrollo AJAX - Añadir al Carrito](#desarrollo-ajax---añadir-al-carrito)
3. [Restricción y Reemplazo de Productos en el Carrito](#restricción-y-reemplazo-de-productos-en-el-carrito)

---

## Documentación del Schema

### Descripción

El esquema de este tema se utiliza para construir la página de lista de productos en tu tienda Shopify. Está diseñado para ser flexible y permite ajustar la presentación de los productos a través de parámetros configurables en el archivo `schema.json`.

### Estructura del Schema

El archivo `schema.json` define los siguientes parámetros:

- **`name`**: El nombre de la sección que se mostrará en la administración de Shopify.
- **`settings`**: Configuraciones para personalizar la apariencia y el comportamiento de la sección.
- **`blocks`**: Definiciones para los bloques de contenido dentro de la sección.

#### Ejemplo de Schema

```json
{
  "name": "Product List",
  "settings": [
    {
      "type": "text",
      "id": "section_title",
      "label": "Section Title",
      "default": "Our Products"
    },
    {
      "type": "range",
      "id": "products_per_row",
      "label": "Products per Row",
      "default": 3,
      "min": 1,
      "max": 6
    }
  ],
  "blocks": [
    {
      "type": "product",
      "name": "Product Block",
      "settings": []
    }
  ]
}
