import { Request, Response, NextFunction } from 'express';

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface AuthType {
  account_uid: string;
  is_active: boolean;
  privileges: string[];
}

// ******** PROPS ********

// Query
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

// Mutation

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
  product_weight: string;
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
  display_order: string;
}

// ******** QUERIES ********
export interface QueryCategoryType {
  category_uid: string;
  category_name: string;
  category_description: string;
  is_active: boolean;
  display_order: number;
}

export interface QueryIMGType {
  image_uid: string;
  image: string;
  display_order?: number;
}
export interface QueryProductType {
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
  thumbnail: QueryIMGType;
  gallery: QueryIMGType;
}

export interface QueryProductsType {
  product_uid: string;
  category_uid: string;
  account_uid: string;
  title: string;
  price: number;
  thumbnail: QueryIMGType;
}

export interface QueryProductsCountType {
  count: number;
}

export interface QueryOptionType {
  option_uid: string;
  attribute_uid: string;
  option_name: string;
  additional_price: number;
  color_hex?: string;
}
export interface QueryAttributeType {
  attribute_uid: string;
  product_uid: string;
  attribute_name: string;
  options: QueryOptionType;
}

export interface QueryCheckThumbnailType{
  thumbnail: string
}

export interface QueryCheckProductTitleType{
  title: string
} 

export interface QueryAccountType {
  account_uid: string
  first_name: string
  last_name: string
  username: string
  phone_number: string
  email:string
  password_hash: string
  is_active: boolean
  profile_img: string
  privileges: string[]
}

// ******** MUTATIONS ********

export interface MutationCategoryType {
  category_uid: string;
  category_name: string;
}

export interface MutationProductType {
  product_uid: string;
}

export interface MutationAttributeType {
  attribute_uid: string;
  attribute_name: string;
}

export interface MutationOptionType {
  option_uid: string;
  option_name: string;
}

export interface MutationIMGType {
  display_order: number;
}
