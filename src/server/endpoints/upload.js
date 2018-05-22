/**
 * TRASHOUT IS an environmental project that teaches people how to recycle
 * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
 *
 * FOR PROGRAMMERS: There are 10 types of programmers -
 * those who are helping TrashOut and those who are not. Clean up our code,
 * so we can clean up our planet. Get in touch with us: help@trashout.ngo
 *
 * Copyright 2017 TrashOut, n.f.
 *
 * This file is part of the TrashOut project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
 */
import admin from 'firebase-admin';
import config from '../config';
import express from 'express';
import formidable from 'formidable';
import UUID from 'uuid-v4';
import sharp from 'sharp';

process.env.UV_THREADPOOL_SIZE = 128;

const Storage = require('@google-cloud/storage');
const serviceAccount = require('../firebase/firebase.service-account-credentials.json');

const unauthorized = (res) =>
  res.status(401).send({
    error: 'Unauthorized',
  });

const notFound = (res) =>
  res.status(500).send({
    error: 'cannot-upload',
  });

const uploadFile = async (req, res) => {
  const { headers = {} } = req;
  const { 'x-token': token } = headers;

  if (!token) {
    return unauthorized(res);
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.firebase.databaseURL,
    });
  }

  try {
    await admin.auth().verifyIdToken(token);
    const form = new formidable.IncomingForm();
    form.parse(req);

    const parsedFile = await new Promise((resolve) => {
      form.on('file', (name, file) => {
        resolve(file);
      });
    });

    const thumbName = `${parsedFile.path}_thumb`;
    const fileName = `${parsedFile.path}_image`;

    const resizeImage = async () => {
      const metadata = await sharp(parsedFile.path).metadata();
      if (metadata.width > metadata.height) {
        return await sharp(parsedFile.path)
          .resize(800, null)
          .toFile(fileName);
      }
      return await sharp(parsedFile.path)
        .resize(null, 800)
        .toFile(fileName);
    };

    await sharp(parsedFile.path)
      .resize(150, 150)
      .toFile(thumbName);

    await resizeImage();
    const storage = Storage({
      projectId: config.firebase.projectId,
      keyFilename: '../firebase/firebase.service-account-credentials.json',
      credentials: require('../firebase/firebase.service-account-credentials.json'),
    });

    const uuid = UUID();

    const bucket = storage.bucket(config.firebase.storageBucket);
    const uploadedThumb = (await bucket.upload(thumbName, {
      destination: `thumb-images/${uuid}_${parsedFile.name}`,
      uploadType: 'media',
      metadata: {
        metadata: {
          contentType: parsedFile.type,
          firebaseStorageDownloadTokens: uuid,
        },
      },
    }))[0];
    const uploadedFile = (await bucket.upload(fileName, {
      destination: `temp-images/${uuid}_${parsedFile.name}`,
      uploadType: 'media',
      metadata: {
        metadata: {
          contentType: parsedFile.type,
          firebaseStorageDownloadTokens: uuid,
        },
      },
    }))[0];


    return res.status(200).send({
      fullDownloadUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(uploadedFile.name)}?alt=media&token=${uuid}`,
      fullStorageLocation: `gs://${bucket.name}/${uploadedFile.name}`,
      thumbDownloadUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(uploadedThumb.name)}?alt=media&token=${uuid}`,
      thumbStorageLocation: `gs://${bucket.name}/${uploadedThumb.name}`,
      name: parsedFile.name,
      created: uploadedFile.metadata.timeCreated,
    });
  } catch (e) {
    console.log(e);
    return notFound(res);
  }
};


const app = express();
app.post('/upload', uploadFile);

export default app;
