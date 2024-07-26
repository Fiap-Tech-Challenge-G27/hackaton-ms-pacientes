import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly basePath = 'uploads';

  async uploadFile(
    cpf: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
  ): Promise<string> {
    if (file.mimetype !== 'application/pdf') {
      throw new Error('Apenas arquivos PDF são permitidos.');
    }

    const folderPath = path.join(this.basePath, cpf);
    await fs.mkdir(folderPath, { recursive: true });

    const uuid = uuidv4();
    const dateString = new Date().toISOString().split('T')[0];
    const fileName = `${uuid}_${dateString}.pdf`;
    const filePath = path.join(folderPath, fileName);

    await fs.writeFile(filePath, file.buffer);

    return fileName;
  }

  async getFiles(cpf: string): Promise<string[]> {
    const folderPath = path.join(this.basePath, cpf);
    try {
      const files = await fs.readdir(folderPath);
      return files.filter((file) => file.endsWith('.pdf'));
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(
          'Nenhum arquivo encontrado para o CPF fornecido',
        );
      }
      throw error;
    }
  }

  async getFile(cpf: string, filename: string): Promise<string> {
    const filePath = path.join(this.basePath, cpf, filename);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      throw new NotFoundException('Arquivo não encontrado');
    }
  }

  async deleteAllFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.basePath);
      const deletePromises = files.map(async (fileOrDir) => {
        const fullPath = path.join(this.basePath, fileOrDir);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await this.deleteDirectory(fullPath);
        } else if (path.basename(fullPath) !== '.gitkeep') {
          await fs.unlink(fullPath);
        }
      });
      await Promise.all(deletePromises);
    } catch (error) {
      throw new Error(
        'Erro ao tentar deletar arquivos ou diretórios: ' + error.message,
      );
    }
  }

  private async deleteDirectory(directoryPath: string): Promise<void> {
    const files = await fs.readdir(directoryPath);
    const deletePromises = files.map(async (file) => {
      const fullPath = path.join(directoryPath, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        await this.deleteDirectory(fullPath);
      } else if (path.basename(fullPath) !== '.gitkeep') {
        await fs.unlink(fullPath);
      }
    });
    await Promise.all(deletePromises);
    await fs.rmdir(directoryPath);
  }
}
