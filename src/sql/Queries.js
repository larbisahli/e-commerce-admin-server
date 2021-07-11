// **** (categories) Table Queries ****

// order by display_order
const Categories = () => {
    return `SELECT * FROM categories`
}

const Category = () => {
    return `SELECT * FROM categories WHERE category_uid = $1`
}

const InsertCategory = () => {
    return `
        INSERT INTO categories(category_name, category_description, is_active, display_order) 
        VALUES($1, $2, $3, COALESCE((SELECT MAX(display_order)+1 FROM categories), 0)) 
        RETURNING category_uid, category_name
    `
}

const UpdateCategory = () => {
    return `
       UPDATE categories SET category_name = $2, category_description = $3, is_active = $4 
       WHERE category_uid = $1 RETURNING category_uid, category_name
    `
}

// **** (products) Table Queries ****

const Products = () => {
    return `SELECT product_uid, category_uid, title, price FROM products 
            WHERE category_uid = $1 AND account_uid = $2 LIMIT $3 OFFSET $4`
}

const Product = () => {
    return `SELECT * FROM products WHERE product_uid = $1`
}

const InsertProduct = () => {
    return `
    INSERT INTO products(
        category_uid, account_uid, title, price, discount, warehouse_location, 
        product_description, short_description, inventory, product_weight, 
        available_sizes, available_colors, size, color, is_new, note) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
        string_to_array(($11)::TEXT, ',')::TEXT[], string_to_array(($12)::TEXT, ',')::TEXT[], 
        NULLIF($13, ''), NULLIF($14, ''), $15, NULLIF($16, '')) RETURNING product_uid
    `
}

const UpdateProduct = () => {
    return `
       UPDATE products SET category_uid = $2, title = $3, price = $4, discount = $5,
       warehouse_location = $6, product_description = $7, short_description = $8,
       inventory = $9, product_weight = $10, available_sizes = string_to_array(($11)::TEXT, ',')::TEXT[],
       available_colors = string_to_array(($12)::TEXT, ',')::TEXT[], size = NULLIF($13, ''), color = NULLIF($14, ''), is_new = $15, note = NULLIF($16, '')
       WHERE product_uid = $1 RETURNING product_uid
    `
}

// **** (images) Table Queries ****

const InsertImage = () => {
    return `
    INSERT INTO images(product_uid, image_path, thumbnail, display_order) 
    VALUES($1, $2, $3, $4) RETURNING image_uid
    `
}

module.exports = {
    Categories,
    Category,
    InsertCategory,
    UpdateCategory,
    Products,
    Product,
    UpdateProduct,
    InsertProduct,
    InsertImage
};
