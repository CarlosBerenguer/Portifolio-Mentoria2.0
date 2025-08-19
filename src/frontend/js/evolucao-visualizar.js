// Funções relacionadas à visualização de evoluções

let evolucaoId = null;
let pacienteId = null;
let evolucaoData = null;
let pacienteData = null;

// Função para carregar dados da evolução
async function carregarEvolucaoVisualizacao() {
  try {
    // Exibir loading
    document.getElementById('evolucao-loading').style.display = 'block';
    document.getElementById('evolucao-content').style.display = 'none';
    
    // Buscar dados da evolução
    evolucaoData = await apiRequest(`evolucoes/${evolucaoId}`);
    pacienteId = evolucaoData.paciente_id;
    
    // Buscar dados do paciente
    pacienteData = await apiRequest(`pacientes/${pacienteId}`);
    
    // Preencher dados do paciente na página
    document.getElementById('paciente-nome').textContent = pacienteData.nome_completo;
    document.getElementById('paciente-foto').src = pacienteData.foto_perfil || '/images/user-default.png';
    
    // Calcular idade
    const idade = calcularIdade(pacienteData.data_nascimento);
    document.getElementById('paciente-idade').textContent = `${idade} anos (${formatDate(pacienteData.data_nascimento)})`;
    
    document.getElementById('paciente-telefone').textContent = pacienteData.telefone || 'Não informado';
    document.getElementById('paciente-email').textContent = pacienteData.email || 'Não informado';
    
    // Configurar links
    document.getElementById('ver-paciente').href = `#/prontuarios/visualizar?id=${pacienteId}`;
    document.getElementById('breadcrumb-paciente').href = `#/prontuarios/visualizar?id=${pacienteId}`;
    document.getElementById('breadcrumb-paciente').textContent = pacienteData.nome_completo;
    document.getElementById('voltar-paciente').href = `#/prontuarios/visualizar?id=${pacienteId}`;
    document.getElementById('editar-evolucao').href = `#/evolucoes/editar?id=${evolucaoId}`;
    
    // Preencher dados da evolução
    document.getElementById('evolucao-titulo').textContent = evolucaoData.titulo;
    
    // Extrair e formatar data e hora da evolução
    const dataHora = new Date(evolucaoData.data_evolucao);
    document.getElementById('evolucao-data').textContent = formatDate(dataHora);
    document.getElementById('evolucao-hora').textContent = formatTime(dataHora);
    
    // Formatar conteúdo da evolução (substituir quebras de linha por <br>)
    const conteudoFormatado = evolucaoData.conteudo.replace(/\n/g, '<br>');
    document.getElementById('evolucao-conteudo').innerHTML = conteudoFormatado;
    
    // Carregar anexos
    if (evolucaoData.anexos && evolucaoData.anexos.length > 0) {
      let anexosHtml = '';
      evolucaoData.anexos.forEach(anexo => {
        anexosHtml += `
          <a href="${anexo.url}" target="_blank" class="collection-item">
            <i class="material-icons left">insert_drive_file</i>
            ${anexo.nome_arquivo}
          </a>
        `;
      });
      document.getElementById('lista-anexos').innerHTML = anexosHtml;
      document.getElementById('anexos-container').style.display = 'block';
    } else {
      document.getElementById('anexos-container').style.display = 'none';
    }
    
    // Ocultar loading
    document.getElementById('evolucao-loading').style.display = 'none';
    document.getElementById('evolucao-content').style.display = 'block';
    
  } catch (error) {
    console.error('Erro ao carregar evolução:', error);
    M.toast({html: 'Erro ao carregar dados da evolução', classes: 'red'});
    document.getElementById('evolucao-loading').innerHTML = `
      <div class="center-align" style="padding: 40px;">
        <i class="material-icons large red-text">error</i>
        <p>Erro ao carregar dados da evolução. <a href="#/prontuarios">Voltar para lista de pacientes</a></p>
      </div>
    `;
  }
}

// Função para excluir evolução
async function excluirEvolucaoVisualizacao() {
  try {
    const response = await fetch(`/api/evolucoes/${evolucaoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao excluir evolução');
    }
    
    // Fechar modal
    const modalInstance = M.Modal.getInstance(document.getElementById('modal-excluir'));
    modalInstance.close();
    
    // Exibir mensagem de sucesso
    M.toast({html: 'Evolução excluída com sucesso!', classes: 'green'});
    
    // Redirecionar para a página de visualização do paciente
    setTimeout(() => {
      window.location.hash = `#/prontuarios/visualizar?id=${pacienteId}`;
    }, 1000);
    
  } catch (error) {
    console.error('Erro ao excluir evolução:', error);
    M.toast({html: error.message || 'Erro ao excluir evolução', classes: 'red'});
  }
}

// Função para calcular idade
function calcularIdade(dataNascimento) {
  if (!dataNascimento) return 'N/A';
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
}

// Função para formatar data
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('pt-BR');
}

// Função para formatar hora
function formatTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Função para inicializar a página de visualização de evolução
function initEvolucaoVisualizacao() {
  // Inicializar componentes do Materialize
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Modal.init(document.querySelectorAll('.modal'));
  
  // Obter ID da evolução da URL
  const urlParams = getUrlParams();
  evolucaoId = urlParams.id;
  
  if (!evolucaoId) {
    M.toast({html: 'ID da evolução não fornecido', classes: 'red'});
    window.location.hash = '#/prontuarios';
    return;
  }
  
  // Configurar evento de exclusão
  const excluirBtn = document.getElementById('excluir-evolucao');
  if (excluirBtn) {
    excluirBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const modalInstance = M.Modal.getInstance(document.getElementById('modal-excluir'));
      modalInstance.open();
    });
  }
  
  const confirmarBtn = document.getElementById('confirmar-exclusao');
  if (confirmarBtn) {
    confirmarBtn.addEventListener('click', function() {
      excluirEvolucaoVisualizacao();
    });
  }
  
  // Carregar dados da evolução
  carregarEvolucaoVisualizacao();
}