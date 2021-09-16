import { Router } from 'express';
import UploadImageByUrl from '../lib/upload';
import { query } from '../database';
import * as QueryString from '../sql/Queries';
import { deleteObject } from '../lib/S3';
import Authorization from '../middleware/Authorization';
import {
  QueryCheckThumbnailType,
  QueryCheckProductTitleType,
} from '../interfaces/query';
import type { PrivilegesType } from '../interfaces';
import { Response, Request } from 'express';
import { CREATE, DELETE } from '../interfaces/constants';

const router = Router();

// upload/images
router
  .route('/')
  .all(Authorization)
  .post(async (req: Request, res: Response) => {
    const privileges = req.privileges;
    const { image: url, index, product_uid } = req.body;

    if (!url || !index || !product_uid) {
      return res.status(403).json({ success: false, error: 'Require Fields!' });
    }

    const ImageIndex = Number(index);

    if (!product_uid) {
      return res.status(403).json({ success: false, error: 'Unknown error' });
    }

    try {
      if (ImageIndex === 0) {
        const { rows: thumbnail } = await query<
          QueryCheckThumbnailType,
          string
        >(QueryString.CheckThumbnail(), [product_uid], {
          privileges,
          actions: [CREATE],
        });

        if (thumbnail[0]?.thumbnail) {
          return res.status(401).json({
            success: false,
            error: { message: 'Product thumbnail already exist!' },
          });
        }
      }

      const { rows: product } = await query<QueryCheckProductTitleType, string>(
        `SELECT title from products WHERE product_uid = $1`,
        [product_uid],
        {
          privileges,
          actions: [CREATE],
        }
      );

      if (!product[0]?.title) {
        return res.status(400).json({
          success: false,
          error: { message: 'Product title does not exist!' },
        });
      }

      const { image, error } = await UploadImageByUrl(url, product[0]?.title);

      if (error) {
        return res.status(500).json({ success: false, error });
      }

      await query<unknown, string | number>(
        QueryString.InsertImage(),
        [product_uid, image.path, ImageIndex === 0, ImageIndex],
        {
          privileges,
          actions: [CREATE],
        }
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(`upload route error ==>`, { error });
      return res.status(500).json({ success: false, error });
    }
  })
  .delete(async (req: Request, res: Response) => {
    const privileges = req.privileges;
    const { image_uid } = req.body;

    if (!image_uid)
      return res.status(403).json({ success: false, error: 'Require Fields!' });

    try {
      deleteObject(image_uid, async (error: Error) => {
        if (error) {
          return res.status(500).json({ success: false, error });
        }

        await query<unknown, string>(QueryString.DeleteImage(), [image_uid], {
          privileges,
          actions: [DELETE],
        });

        return res.status(200).json({ success: true });
      });
    } catch (error) {
      console.log(`Delete image route error ==>`, { error });
      return res.status(500).json({ success: false, error });
    }
  });

export default router;
