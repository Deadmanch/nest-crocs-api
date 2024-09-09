import { Injectable } from '@nestjs/common';
import { MFile } from './mfile.class';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { FileElementResponse } from './dto/file-element.response';

Injectable();
export class FilesService {
	async saveAsWebp(file: Express.Multer.File): Promise<FileElementResponse> {
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		await ensureDir(uploadFolder);
		const webpBuffer = await this.convertToWebP(file.buffer);
		const webpFile = new MFile({
			originalname: `${file.originalname.split('.')[0]}.webp`,
			buffer: webpBuffer,
		});
		await writeFile(`${uploadFolder}/${webpFile.originalname}`, webpFile.buffer);
		return { url: `${dateFolder}/${webpFile.originalname}`, name: webpFile.originalname };
	}

	async convertToWebP(fileBuffer: Buffer): Promise<Buffer> {
		return sharp(fileBuffer).webp().resize({ width: 500 }).toBuffer();
	}
}
