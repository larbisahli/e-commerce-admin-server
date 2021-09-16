// ******** <QUERY PROPS> ********
export interface PropsQueryCategoryType {
  category_uid: string;
}

export interface PropsQueryProductsType {
  account_uid: string;
  category_uid: string;
  page: number;
  limit: number;
}

export interface PropsQueryAttributeType {
  attribute_uid: string;
}

export interface PropsQueryAttributesType {
  product_uid: string;
}
export interface PropsQueryProductType {
  product_uid: string;
}

// ******** <Mutation PROPS> ********

export interface PropsMutationCategoryType {
  category_uid?: string;
  category_name: string;
  category_description: string;
  is_active: boolean;
}

export interface PropsMutationProductType {
  product_uid: string;
  category_uid: string;
  account_uid: string;
  title: string;
  price: number;
  discount: number;
  warehouse_location: string;
  product_description: string;
  short_description: string;
  inventory: number;
  product_weight: number;
  is_new: boolean;
  note: string;
}

export interface PropsMutationOptionType {
  option_uid?: string;
  attribute_uid?: string;
  option_name?: string;
  additional_price?: number;
  color_hex?: string;
}
export interface PropsMutationAttributeType {
  product_uid?: string;
  attribute_uid?: string;
  attribute_name?: string;
  options?: PropsMutationOptionType[];
}

export interface PropsMutationIMGType {
  image_uid: string;
  display_order: number;
}
