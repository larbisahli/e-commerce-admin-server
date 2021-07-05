// **** (categories) Table Queries ****

// order by display_order
const Categories = () => {
    return `SELECT * FROM categories`
}

const Category = () => {
    return `SELECT * FROM categories WHERE category_uid = $1`
}

const CreateCategory = () => {
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

const CreateProduct = () => {
    return `
    INSERT INTO products(
        category_uid, account_uid, title, price, discount, shipping_price,
        warehouse_location, product_description, short_description, quantity,
        product_weight, available_sizes, available_colors, size, color,
        is_new) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 
        string_to_array(($12)::TEXT, ',')::TEXT[], string_to_array(($13)::TEXT, ',')::TEXT[], 
        $14, $15, $16) RETURNING product_uid
    `
}

const UpdateProduct = () => {
    return `
       UPDATE products SET category_uid = $2, title = $3, price = $4, discount = $5,
       shipping_price = $6, warehouse_location = $7, product_description = $8,
       short_description = $9, quantity = $10, product_weight = $11, available_sizes = $12,
       available_colors = $13, size = $14, color = $15, is_new = $16, updated_at = $17
       WHERE product_uid = $1 RETURNING product_uid
    `
}


module.exports = {
    Categories,
    Category,
    CreateCategory,
    UpdateCategory,
    Products,
    Product,
    UpdateProduct,
    CreateProduct
};
