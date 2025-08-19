// Sistema de roteamento para SPA (Single Page Application)

// Definição das rotas
const routes = {
  '#/': { template: 'login', auth: false },
  '#/login': { template: 'login', auth: false },
  '#/registro': { template: 'registro', auth: false },
  '#/dashboard': { template: 'dashboard', auth: true },
  '#/perfil': { template: 'perfil', auth: true },
  '#/prontuarios': { template: 'pacientes', auth: true },
  '#/prontuarios/novo': { template: 'paciente-novo', auth: true },
  '#/prontuarios/editar': { template: 'paciente-editar', auth: true },
  '#/prontuarios/visualizar': { template: 'paciente-visualizar', auth: true },
  '#/evolucoes/novo': { template: 'evolucao-nova', auth: true },
  '#/evolucoes/editar': { template: 'evolucao-editar', auth: true }
};

// Função para navegar para uma rota
function navigateTo(path) {
  // Remover o # inicial se existir
  const hashPath = path.startsWith('#') ? path : `#${path}`;
  window.location.hash = hashPath;
}

// Função para obter parâmetros da URL
function getUrlParams() {
  const params = {};
  const queryString = window.location.hash.split('?')[1];
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
  }
  return params;
}

// Função para renderizar a página atual
async function renderPage() {
  const app = document.getElementById('app');
  if (!app) return;
  
  // Obter a rota atual
  let path = window.location.hash || '#/';
  path = path.split('?')[0]; // Remover parâmetros da URL
  
  // Verificar se a rota existe
  const route = routes[path] || routes['#/'];
  
  // Verificar autenticação
  if (route.auth && !(await checkAuth())) {
    navigateTo('#/login');
    return;
  }
  
  // Carregar template
  app.innerHTML = '<div class="center-align" style="margin-top: 20vh;"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div><h4 class="grey-text text-darken-2">Carregando...</h4></div>';
  
  const template = await loadTemplate(route.template);
  app.innerHTML = template;
  
  // Inicializar componentes do Materialize
  M.AutoInit();
  
  // Inicializar eventos específicos da página
  initPageEvents(route.template);
  
  // Inicializar eventos de autenticação
  initAuthEvents();
  
  // Atualizar menu lateral
  updateSidebar();
}

// Função para inicializar eventos específicos da página
function initPageEvents(template) {
  switch (template) {
    case 'dashboard':
      carregarDadosDashboard();
      break;
    case 'pacientes':
      initPacientes();
      break;
    case 'paciente-novo':
    case 'paciente-editar':
      initPacienteForm();
      break;
    case 'paciente-visualizar':
      initPacienteDetalhes();
      break;
    case 'evolucao-nova':
    case 'evolucao-editar':
      initEvolucaoForm();
      break;
    case 'perfil':
      initPerfilPage();
      break;
    case 'registro':
      initRegistro();
      break;
    case 'evolucao-visualizar':
      initEvolucaoVisualizacao();
      break;
  }
}

// Função para atualizar o menu lateral
function updateSidebar() {
  const usuario = getUsuarioLogado();
  if (!usuario) return;
  
  const userNameElement = document.getElementById('user-name');
  const userEmailElement = document.getElementById('user-email');
  const userImageElement = document.getElementById('user-image');
  
  if (userNameElement) userNameElement.textContent = usuario.nome_completo || 'Usuário';
  if (userEmailElement) userEmailElement.textContent = usuario.email || '';
  if (userImageElement) {
    if (usuario.foto_perfil) {
      // Se há foto, mostrar a imagem normalmente
      userImageElement.src = usuario.foto_perfil;
      userImageElement.style.display = 'block';
      // Remover placeholder se existir
      const placeholder = userImageElement.parentNode.querySelector('.user-photo-placeholder');
      if (placeholder) {
        placeholder.remove();
      }
    } else {
      // Se não há foto, esconder a imagem e criar placeholder
      userImageElement.style.display = 'none';
      
      // Verificar se já existe um placeholder
      let placeholder = userImageElement.parentNode.querySelector('.user-photo-placeholder');
      if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'user-photo-placeholder circle';
        placeholder.innerHTML = '<div>Foto</div><div>Logo</div>';
        placeholder.setAttribute('data-tooltip', 'Local para mostrar Foto do usuário ou Logo da empresa');
        userImageElement.parentNode.appendChild(placeholder);
      }
    }
  }
}

