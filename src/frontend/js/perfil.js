// Funções relacionadas ao perfil do usuário

let usuarioData = null;
let modoEdicao = false;

// Função para carregar dados do perfil
async function carregarPerfil() {
  try {
    // Exibir loading
    document.getElementById('perfil-loading').style.display = 'block';
    document.getElementById('perfil-content').style.display = 'none';
    
    // Buscar dados do usuário
    usuarioData = await apiRequest('usuarios/perfil');
    
    // Preencher dados do usuário na página
    preencherDadosVisualizacao();
    
    // Ocultar loading
    document.getElementById('perfil-loading').style.display = 'none';
    document.getElementById('perfil-content').style.display = 'block';
    
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    M.toast({html: 'Erro ao carregar dados do perfil', classes: 'red'});
    document.getElementById('perfil-loading').innerHTML = `
      <div class="center-align" style="padding: 40px;">
        <i class="material-icons large red-text">error</i>
        <p>Erro ao carregar dados do perfil. <a href="#/dashboard">Voltar para dashboard</a></p>
      </div>
    `;
  }
}

// Função para preencher dados no modo visualização
function preencherDadosVisualizacao() {
  if (!usuarioData) return;
  
  // Dados principais
  document.getElementById('nome-usuario').textContent = usuarioData.nome_completo || 'Nome não informado';
  document.getElementById('email-usuario').textContent = usuarioData.email || 'Email não informado';
  
  // Formatar data de cadastro
  if (usuarioData.criado_em) {
    const dataCadastro = new Date(usuarioData.criado_em);
    document.getElementById('data-cadastro').textContent = `Membro desde: ${formatDate(dataCadastro)}`;
  }
  
  // Foto de perfil
  if (usuarioData.foto) {
    document.getElementById('preview-foto').src = usuarioData.foto;
    const userImage = document.getElementById('user-image');
    if (userImage) userImage.src = usuarioData.foto;
  }
  
  // Dados detalhados no modo visualização
  document.getElementById('view-nome-completo').textContent = usuarioData.nome_completo || '-';
  document.getElementById('view-usuario').textContent = usuarioData.usuario || '-';
  document.getElementById('view-email').textContent = usuarioData.email || '-';
  document.getElementById('view-cpf').textContent = formatCPF(usuarioData.cpf) || '-';
  document.getElementById('view-crp').textContent = usuarioData.crp || '-';
  document.getElementById('view-data-nascimento').textContent = usuarioData.data_nascimento ? formatDate(new Date(usuarioData.data_nascimento)) : '-';
  document.getElementById('view-telefone').textContent = formatTelefone(usuarioData.telefone) || '-';
  document.getElementById('view-especialidade').textContent = usuarioData.especialidade || '-';
  document.getElementById('view-endereco').textContent = usuarioData.endereco || '-';
  
  // Atualizar dados na sidenav
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  if (userName) userName.textContent = usuarioData.nome_completo || 'Usuário';
  if (userEmail) userEmail.textContent = usuarioData.email || '';
}

// Função para preencher dados no modo edição
function preencherDadosEdicao() {
  if (!usuarioData) return;
  
  document.getElementById('edit-nome-completo').value = usuarioData.nome_completo || '';
  document.getElementById('edit-usuario').value = usuarioData.usuario || '';
  document.getElementById('edit-email').value = usuarioData.email || '';
  document.getElementById('edit-cpf').value = usuarioData.cpf || '';
  document.getElementById('edit-crp').value = usuarioData.crp || '';
  document.getElementById('edit-telefone').value = usuarioData.telefone || '';
  document.getElementById('edit-especialidade').value = usuarioData.especialidade || '';
  document.getElementById('edit-endereco').value = usuarioData.endereco || '';
  
  // Formatar data de nascimento para o input
  if (usuarioData.data_nascimento) {
    const dataNascimento = new Date(usuarioData.data_nascimento);
    document.getElementById('edit-data-nascimento').value = formatDateForInput(dataNascimento);
  }
  
  // Atualizar labels para efeito flutuante do Materialize
  M.updateTextFields();
}

// Função para alternar para modo edição
function ativarModoEdicao() {
  modoEdicao = true;
  document.getElementById('modo-visualizacao').style.display = 'none';
  document.getElementById('modo-edicao').style.display = 'block';
  
  // Preencher dados no formulário
  preencherDadosEdicao();
}

// Função para cancelar edição
function cancelarEdicao() {
  modoEdicao = false;
  document.getElementById('modo-edicao').style.display = 'none';
  document.getElementById('modo-visualizacao').style.display = 'block';
  
  // Limpar formulário de senha
  document.getElementById('form-senha').reset();
}

