import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Req,
  Delete,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FileService } from './file.service';
import { createReadStream } from 'fs';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/:cpf')
  async uploadFile(@Req() req: FastifyRequest, @Param('cpf') cpf: string) {
    try {
      const data = await req.file();
      if (!data) {
        throw new HttpException('Arquivo não enviado', HttpStatus.BAD_REQUEST);
      }
      const buffer = await data.toBuffer();
      const fileName = await this.fileService.uploadFile(cpf, {
        buffer,
        originalname: data.filename,
        mimetype: data.mimetype,
      });
      return { filename: fileName, path: `uploads/${cpf}/${fileName}` };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':cpf')
  async getFiles(@Param('cpf') cpf: string) {
    try {
      const files = await this.fileService.getFiles(cpf);
      return { files };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':cpf/:filename')
  async getFile(
    @Param('cpf') cpf: string,
    @Param('filename') filename: string,
    @Res() res: FastifyReply,
  ) {
    try {
      const filePath = await this.fileService.getFile(cpf, filename);
      const stream = createReadStream(filePath);
      res.type('application/pdf').send(stream);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('delete-all')
  async deleteAllFiles() {
    try {
      await this.fileService.deleteAllFiles();
      return { message: 'Todos os arquivos foram excluídos com sucesso.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
