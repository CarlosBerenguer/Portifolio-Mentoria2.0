// Inicialização do Materialize
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar componentes do Materialize
  M.AutoInit();
  
  // Inicializar o roteador
  if (typeof window.initRouter === 'function') {
    window.initRouter();
  } else {
    console.error('Função initRouter não encontrada');
  }
  
  // Verificar autenticação
  if (typeof checkAuth === 'function') {
    checkAuth();
  }
  
  // Adicionar botão de toggle do menu
  adicionarBotaoToggleMenu();
  
  // Inicializar estado do menu a partir do localStorage
  inicializarEstadoMenu();
});

// Função para exibir mensagens de toast
function showToast(message, classes = 'green') {
  // Substituir quebras de linha por <br> para exibição HTML
  const htmlMessage = message.replace(/\n/g, '<br>');
  M.toast({html: htmlMessage, classes: `${classes} custom-toast`, displayLength: 6000});
}

// Função para exibir erros
function showError(error) {
  console.error('Erro na requisição:', error);
  
  if (error.response && error.response.data) {
    const errorData = error.response.data;
    let mensagemErro = errorData.mensagem || 'Erro na requisição';
    
    // Não exibir toast para casos específicos onde não há dados (não são erros reais)
    const mensagensNaoExibirToast = [
      'Paciente não encontrado',
      'Evolução não encontrada',
      'Nenhum paciente encontrado',
      'Nenhuma evolução encontrada'
    ];
    
    // Tratar erros HTTP 500 de forma especial
    if (error.response.status === 500) {
      console.error('Erro interno do servidor:', errorData);
      mensagemErro = 'Erro interno do servidor. Tente novamente em alguns instantes.';
    }
    
    // Exibir detalhes do erro no console para depuração
    if (errorData.erro) {
      console.error(`Código de erro: ${errorData.erro}`);
      console.error(`Detalhe: ${errorData.detalhe || 'Não disponível'}`);
      
      // Adicionar detalhes à mensagem para o usuário (exceto para erros 500)
      if (errorData.detalhe && errorData.detalhe !== 'Não disponível' && error.response.status !== 500) {
        mensagemErro += ` - ${errorData.detalhe}`;
      }
    }
    
    // Só exibir toast se não for uma mensagem de "não encontrado"
    if (!mensagensNaoExibirToast.some(msg => mensagemErro.includes(msg))) {
      showToast(mensagemErro, 'red');
    }
  } else {
    showToast('Ocorreu um erro na requisição. Por favor, tente novamente.', 'red');
  }
}

// Função para adicionar botão de toggle do menu
function adicionarBotaoToggleMenu() {
  // Criar o botão de toggle
  const toggleButton = document.createElement('div');
  toggleButton.className = 'menu-toggle';
  toggleButton.innerHTML = '<i class="material-icons">chevron_left</i>';
  toggleButton.title = 'Recolher menu';
  document.body.appendChild(toggleButton);
  
  // Adicionar evento de clique
  toggleButton.addEventListener('click', function() {
    toggleMenu();
  });
}

// Função para alternar o estado do menu
function toggleMenu() {
  const sidenav = document.getElementById('sidenav');
  const main = document.querySelector('main');
  const toggleButton = document.querySelector('.menu-toggle');
  
  if (sidenav && main && toggleButton) {
    // Alternar classes
    sidenav.classList.toggle('collapsed');
    main.classList.toggle('menu-collapsed');
    toggleButton.classList.toggle('collapsed');
    
    // Atualizar ícone e título
    const icon = toggleButton.querySelector('i');
    if (sidenav.classList.contains('collapsed')) {
      icon.textContent = 'chevron_right';
      toggleButton.title = 'Expandir menu';
    } else {
      icon.textContent = 'chevron_left';
      toggleButton.title = 'Recolher menu';
    }
    
    // Salvar estado no localStorage
    const menuCollapsed = sidenav.classList.contains('collapsed');
    localStorage.setItem('menuCollapsed', menuCollapsed);
  }
}

// Função para inicializar o estado do menu a partir do localStorage
function inicializarEstadoMenu() {
  const menuCollapsed = localStorage.getItem('menuCollapsed') === 'true';
  const sidenav = document.getElementById('sidenav');
  const main = document.querySelector('main');
  const toggleButton = document.querySelector('.menu-toggle');
  
  if (sidenav && main && toggleButton && menuCollapsed) {
    // Aplicar classes
    sidenav.classList.add('collapsed');
    main.classList.add('menu-collapsed');
    toggleButton.classList.add('collapsed');
    
    // Atualizar ícone e título
    const icon = toggleButton.querySelector('i');
    icon.textContent = 'chevron_right';
    toggleButton.title = 'Expandir menu';
  }
}

