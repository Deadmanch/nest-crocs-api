import { Injectable } from '@nestjs/common';
import { MFile } from './mfile.class';
import { format } from 'date-fns';
import * as sharp from 'sharp';
import { FileElementResponse } from './dto/file-element.response';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
	private readonly s3: S3Client;

	constructor() {
		this.s3 = new S3Client({
			endpoint: 'https://storage.yandexcloud.net',
			region: 'ru-central1',
			credentials: {
				accessKeyId: process.env.YANDEX_ACCESS_KEY_ID || '',
				secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY || '',
			},
		});
	}

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
			ACL: ObjectCannedACL.public_read, // Используйте ObjectCannedACL
		};

		const command = new PutObjectCommand(params);
		await this.s3.send(command);

		const baseUrl = 'https://crocs-bucket.storage.yandexcloud.net';
		const fileUrl = `${baseUrl}/${dateFolder}/${webpFile.originalname}`;

		return { url: fileUrl, name: webpFile.originalname };
	}

	async convertToWebP(fileBuffer: Buffer): Promise<Buffer> {
		return sharp(fileBuffer).webp().toBuffer();
	}
}
