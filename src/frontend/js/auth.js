// Funções de autenticação

// Verificar se o usuário está autenticado
async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirecionar para login se não estiver na página de login ou registro
    if (!window.location.hash.includes('#/login') && !window.location.hash.includes('#/registro')) {
      navigateTo('#/login');
    }
    return false;
  }
  
  // Verificar se acabamos de fazer login
  const loginRecente = sessionStorage.getItem('loginRecente') === 'true';
  if (loginRecente) {
    // Se acabamos de fazer login, não verificar o token novamente
    // Limpar a flag após uso
    sessionStorage.removeItem('loginRecente');
    return true;
  }
  
  try {
    // Verificar se o token é válido
    const response = await apiRequest('auth/verificar', 'GET');
    if (response.mensagem === 'Token válido' || response.valid) {
      // Armazenar dados do usuário
      if (response.usuario) {
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
      }
      return true;
    } else {
      // Verificar se acabamos de registrar
      const registroRecente = sessionStorage.getItem('registroRecente') === 'true';
      
      // Limpar a flag após uso
      if (registroRecente) {
        sessionStorage.removeItem('registroRecente');
      }
      
      // Se acabamos de registrar, não mostrar mensagem de logout
      logout(registroRecente);
      return false;
    }
  } catch (error) {
    console.error('Erro na verificação de autenticação:', error);
    
    // Verificar se acabamos de registrar
    const registroRecente = sessionStorage.getItem('registroRecente') === 'true';
    
    // Limpar a flag após uso
    if (registroRecente) {
      sessionStorage.removeItem('registroRecente');
    }
    
    // Se acabamos de registrar, não mostrar mensagem de logout
    logout(registroRecente);
    return false;
  }
}

