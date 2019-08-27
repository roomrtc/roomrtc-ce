import { Controller, Request, Post, RequestBody } from '@kites/rest';
import { Inject } from '@kites/common';
import { KITES_INSTANCE, KitesInstance } from '@kites/core';

import * as multer from 'multer';
import * as mkdirp from 'mkdirp';

/**
 * Khởi tạo disk storage cho việc lưu trữ file
 * - Lưu trữ upload file theo user hoặc group
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const now = new Date();
    const userDir = '/content/uploads/' + req.param('user', `${now.getFullYear()}/${now.getMonth()}/${now.getDate()}`);
    const uploadDir = req.kites.appDirectory + userDir;
    (req as any).uploadDir = userDir;
    mkdirp(uploadDir, err => {
      cb(null, uploadDir);
    });
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/**
 * Upload controller
 */
@Controller('/upload')
export class UploadController {

  constructor(
    @Inject(KITES_INSTANCE) private kites: KitesInstance,
  ) {
    this.kites.logger.debug('Init upload controller!');
  }

  /**
   * Hàm lưu file upload
   * @param req e.Request
   */
  @Post('/', upload.single('upload_file'))
  create(@Request() req) {
    const msg = 'upload ok!';
    return {msg, filename: req.file.filename, dirname: req.uploadDir};
  }

}
