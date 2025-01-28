import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { NoteService } from './note.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CreateNoteDto } from './dto/create-note.dto';
import Note from './entities/note.entity';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import { CreateNoteWithFilesSchema } from 'src/common/swagger-schemas';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@ApiTags('Note')
@ApiBearerAuth('access-token')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: 'Create note' })
  @ApiResponse({ status: 201, type: Note })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({ schema: CreateNoteWithFilesSchema })
  createNote(
    @Body() noteDto: CreateNoteDto,
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): Promise<Note> {
    return this.noteService.createNote(noteDto, files);
  }

  @ApiOperation({ summary: 'Update note' })
  @ApiResponse({ status: 200, type: Note })
  @Patch('/:id')
  updateNote(
    @Param('id') id: number,
    @Body() noteDto: UpdateNoteDto
  ): Promise<Note> {
    return this.noteService.updateNote(id, noteDto);
  }

  @ApiOperation({ summary: 'Getting all notes' })
  @ApiResponse({ status: 200, type: [Note] })
  @Get()
  getAllNotes(): Promise<Note[]> {
    return this.noteService.getAllNotes();
  }

  @ApiOperation({ summary: 'Getting all patient notes' })
  @ApiResponse({ status: 200, type: [Note] })
  @Get('/patient/:id')
  getAllNotesByPatientId(@Param('id') patientId: number): Promise<Note[]> {
    return this.noteService.getAllNotesByPatientId(patientId);
  }

  @ApiOperation({ summary: 'Getting a note by ID' })
  @ApiResponse({ status: 200, type: Note })
  @Get('/:id')
  getNoteById(@Param('id') id: number): Promise<Note> {
    return this.noteService.getNoteById(id);
  }

  @ApiOperation({ summary: 'Search patient notes' })
  @ApiResponse({ status: 200, type: [Note] })
  @Get('/patient/:id:searchValue')
  @UseGuards(JwtAuthGuard)
  searchPatientNotes(
    @Param('id') id: number,
    @Query('searchValue') searchValue: string
  ): Promise<{ notes: Note[]; countOfNotes: number }> {
    return this.noteService.searchPatientNotes(id, searchValue);
  }

  @ApiOperation({ summary: 'Download a file' })
  @ApiResponse({ status: 200, type: File })
  @Get('/file/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response
  ): Promise<void> {
    return this.noteService.downloadFile(filename, res);
  }
}
