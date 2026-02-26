// This middleware is used to handle file uploads using multer. It sets up a memory storage engine, 
// which means that the uploaded files will be stored in memory as Buffer objects. The singleUpload function is exported, 
// which can be used in routes to handle single file uploads with the field name "file".

import multer from "multer";
const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");