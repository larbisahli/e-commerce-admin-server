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
    return `SELECT pd.product_uid, pd.category_uid, pd.account_uid, 
    pd.title, pd.price, pd.discount, pd.warehouse_location, 
    pd.product_description, pd.short_description, pd.inventory, pd.product_weight, 
    pd.available_sizes, pd.available_colors, pd.is_new, pd.note, 
    ARRAY(SELECT json_build_object('image', img.image_path, 'image_uid', img.image_uid) 
    FROM images img WHERE img.product_uid = $1 AND img.thumbnail = true) AS thumbnail,
    ARRAY(SELECT json_build_object('image', img.image_path, 'image_uid', img.image_uid) 
    FROM images img WHERE img.product_uid = $1 AND img.thumbnail = false ORDER BY img.display_order) AS gallery
    FROM products pd WHERE pd.product_uid = $1`
}

// const Product = () => {
//     return `
//     SELECT pd.product_uid, category_uid, account_uid, 
//     title, price, discount, warehouse_location, 
//     product_description, short_description, inventory, product_weight, 
//     available_sizes, available_colors, is_new, note,
//     array_remove(array_agg(CASE WHEN img.thumbnail = true THEN img.image_path ELSE NULL END), NULL) AS thumbnail,
//     array_remove(array_agg(CASE WHEN img.thumbnail = false THEN img.image_path ELSE NULL END ORDER BY img.display_order), NULL) AS gallery 
//     FROM products pd LEFT JOIN images img USING(product_uid) WHERE pd.product_uid = $1 GROUP BY pd.product_uid`
// }

const InsertProduct = () => {
    return `
    INSERT INTO products(
        category_uid, account_uid, title, price, discount, warehouse_location, 
        product_description, short_description, inventory, product_weight, 
        available_sizes, available_colors, is_new, note) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
        string_to_array(($11)::TEXT, ',')::TEXT[], string_to_array(($12)::TEXT, ',')::TEXT[], 
        $15, NULLIF($16, '')) RETURNING product_uid
    `
}

const UpdateProduct = () => {
    return `
       UPDATE products SET category_uid = $2, title = $3, price = $4, discount = $5,
       warehouse_location = $6, product_description = $7, short_description = $8,
       inventory = $9, product_weight = $10, available_sizes = string_to_array(($11)::TEXT, ',')::TEXT[],
       available_colors = string_to_array(($12)::TEXT, ',')::TEXT[], is_new = $15, note = NULLIF($16, '')
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

const DeleteImage = () => {
    return `DELETE FROM images WHERE image_uid = $1 RETURNING image_uid`;
};

const CheckThumbnail = () => {
    return `SELECT thumbnail from images WHERE product_uid = $1 AND thumbnail = true`
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
    InsertImage,
    DeleteImage,
    CheckThumbnail
};
