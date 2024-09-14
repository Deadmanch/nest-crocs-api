import { Injectable } from '@nestjs/common';
import { MFile } from './mfile.class';
import { format } from 'date-fns';
import * as sharp from 'sharp';
import { FileElementResponse } from './dto/file-element.response';
import { S3 } from 'aws-sdk';

Injectable();
export class FilesService {
	constructor(
		private readonly s3 = new S3({
			endpoint: 'https://storage.yandexcloud.net',
			region: 'ru-central1',
			credentials: {
				accessKeyId: process.env.YANDEX_ACCESS_KEY_ID || '',
				secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY || '',
			},
		}),
	) {}
	async saveAsWebp(file: Express.Multer.File): Promise<FileElementResponse> {
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		const webpBuffer = await this.convertToWebP(file.buffer);
		const webpFile = new MFile({
			originalname: `${file.originalname.split('.')[0]}.webp`,
			buffer: webpBuffer,
		});

		const params = {
			Bucket: 'crocs-bucket',
			Key: `${dateFolder}/${webpFile.originalname}`,
			Body: webpFile.buffer,
			ContentType: 'image/webp',
			ACL: 'public-read',
		};

		await this.s3.upload(params).promise();

		return { url: `${dateFolder}/${webpFile.originalname}`, name: webpFile.originalname };
	}

	async convertToWebP(fileBuffer: Buffer): Promise<Buffer> {
		return sharp(fileBuffer).webp().toBuffer();
	}
}
