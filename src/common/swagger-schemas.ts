export const CreateNoteWithFilesSchema = {
  type: 'object',
  properties: {
    userId: { type: 'number', description: 'User Id', example: '1' },
    patientId: { type: 'number', description: 'Patient Id', example: '1' },
    content: {
      type: 'string',
      description: 'Text of the note',
      example: 'Patient has pain'
    },
    files: {
      type: 'array',
      items: { type: 'string', format: 'binary' },
      description: 'Files to upload',
      example: ['file1.jpg', 'file2.jpg']
    }
  },
  required: ['userId', 'patientId', 'content']
};

export const UpdateUserPhotoSchema = {
  type: 'object',
  properties: {
    photo: {
      type: 'string',
      format: 'binary',
      description: 'Photo to upload',
      example: 'file1.jpg'
    }
  },
  required: ['photo']
};
