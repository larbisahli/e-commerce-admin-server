// **** (categories) Table Queries ****

// order by display_order
const Categories = () => {
  return `SELECT * FROM categories`;
};

const Category = () => {
  return `SELECT * FROM categories WHERE category_uid = $1`;
};

const InsertCategory = () => {
  return `
        INSERT INTO categories(category_name, category_description, is_active, display_order) 
        VALUES($1, $2, $3, COALESCE((SELECT MAX(display_order)+1 FROM categories), 0)) 
        RETURNING category_uid, category_name
    `;
};

const UpdateCategory = () => {
  return `
       UPDATE categories SET category_name = $2, category_description = $3, is_active = $4 
       WHERE category_uid = $1 RETURNING category_uid, category_name
    `;
};

// **** (products) Table Queries ****

const Products = () => {
  return `SELECT pd.product_uid, pd.category_uid, pd.account_uid, pd.title, pd.price, pd.discount, pd.inventory,
    ARRAY(SELECT json_build_object('image', img.image_path, 'image_uid', img.image_uid) 
    FROM images img WHERE img.product_uid = pd.product_uid AND img.thumbnail = true) AS thumbnail FROM products pd
    WHERE pd.category_uid = $1 AND pd.account_uid = $2 LIMIT $3 OFFSET $4`;
};

const Product = () => {
  return `SELECT pd.product_uid, pd.category_uid, pd.account_uid, 
    pd.title, pd.price, pd.discount, pd.warehouse_location, 
    pd.product_description, pd.short_description, pd.inventory, pd.product_weight, pd.is_new, pd.note, 
    ARRAY(SELECT json_build_object('image', img.image_path, 'image_uid', img.image_uid) 
    FROM images img WHERE img.product_uid = $1 AND img.thumbnail = true) AS thumbnail,
    ARRAY(SELECT json_build_object('image', img.image_path, 'image_uid', img.image_uid) 
    FROM images img WHERE img.product_uid = $1 AND img.thumbnail = false ORDER BY img.display_order) AS gallery
    FROM products pd WHERE pd.product_uid = $1`;
};

const ProductCount = () => {
  return `SELECT count(product_uid) From products`;
};

const InsertProduct = () => {
  return `
    INSERT INTO products(
        category_uid, account_uid, title, price, discount, warehouse_location, 
        product_description, short_description, inventory, product_weight, is_new, note) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NULLIF($12, '')) RETURNING product_uid
    `;
};

const UpdateProduct = () => {
  return `
       UPDATE products SET category_uid = $2, title = $3, price = $4, discount = $5,
       warehouse_location = $6, product_description = $7, short_description = $8,
       inventory = $9, product_weight = $10, is_new = $11, note = NULLIF($12, '')
       WHERE product_uid = $1 RETURNING product_uid
    `;
};

// **** (images) Table Queries ****

const InsertImage = () => {
  return `
    INSERT INTO images(product_uid, image_path, thumbnail, display_order) 
    VALUES($1, $2, $3, $4) RETURNING image_uid
    `;
};

const DeleteImage = () => {
  return `DELETE FROM images WHERE image_uid = $1 RETURNING image_uid`;
};

const CheckThumbnail = () => {
  return `SELECT thumbnail from images WHERE product_uid = $1 AND thumbnail = true`;
};

// **** (attributes) Table Queries ****

const Attribute = () => {
  return `SELECT attribute_uid, product_uid, attribute_name FROM attributes WHERE attribute_uid = $1`;
};

const Attributes = () => {
  return `SELECT att.attribute_uid, att.product_uid, att.attribute_name, 
        ARRAY(SELECT json_build_object('option_uid', op.option_uid, 'attribute_uid', op.attribute_uid,
        'option_name', op.option_name, 'additional_price', op.additional_price, 'color_hex', op.color_hex) 
        FROM options op WHERE op.attribute_uid = att.attribute_uid) AS options FROM attributes att WHERE product_uid = $1`;
};

const InsertAttribute = () => {
  return `INSERT INTO attributes(product_uid, attribute_name) VALUES($1, $2) RETURNING attribute_uid, attribute_name`;
};

const UpdateAttribute = () => {
  return `UPDATE attributes SET attribute_name = $2 WHERE attribute_uid = $1 RETURNING attribute_name`;
};

const DeleteAttribute = () => {
  return `DELETE FROM attributes WHERE attribute_uid = $1 RETURNING attribute_name`;
};

// **** (options) Table Queries ****

const InsertOption = () => {
  return `INSERT INTO options(attribute_uid, option_name, additional_price, color_hex) VALUES($1, $2, $3, $4) RETURNING option_uid, option_name`;
};

const UpdateOption = () => {
  return `UPDATE options SET option_name = $2, additional_price = $3, color_hex = $4 WHERE option_uid = $1 RETURNING option_name`;
};

const DeleteOption = () => {
  return `DELETE FROM options WHERE option_uid = $1 RETURNING option_name`;
};

module.exports = {
  Categories,
  Category,
  InsertCategory,
  UpdateCategory,
  Products,
  Product,
  UpdateProduct,
  InsertProduct,
  ProductCount,
  InsertImage,
  DeleteImage,
  CheckThumbnail,
  Attribute,
  Attributes,
  InsertAttribute,
  UpdateAttribute,
  InsertOption,
  UpdateOption,
  DeleteOption,
  DeleteAttribute
};