// Inicializar o roteador
function initRouter() {
  // Evento de mudança de hash
  window.addEventListener('hashchange', renderPage);
  
  // Renderizar página inicial
  renderPage();
}

// Funções de inicialização de páginas (serão implementadas em arquivos separados)
function initDashboard() {
  console.log('Dashboard inicializado');
  
  // Carregar dados do dashboard
  try {
    // Inicializar componentes do Materialize
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
    
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems);
    
    // Carregar estatísticas e dados do dashboard
    carregarDadosDashboard();
  } catch (error) {
    console.error('Erro ao inicializar dashboard:', error);
    showToast('Erro ao carregar dashboard', 'red');
  }
}

// Função para carregar dados do dashboard
async function carregarDadosDashboard() {
  try {
    // Inicializar containers com mensagem de carregamento
    const pacientesContainer = document.getElementById('ultimos-pacientes-container');
    
    // Carregar estatísticas
    try {
      const estatisticas = await apiRequest('pacientes/estatisticas');
      document.getElementById('total-pacientes').textContent = estatisticas.totalPacientes || 0;
      document.getElementById('evolucoes-mes').textContent = estatisticas.evolucoesMes || 0;
      document.getElementById('evolucoes-hoje').textContent = estatisticas.evolucoesHoje || 0;
      document.getElementById('pacientes-novos').textContent = estatisticas.pacientesNovos || 0;
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      // Definir valores padrão para estatísticas
      document.getElementById('total-pacientes').textContent = '0';
      document.getElementById('evolucoes-mes').textContent = '0';
      document.getElementById('evolucoes-hoje').textContent = '0';
      document.getElementById('pacientes-novos').textContent = '0';
    }
    
    // Carregar últimos pacientes
    try {
      const pacientes = await apiRequest('pacientes?limite=3');
      
      if (!pacientes || pacientes.length === 0) {
        pacientesContainer.innerHTML = `
          <div class="center-align" style="padding: 20px;">
            <i class="material-icons medium" style="color: #9e9e9e;">person_off</i>
            <p>Nenhum paciente cadastrado.</p>
            <a href="#/prontuarios/novo" class="btn-small waves-effect waves-light teal">
              <i class="material-icons left">add</i>Cadastrar Paciente
            </a>
          </div>
        `;
      } else {
        let html = '<ul class="collection">';
        pacientes.forEach(paciente => {
          html += `
            <li class="collection-item avatar">
              <img src="${paciente.foto || paciente.foto_perfil || '/images/user-default.png'}" alt="" class="circle">
              <span class="title">${paciente.nome_completo}</span>
              <p>${paciente.telefone || 'Sem telefone'}<br>
                 ${paciente.email || 'Sem email'}
              </p>
              <a href="#/prontuarios/visualizar?id=${paciente.id}" class="secondary-content"><i class="material-icons">visibility</i></a>
            </li>
          `;
        });
        html += '</ul>';
        pacientesContainer.innerHTML = html;
      }
    } catch (err) {
      console.error('Erro ao carregar últimos pacientes:', err);
      pacientesContainer.innerHTML = `
        <div class="center-align" style="padding: 20px;">
          <i class="material-icons medium" style="color: #f44336;">error_outline</i>
          <p>Não foi possível carregar os pacientes.</p>
          <button class="btn-small waves-effect waves-light teal reload-pacientes">
            <i class="material-icons left">refresh</i>Tentar Novamente
          </button>
        </div>
      `;
      
      // Adicionar evento para tentar novamente
      const reloadBtn = pacientesContainer.querySelector('.reload-pacientes');
      if (reloadBtn) {
        reloadBtn.addEventListener('click', async () => {
          pacientesContainer.innerHTML = `
            <div class="center-align" style="padding: 20px;">
              <div class="preloader-wrapper small active">
                <div class="spinner-layer spinner-blue-only">
                  <div class="circle-clipper left"><div class="circle"></div></div>
                  <div class="gap-patch"><div class="circle"></div></div>
                  <div class="circle-clipper right"><div class="circle"></div></div>
                </div>
              </div>
              <p>Carregando pacientes...</p>
            </div>
          `;
          
          try {
            const pacientes = await apiRequest('pacientes?limite=3');
            if (!pacientes || pacientes.length === 0) {
              pacientesContainer.innerHTML = `
                <div class="center-align" style="padding: 20px;">
                  <i class="material-icons medium" style="color: #9e9e9e;">person_off</i>
                  <p>Nenhum paciente cadastrado.</p>
                  <a href="#/prontuarios/novo" class="btn-small waves-effect waves-light teal">
                    <i class="material-icons left">add</i>Cadastrar Paciente
                  </a>
                </div>
              `;
            } else {
              let html = '<ul class="collection">';
              pacientes.forEach(paciente => {
                html += `
                  <li class="collection-item avatar">
                    <img src="${paciente.foto || paciente.foto_perfil || '/images/user-default.png'}" alt="" class="circle">
                    <span class="title">${paciente.nome_completo}</span>
                    <p>${paciente.telefone || 'Sem telefone'}<br>
                       ${paciente.email || 'Sem email'}
                    </p>
                    <a href="#/prontuarios/visualizar?id=${paciente.id}" class="secondary-content"><i class="material-icons">visibility</i></a>
                  </li>
                `;
              });
              html += '</ul>';
              pacientesContainer.innerHTML = html;
            }
          } catch (error) {
            console.error('Erro ao recarregar pacientes:', error);
            pacientesContainer.innerHTML = `
              <div class="center-align" style="padding: 20px;">
                <i class="material-icons medium" style="color: #f44336;">error_outline</i>
                <p>Não foi possível carregar os pacientes.</p>
                <button class="btn-small waves-effect waves-light teal reload-pacientes">
                  <i class="material-icons left">refresh</i>Tentar Novamente
                </button>
              </div>
            `;
          }
        });
      }
    }

  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    showToast('Erro ao carregar dados do dashboard', 'red');
  }
}

