import { FileElementResponse } from './dto/file-element.response';
import { Controller, HttpCode, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@HttpCode(200)
	@UseInterceptors(FilesInterceptor('files', 10))
	async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<FileElementResponse[]> {
		const fileResponses: FileElementResponse[] = [];
		for (const file of files) {
			const response = await this.filesService.saveAsWebp(file);
			fileResponses.push(response);
		}
		return fileResponses;
	}
}
