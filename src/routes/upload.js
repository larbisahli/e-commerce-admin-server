import { Router } from 'express';
import UploadImageByUrl from '../lib/upload';
import { query } from '../db';
import QueryString from '../sql/Queries';
import { deleteObject } from '../lib/S3';
import Authorization from '../middleware/Authorization';

const router = Router();

// upload/images
router
  .route('/')
  .all(Authorization)
  .post(async (req, res) => {
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
        const { rows: thumbnail } = await query(QueryString.CheckThumbnail(), [
          product_uid,
        ]);

        if (thumbnail[0]?.thumbnail) {
          return res.status(401).json({
            success: false,
            error: { message: 'Product thumbnail already exist!' },
          });
        }
      }

      const { rows: product } = await query(
        `SELECT title from products WHERE product_uid = $1`,
        [product_uid]
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

      await query(QueryString.InsertImage(), [
        product_uid,
        image.path,
        ImageIndex === 0,
        ImageIndex,
      ]);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(`upload route error ==>`, { error });
      return res.status(500).json({ success: false, error });
    }
  })
  .delete(async (req, res) => {
    const { image_uid } = req.body;

    if (!image_uid)
      return res.status(403).json({ success: false, error: 'Require Fields!' });

    try {
      deleteObject(image_uid, async (error) => {
        if (error) {
          return res.status(500).json({ success: false, error });
        }

        await query(QueryString.DeleteImage(), [image_uid]);

        return res.status(200).json({ success: true });
      });
    } catch (error) {
      console.log(`Delete image route error ==>`, { error });
      return res.status(500).json({ success: false, error });
    }
  });

module.exports = router;