function initPacientes() {
  console.log('Inicializando página de pacientes');
  
  // Inicializar busca de pacientes
  initBuscaPacientes();
  
  // Carregar pacientes inicialmente
  try {
    carregarPacientes();
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error);
  }
}

function initPacienteForm() {
  console.log('Formulário de paciente inicializado');
  
  // Inicializar máscaras para os campos
  $('#cpf').mask('000.000.000-00');
  $('#telefone').mask('(00) 00000-0000');
  $('#data_nascimento').mask('00/00/0000');
  
  // Personalizar mensagens de validação HTML5 em português
  const nomeInput = document.getElementById('nome_completo');
  const dataInput = document.getElementById('data_nascimento');
  const cpfInput = document.getElementById('cpf');
  const telefoneInput = document.getElementById('telefone');
  const emailInput = document.getElementById('email');
  
  if (nomeInput) {
    nomeInput.addEventListener('invalid', function() {
      if (this.validity.valueMissing) {
        this.setCustomValidity('Nome completo é obrigatório');
      } else {
        this.setCustomValidity('');
      }
    });
    nomeInput.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  }
  
  if (dataInput) {
    dataInput.addEventListener('invalid', function() {
      if (this.validity.valueMissing) {
        this.setCustomValidity('Data de nascimento é obrigatória');
      } else {
        this.setCustomValidity('');
      }
    });
    dataInput.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  }
  
  if (cpfInput) {
    cpfInput.addEventListener('invalid', function() {
      if (this.validity.valueMissing) {
        this.setCustomValidity('CPF é obrigatório');
      } else {
        this.setCustomValidity('');
      }
    });
    cpfInput.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  }
  
  if (telefoneInput) {
    telefoneInput.addEventListener('invalid', function() {
      if (this.validity.valueMissing) {
        this.setCustomValidity('Telefone é obrigatório');
      } else {
        this.setCustomValidity('');
      }
    });
    telefoneInput.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  }
  
  // Adicionar validação de email
  if (emailInput) {
    emailInput.addEventListener('invalid', function() {
      if (this.validity.typeMismatch) {
        this.setCustomValidity('Por favor, insira um email válido');
      } else {
        this.setCustomValidity('');
      }
    });
    emailInput.addEventListener('input', function() {
      this.setCustomValidity('');
    });
    emailInput.addEventListener('blur', function() {
      const email = this.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        this.classList.add('invalid');
      } else if (email) {
        this.classList.remove('invalid');
        this.classList.add('valid');
      }
    });
  }
  
  // Verificar se é edição e carregar dados do paciente
  const urlParams = getUrlParams();
  if (urlParams.id) {
    carregarDadosPaciente(urlParams.id);
  }
  
  // Inicializar formulário de paciente
  initFormularioPaciente();
}

