import {
  HttpException,
  HttpStatus,
  Injectable,
  UploadedFiles
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Note from './entities/note.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PatientService } from 'src/patient/patient.service';
import { UpdateNoteDto } from './dto/update-note.dto';
import { File } from './entities/file.entity';
import * as fs from 'fs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly patientService: PatientService,
    private readonly configService: ConfigService
  ) {}

  async createNote(
    createNoteDto: CreateNoteDto,
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): Promise<Note> {
    const { content, userId, patientId } = createNoteDto;

    await this.userService.getUserById(userId);
    await this.patientService.getPatientById(patientId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const note = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Note)
        .values({
          content,
          user: userId,
          patient: patientId
        })
        .execute();

      if (files) {
        for (const file of files) {
          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(File)
            .values({
              filename: file.filename,
              originalName: Buffer.from(file.originalname, 'latin1').toString(
                'utf-8'
              ),
              size: file.size,
              mimetype: file.mimetype,
              note: note.raw[0].id
            })
            .execute();
        }
      }

      await queryRunner.commitTransaction();
      return await this.getNoteById(note.raw[0].id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async updateNote(noteId: number, noteDto: UpdateNoteDto): Promise<Note> {
    try {
      const patient = await this.getNoteById(noteId);

      Object.assign(patient, noteDto);
      return await this.noteRepository.save(patient);
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllNotes(): Promise<Note[]> {
    try {
      const notes = await this.noteRepository
        .createQueryBuilder('note')
        .leftJoinAndSelect('note.patient', 'patient')
        .leftJoinAndSelect('note.user', 'user')
        .leftJoinAndSelect('note.files', 'files')
        .getMany();

      return notes;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllNotesByPatientId(patientId: number): Promise<Note[]> {
    try {
      await this.patientService.getPatientById(patientId);

      return await this.noteRepository
        .createQueryBuilder('note')
        .leftJoinAndSelect('note.user', 'user')
        .leftJoinAndSelect('note.patient', 'patient')
        .leftJoinAndSelect('note.files', 'files')
        .where('patient.id = :patientId', { patientId })
        .orderBy('note.createdAt', 'DESC')
        .getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getNoteById(noteId: number): Promise<Note> {
    try {
      const note = await this.noteRepository.findOneOrFail({
        where: { id: noteId },
        relations: ['patient', 'user', 'files']
      });

      return note;
    } catch (error) {
      throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
    }
  }

  async searchPatientNotes(
    patientId: number,
    searchValue: string
  ): Promise<{ notes: Note[]; countOfNotes: number }> {
    try {
      await this.patientService.getPatientById(patientId);

      const [notes, countOfNotes] = await this.noteRepository
        .createQueryBuilder('note')
        .leftJoinAndSelect('note.patient', 'patient')
        .leftJoinAndSelect('note.user', 'user')
        .leftJoinAndSelect('note.files', 'files')
        .where('note.patient.id = :patientId', { patientId })
        .andWhere('note.content LIKE :searchValue', {
          searchValue: `%${searchValue}%`
        })
        .getManyAndCount();

      return { notes, countOfNotes };
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.NOT_FOUND);
    }
  }

  async downloadFile(filename: string, res: Response): Promise<void> {
    try {
      const filePath = `.${this.configService.get(
        'file_uploads_destination'
      )}/${filename}`;

      await fs.promises.access(filePath, fs.constants.F_OK);

      const fileStream = fs.createReadStream(filePath);

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      fileStream.pipe(res);
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
