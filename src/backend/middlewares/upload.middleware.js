const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração de armazenamento para fotos de usuários
const usuarioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/usuarios');
    // Garantir que o diretório existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Usar ID do usuário + timestamp para evitar conflitos de nomes
    const userId = req.usuarioId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `usuario_${userId}_${timestamp}${ext}`);
  }
});

// Configuração de armazenamento para fotos de pacientes
const pacienteStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/pacientes');
    // Garantir que o diretório existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Usar ID do paciente (se disponível) + timestamp para evitar conflitos de nomes
    const pacienteId = req.params.id || 'novo';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `paciente_${pacienteId}_${timestamp}${ext}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Apenas JPEG, JPG e PNG são permitidos.'), false);
  }
};

// Configuração do multer para upload de fotos de usuários
const uploadFotoUsuario = multer({
  storage: usuarioStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
}).single('foto');

// Configuração do multer para upload de fotos de pacientes
const uploadFotoPaciente = multer({
  storage: pacienteStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
}).single('foto_perfil');

// Configuração de armazenamento para anexos de evoluções
const evolucaoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/evolucoes');
    // Garantir que o diretório existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Usar timestamp para evitar conflitos de nomes
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `evolucao_${timestamp}${ext}`);
  }
});

// Filtro mais flexível para anexos de evoluções (imagens e documentos)
const evolucaoFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado.'), false);
  }
};

// Configuração do multer para upload de anexos de evoluções
const uploadAnexosEvolucao = multer({
  storage: evolucaoStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: evolucaoFileFilter
}).array('anexos', 5); // Até 5 arquivos

// Middleware para tratar erros de upload
const handleUploadError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Erro do Multer
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ mensagem: 'Arquivo muito grande. Tamanho máximo: 5MB.' });
        }
        return res.status(400).json({ mensagem: `Erro no upload: ${err.message}` });
      } else if (err) {
        // Erro personalizado ou outro erro
        return res.status(400).json({ mensagem: err.message });
      }
      // Sem erros, continuar
      next();
    });
  };
};

module.exports = {
  uploadFotoUsuario: handleUploadError(uploadFotoUsuario),
  uploadFotoPaciente: handleUploadError(uploadFotoPaciente),
  uploadAnexosEvolucao: handleUploadError(uploadAnexosEvolucao)
};