// Função para validar CPF
function validarCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  if (dv1 !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;
  if (dv2 !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

// Função para carregar template
async function loadTemplate(templateName) {
  try {
    const response = await fetch(`/pages/${templateName}.html`);
    if (!response.ok) throw new Error(`Erro ao carregar template: ${response.status}`);
    return await response.text();
  } catch (error) {
    showError(error);
    return '<div class="center-align"><h4>Erro ao carregar página</h4></div>';
  }
}

// Função para renderizar template no elemento
async function renderTemplate(elementId, templateName, data = {}) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const template = await loadTemplate(templateName);
  element.innerHTML = template;
  
  // Inicializar componentes do Materialize após renderizar o template
  M.AutoInit();
  
  return element;
}

// Função para fazer requisições à API
async function apiRequest(endpoint, method = 'GET', data = null, contentType = 'application/json') {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': contentType,
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      method,
      headers
    };
    
    if (data) {
      if (contentType === 'application/json') {
        config.body = JSON.stringify(data);
      } else {
        config.body = data;
      }
    }
    
    console.log(`Enviando requisição para ${endpoint}:`, data);
    
    try {
      const response = await fetch(`/api/${endpoint}`, config);
      
      // Verificar o tipo de conteúdo da resposta
      const contentTypeHeader = response.headers.get('content-type');
      
      // Se não for JSON, tratar como erro
      if (!contentTypeHeader || !contentTypeHeader.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não-JSON recebida:', text);
        showToast('Erro de comunicação com o servidor. Por favor, tente novamente.', 'red');
        throw new Error('Resposta inválida do servidor. Por favor, tente novamente.');
      }
      
      const responseData = await response.json();
      
      if (!response.ok) {
        // Criar um objeto de erro mais detalhado
        const errorObj = { 
          response: { 
            data: responseData,
            status: response.status,
            statusText: response.statusText
          } 
        };
        console.error(`Erro HTTP ${response.status}: ${response.statusText}`, responseData);
        throw errorObj;
      }
      
      return responseData;
    } catch (fetchError) {
      // Verificar se é um erro de rede
      if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
        console.error('Erro de conexão com o servidor:', fetchError);
        showToast('Não foi possível conectar ao servidor. Verifique sua conexão.', 'red');
      }
      throw fetchError;
    }
  } catch (error) {
    showError(error);
    throw error;
  }
}

// Função para formatar data
function formatDate(dateString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para formatar data e hora
function formatDateTime(dateString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para validar formulário
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  console.log('=== DEBUG validateForm ===');
  console.log('Form ID:', formId);
  
  let isValid = true;
  let errorMessages = [];
  const inputs = form.querySelectorAll('input, textarea, select');
  
  console.log('Inputs para validação:', inputs.length);
  
  inputs.forEach(input => {
    console.log(`Validando campo: ${input.name} = "${input.value}" (required: ${input.required})`);
    // Validação de campos obrigatórios
    if (input.required && !input.value.trim()) {
      input.classList.add('invalid');
      const fieldName = input.previousElementSibling ? input.previousElementSibling.textContent : input.name;
      errorMessages.push(`O campo ${fieldName} é obrigatório`);
      isValid = false;
      return;
    }
    
    // Validação de email
    if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        input.classList.add('invalid');
        errorMessages.push('Formato de e-mail inválido');
        isValid = false;
        return;
      }
    }
    
    // Validação de CPF
    if (input.name === 'cpf' && input.value.trim()) {
      const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/;
      if (!cpfRegex.test(input.value.trim())) {
        input.classList.add('invalid');
        errorMessages.push('Formato de CPF inválido (ex: 123.456.789-00)');
        isValid = false;
        return;
      }
    }
    
    // Validação de telefone
    if (input.name === 'telefone' && input.value.trim()) {
      const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
      if (!telefoneRegex.test(input.value.trim())) {
        input.classList.add('invalid');
        errorMessages.push('Formato de telefone inválido (ex: (11) 98765-4321)');
        isValid = false;
        return;
      }
    }
    
    // Se passou por todas as validações, remove a classe invalid
    input.classList.remove('invalid');
  });
  
  // Exibir mensagens de erro se houver
  if (errorMessages.length > 0) {
    console.log('Erros de validação:', errorMessages);
    showToast(errorMessages[0], 'red');
  }
  
  console.log('Resultado da validação:', isValid);
  console.log('=== FIM DEBUG validateForm ===');
  
  return isValid;
}

// Função para obter dados do formulário
function getFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return null;
  
  console.log('=== DEBUG getFormData ===');
  console.log('Form ID:', formId);
  
  const formData = {};
  const inputs = form.querySelectorAll('input, textarea, select');
  
  console.log('Inputs encontrados:', inputs.length);
  
  inputs.forEach(input => {
    if (input.name) {
      formData[input.name] = input.value;
      console.log(`Campo: ${input.name} = ${input.value}`);
    }
  });
  
  console.log('Dados coletados:', JSON.stringify(formData, null, 2));
  console.log('=== FIM DEBUG getFormData ===');
  
  return formData;
}

// Função para preencher formulário com dados
function fillFormData(formId, data) {
  const form = document.getElementById(formId);
  if (!form || !data) return;
  
  Object.keys(data).forEach(key => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) {
      if (input.type === 'date' && data[key]) {
        // Formatar data para o formato yyyy-mm-dd para inputs de data
        const date = new Date(data[key]);
        input.value = date.toISOString().split('T')[0];
      } else {
        input.value = data[key] || '';
      }
      
      // Atualizar labels para efeito do Materialize
      if (input.value) {
        const label = input.nextElementSibling;
        if (label && label.classList.contains('active') === false) {
          label.classList.add('active');
        }
      }
    }
  });
  
  // Reinicializar selects do Materialize
  M.FormSelect.init(form.querySelectorAll('select'));
}