// Função de login
async function login(usuario, senha) {
  try {
    const response = await apiRequest('auth/login', 'POST', { usuario, senha });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      // Definir uma flag para indicar que acabamos de fazer login
      sessionStorage.setItem('loginRecente', 'true');
      showToast('Login realizado com sucesso!');
      navigateTo('#/dashboard');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Função de registro
async function registro(dados) {
  try {
    // Converter data de nascimento do formato DD/MM/YYYY para YYYY-MM-DD
    if (dados.data_nascimento) {
      const partesData = dados.data_nascimento.split('/');
      if (partesData.length === 3) {
        const dia = partesData[0].padStart(2, '0');
        const mes = partesData[1].padStart(2, '0');
        const ano = partesData[2];
        
        // Validar se a data é válida
        const dataObj = new Date(`${ano}-${mes}-${dia}`);
        if (isNaN(dataObj.getTime())) {
          showToast('Data de nascimento inválida. Use o formato DD/MM/AAAA com uma data válida.', 'red');
          return false;
        }
        
        dados.data_nascimento = `${ano}-${mes}-${dia}`;
      } else {
        showToast('Formato de data inválido. Use DD/MM/AAAA.', 'red');
        return false;
      }
    }
    
    // Filtrar apenas campos válidos do usuário
    const camposValidos = ['usuario', 'senha', 'nome_completo', 'cpf', 'crp', 'email', 'telefone', 'data_nascimento', 'especialidade', 'endereco'];
    const dadosLimpos = {};
    
    camposValidos.forEach(campo => {
      if (dados[campo] !== undefined && dados[campo] !== null) {
        dadosLimpos[campo] = dados[campo];
      }
    });
    
    // Verificar campos obrigatórios
    const camposObrigatorios = ['usuario', 'senha', 'nome_completo', 'cpf', 'crp', 'email'];
    const camposFaltantes = camposObrigatorios.filter(campo => !dadosLimpos[campo]);
    
    if (camposFaltantes.length > 0) {
      showToast(`Campos obrigatórios faltando: ${camposFaltantes.join(', ')}`, 'red');
      return false;
    }
    
    // Usar dados limpos em vez dos dados originais
    dados = dadosLimpos;
    
    // Remover caracteres especiais do CPF antes de enviar
    if (dados.cpf) {
      dados.cpf = dados.cpf.replace(/[^0-9]/g, '');
    }
    
    const response = await apiRequest('auth/registrar', 'POST', dados);
    if (response && response.token) {
      // NÃO armazenar token e usuário para evitar login automático
      showToast('Registro realizado com sucesso! Faça login para acessar o sistema.');
      
      // Redirecionar para a tela de login
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1500);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro no registro:', error);
    if (error.response && error.response.data) {
      // Exibir mensagem de erro detalhada
      const errorData = error.response.data;
      let mensagemErro = errorData.mensagem || 'Erro no registro';
      let dica = '';
      
      // Adicionar detalhes do erro se disponíveis
      if (errorData.erro) {
        console.error(`Código de erro: ${errorData.erro}`);
        console.error(`Detalhe: ${errorData.detalhe || 'Não disponível'}`);
        
        // Adicionar dicas específicas baseadas no tipo de erro
        switch(errorData.erro) {
          case 'ER_DUP_ENTRY':
            if (errorData.detalhe.includes('usuário')) {
              dica = 'Tente outro nome de usuário';
            } else if (errorData.detalhe.includes('CPF')) {
              dica = 'Verifique se o CPF está correto ou use outro CPF';
            } else if (errorData.detalhe.includes('email')) {
              dica = 'Use outro endereço de email ou verifique se já possui cadastro';
            } else if (errorData.detalhe.includes('CRP')) {
              dica = 'Verifique se o CRP está correto ou entre em contato com o suporte';
            }
            break;
          case 'FORMATO_DATA_INVALIDO':
          case 'DATA_INVALIDA':
            dica = 'Digite a data no formato DD/MM/AAAA com uma data válida';
            break;
          case 'ER_DATA_TOO_LONG':
            dica = 'Um ou mais campos contêm texto muito longo. Reduza o tamanho do texto';
            break;
          default:
            if (errorData.detalhe && errorData.detalhe !== 'Não disponível') {
              dica = errorData.detalhe;
            }
        }
      }
      
      // Adicionar dica à mensagem para o usuário
      if (dica) {
        mensagemErro += `\n\nDica: ${dica}`;
      }
      
      showToast(mensagemErro, 'red');
    } else {
      showToast('Erro ao realizar registro. Verifique os dados e tente novamente.', 'red');
    }
    return false;
  }
}

// Função de logout
function logout(silencioso = false) {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  navigateTo('#/login');
  if (!silencioso) {
    showToast('Você foi desconectado');
  }
}

// Obter dados do usuário logado
function getUsuarioLogado() {
  const usuarioJSON = localStorage.getItem('usuario');
  return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

// Inicializar eventos de autenticação
function initAuthEvents() {
  // Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!validateForm('login-form')) {
        showToast('Preencha todos os campos obrigatórios', 'red');
        return;
      }
      
      const usuario = document.getElementById('usuario').value;
      const senha = document.getElementById('senha').value;
      
      // Mostrar preloader
      document.getElementById('login-button').disabled = true;
      document.getElementById('login-preloader').style.display = 'block';
      
      await login(usuario, senha);
      
      // Esconder preloader
      document.getElementById('login-button').disabled = false;
      document.getElementById('login-preloader').style.display = 'none';
    });
  }
  
  // Registro
  const registroForm = document.getElementById('registro-form');
  if (registroForm) {
    registroForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!validateForm('registro-form')) {
        showToast('Preencha todos os campos obrigatórios', 'red');
        return;
      }
      
      const dados = getFormData('registro-form');
      
      // Verificar se as senhas coincidem
      if (dados.senha !== dados.confirmar_senha) {
        showToast('As senhas não coincidem', 'red');
        return;
      }
      
      // Validar CPF
      if (dados.cpf && !validarCPF(dados.cpf)) {
        showToast('CPF inválido', 'red');
        document.getElementById('cpf').classList.add('invalid');
        return;
      }
      
      // Remover campo de confirmação de senha
      delete dados.confirmar_senha;
      
      // Mostrar preloader
      document.getElementById('registro-button').disabled = true;
      document.getElementById('registro-preloader').style.display = 'block';
      
      await registro(dados);
      
      // Esconder preloader
      document.getElementById('registro-button').disabled = false;
      document.getElementById('registro-preloader').style.display = 'none';
    });
  }
  
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
}