// Função para atualizar perfil
async function atualizarPerfil() {
  try {
    const form = document.getElementById('form-perfil');
    const formData = new FormData(form);
    
    // Validar campos obrigatórios
    const nomeCompleto = document.getElementById('edit-nome-completo').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const cpf = document.getElementById('edit-cpf').value.trim();
    const crp = document.getElementById('edit-crp').value.trim();
    
    if (!nomeCompleto || !email || !cpf || !crp) {
      M.toast({html: 'Preencha todos os campos obrigatórios', classes: 'red'});
      return;
    }
    
    // Validar CPF
    if (!validarCPF(cpf)) {
      M.toast({html: 'CPF inválido', classes: 'red'});
      return;
    }
    
    // Validar email
    if (!validarEmail(email)) {
      M.toast({html: 'Email inválido', classes: 'red'});
      return;
    }
    
    // Preparar dados para envio (sem foto por enquanto)
    const dados = {
      nome_completo: nomeCompleto,
      email: email,
      cpf: cpf.replace(/\D/g, ''), // Remove formatação do CPF
      crp: crp,
      telefone: document.getElementById('edit-telefone').value.trim(),
      especialidade: document.getElementById('edit-especialidade').value.trim(),
      endereco: document.getElementById('edit-endereco').value.trim(),
      data_nascimento: document.getElementById('edit-data-nascimento').value
    };
    
    // Enviar dados para a API
    const response = await apiRequest(`usuarios/${usuarioData.id}`, 'PUT', dados);
    
    // Atualizar dados locais
    usuarioData = { ...usuarioData, ...response };
    
    // Exibir mensagem de sucesso
    M.toast({html: 'Perfil atualizado com sucesso!', classes: 'green'});
    
    // Voltar para modo visualização
    cancelarEdicao();
    
    // Atualizar visualização
    preencherDadosVisualizacao();
    
    // Atualizar dados do usuário no localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');
    usuarioLogado.nome_completo = response.nome_completo;
    usuarioLogado.email = response.email;
    localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    M.toast({html: error.message || 'Erro ao atualizar perfil', classes: 'red'});
  }
}

// Função para alterar senha
async function alterarSenha() {
  try {
    const senhaAtual = document.getElementById('senha-atual').value;
    const novaSenha = document.getElementById('nova-senha').value;
    const confirmarSenha = document.getElementById('confirmar-nova-senha').value;
    
    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      M.toast({html: 'Preencha todos os campos de senha', classes: 'red'});
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      M.toast({html: 'As senhas não coincidem', classes: 'red'});
      return;
    }
    
    if (novaSenha.length < 6) {
      M.toast({html: 'A nova senha deve ter pelo menos 6 caracteres', classes: 'red'});
      return;
    }
    
    // Preparar dados para envio
    const dados = {
      senha_atual: senhaAtual,
      nova_senha: novaSenha
    };
    
    // Enviar dados para a API
    await apiRequest(`usuarios/${usuarioData.id}/senha`, 'PUT', dados);
    
    // Exibir mensagem de sucesso
    M.toast({html: 'Senha alterada com sucesso!', classes: 'green'});
    
    // Limpar formulário
    document.getElementById('form-senha').reset();
    
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    M.toast({html: error.message || 'Erro ao alterar senha', classes: 'red'});
  }
}

// Função para upload de foto
function handleFotoUpload() {
  const input = document.getElementById('foto-input');
  const file = input.files[0];
  
  if (file) {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      M.toast({html: 'Selecione apenas arquivos de imagem', classes: 'red'});
      return;
    }
    
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      M.toast({html: 'A imagem deve ter no máximo 5MB', classes: 'red'});
      return;
    }
    
    // Preview da imagem
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('preview-foto').src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // TODO: Implementar upload da foto para o servidor
    // Por enquanto, apenas mostra o preview
  }
}

// Funções de formatação
function formatCPF(cpf) {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatTelefone(telefone) {
  if (!telefone) return '';
  const cleaned = telefone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString('pt-BR');
}

function formatDateForInput(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

// Funções de validação
function validarCPF(cpf) {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Função para aplicar máscaras
function aplicarMascaras() {
  // Máscara para CPF
  const cpfInput = document.getElementById('edit-cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
    });
  }
  
  // Máscara para telefone
  const telefoneInput = document.getElementById('edit-telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      e.target.value = value;
    });
  }
  
  // Máscara para data de nascimento
  const dataInput = document.getElementById('edit-data-nascimento');
  if (dataInput) {
    dataInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{2})(\d)/, '$1/$2');
      value = value.replace(/(\d{2})(\d)/, '$1/$2');
      e.target.value = value;
    });
  }
}

// Função para inicializar a página de perfil
function initPerfilPage() {
  // Inicializar componentes do Materialize
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  
  // Event listeners para botões
  document.getElementById('btn-editar').addEventListener('click', ativarModoEdicao);
  document.getElementById('btn-cancelar').addEventListener('click', cancelarEdicao);
  document.getElementById('btn-salvar').addEventListener('click', atualizarPerfil);
  
  // Event listeners para formulários
  document.getElementById('form-perfil').addEventListener('submit', function(e) {
    e.preventDefault();
    atualizarPerfil();
  });
  
  document.getElementById('form-senha').addEventListener('submit', function(e) {
    e.preventDefault();
    alterarSenha();
  });
  
  // Event listener para upload de foto
  document.getElementById('foto-input').addEventListener('change', handleFotoUpload);
  
  // Event listeners para logout
  const logoutBtns = document.querySelectorAll('#logout-btn, #logout-btn-sidenav');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  });
  
  // Aplicar máscaras
  aplicarMascaras();
  
  // Carregar dados do usuário
  carregarPerfil();
}