function initPacienteDetalhes() {
  console.log('Detalhes do paciente inicializado');
  // Inicializar página de detalhes do paciente
  initDetalhesPaciente();
}

function initRegistro() {
  console.log('Registro inicializado');
  // Inicializar máscara para o campo de data de nascimento
  $('#data_nascimento').mask('00/00/0000');
  
  // Inicializar máscara para outros campos
  $('#cpf').mask('000.000.000-00');
  $('#telefone').mask('(00) 00000-0000');
  
  // Adicionar máscara para o campo CRP (formato XX/XXXXX)
  $('#crp').mask('00/00000');
  
  // Adicionar validação de CPF ao campo
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('blur', function() {
      const cpf = this.value;
      if (cpf && !validarCPF(cpf)) {
        this.classList.add('invalid');
        const helperText = this.nextElementSibling;
        if (helperText && helperText.classList.contains('helper-text')) {
          helperText.setAttribute('data-error', 'CPF inválido');
        }
      } else if (cpf) {
        this.classList.remove('invalid');
        this.classList.add('valid');
      }
    });
  }
  
  // Adicionar validação de email
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      const email = this.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        this.classList.add('invalid');
      } else if (email) {
        this.classList.remove('invalid');
        this.classList.add('valid');
      }
    });
  }
  
  // Adicionar evento para o botão de teste
  const testButton = document.getElementById('test-data-button');
  if (testButton) {
    testButton.addEventListener('click', function() {
      console.log('=== TESTE DE DADOS DO FORMULÁRIO ===');
      const dados = getFormData('registro-form');
      console.log('Dados coletados:', dados);
      console.log('Campos encontrados:', Object.keys(dados));
      console.log('Total de campos:', Object.keys(dados).length);
      
      // Mostrar no toast também
      M.toast({
        html: `Dados coletados: ${Object.keys(dados).length} campos. Veja o console para detalhes.`,
        classes: 'orange'
      });
    });
  }
}

function initEvolucaoForm() {
  console.log('Formulário de evolução inicializado');
  
  // Inicializar componentes do Materialize
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.FormSelect.init(document.querySelectorAll('select'));
  
  // Inicializar formulário de evolução
  initFormularioEvolucao();
}

function initPerfil() {
  console.log('Perfil inicializado');
  
  // Inicializar máscaras para os campos
  $('#cpf').mask('000.000.000-00');
  $('#telefone').mask('(00) 00000-0000');
  $('#crp').mask('00/00000');
  
  // Adicionar validação de email
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      const email = this.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        this.classList.add('invalid');
      } else if (email) {
        this.classList.remove('invalid');
        this.classList.add('valid');
      }
    });
  }
}

// Exportar funções para uso global
window.initRouter = initRouter;
window.checkAuth = checkAuth;
window.navigateTo = navigateTo;
window.getUrlParams = getUrlParams;