import s3 from "../config/s3.config.js";

/**
 * @S3_IMAGE_UPLOAD
 * @param  {} {bucketName
 * @param  {} key
 * @param  {} body
 * @param  {} contentType}
 * @description Uploading Image to AWS S3 Bucket
 * @returns Promise
 */

export const s3FileUpload = async ({ bucketName, key, body, contentType }) => {
  return await s3
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
    .promise();
};

/**
 * @S3_IMAGE_DELETE
 * @param  {} {bucketName
 * @param  {} key}
 * @description DELETE Image from AWS S3 Bucket
 * @returns Promise
 */

export const deleteFile = async ({ bucketName, key }) => {
  return await s3
    .deleteObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
};
