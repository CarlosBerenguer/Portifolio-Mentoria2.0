// Funções relacionadas à visualização de detalhes do paciente

let pacienteAtual = null;
let evolucoes = [];

// Função para carregar dados do paciente para visualização
async function carregarDetalhesPaciente(pacienteId) {
  try {
    // Exibir loading
    document.getElementById('paciente-loading').style.display = 'block';
    document.getElementById('paciente-content').style.display = 'none';
    
    // Buscar dados do paciente
    pacienteAtual = await apiRequest(`pacientes/${pacienteId}`);
    
    // Verificar se o paciente foi encontrado
    if (!pacienteAtual || pacienteAtual.mensagem === 'Paciente não encontrado') {
      throw new Error('Paciente não encontrado');
    }
    
    // Atualizar título da página
    const nomeElement = document.getElementById('paciente-nome');
    if (nomeElement) {
      nomeElement.textContent = pacienteAtual.nome_completo;
    } else {
      console.error('Elemento paciente-nome não encontrado!');
    }
    
    // Preencher dados do paciente
    preencherDadosPaciente(pacienteAtual);
    
    // Ocultar loading e exibir conteúdo primeiro
    document.getElementById('paciente-loading').style.display = 'none';
    document.getElementById('paciente-content').style.display = 'block';
    
    // Carregar evoluções (não bloquear a exibição da página se falhar)
    try {
      await carregarEvolucoesPaciente(pacienteId);
    } catch (error) {
      console.warn('Não foi possível carregar evoluções, mas a página do paciente será exibida:', error);
      // Exibir mensagem amigável no container de evoluções
      const evolucaoContainer = document.getElementById('evolucoes-container');
      if (evolucaoContainer) {
        evolucaoContainer.innerHTML = `
          <div class="center-align" style="padding: 20px;">
            <i class="material-icons medium orange-text">warning</i>
            <p>Não foi possível carregar as evoluções no momento.</p>
            <a href="#/evolucoes/novo?paciente_id=${pacienteId}" class="btn waves-effect waves-light teal">
              <i class="material-icons left">add</i>Nova Evolução
            </a>
          </div>
        `;
      }
    }
    
  } catch (error) {
    console.error('Erro ao carregar dados do paciente:', error);
    document.getElementById('paciente-loading').innerHTML = `
      <div class="center-align">
        <i class="material-icons medium red-text">error</i>
        <p>Erro ao carregar dados do paciente</p>
        <a href="#/prontuarios" class="btn waves-effect waves-light">Voltar</a>
      </div>
    `;
  }
}

// Função para preencher os dados do paciente na página
function preencherDadosPaciente(paciente) {
  console.log('=== DEBUG: Preenchendo dados do paciente:', paciente);
  
  // Função auxiliar para definir texto com segurança
  function setTextSafely(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    } else {
      console.warn(`Elemento '${elementId}' não encontrado`);
    }
  }
  
  // Foto do paciente
  const fotoPaciente = document.getElementById('foto-paciente');
  if (fotoPaciente) {
    fotoPaciente.src = paciente.foto_perfil || '/images/user-default.png';
  }
  
  // Dados pessoais
  setTextSafely('paciente-nome-card', paciente.nome || 'Sem Dados Cadastrados');
     setTextSafely('paciente-cpf', paciente.cpf || 'Sem Dados Cadastrados');
     setTextSafely('paciente-idade', paciente.data_nascimento ? calcularIdade(paciente.data_nascimento) + ' anos' : 'Sem Dados Cadastrados');
     setTextSafely('paciente-genero', paciente.genero || 'Sem Dados Cadastrados');
     setTextSafely('paciente-telefone', paciente.telefone || 'Sem Dados Cadastrados');
     setTextSafely('paciente-email', paciente.email || 'Sem Dados Cadastrados');
     setTextSafely('paciente-endereco', paciente.endereco || 'Sem Dados Cadastrados');
     setTextSafely('paciente-convenio', paciente.convenio || 'Sem Dados Cadastrados');
     setTextSafely('paciente-numero-convenio', paciente.numero_convenio || 'Sem Dados Cadastrados');
     setTextSafely('paciente-obs-medicas', paciente.observacoes_medicas || 'Sem Dados Cadastrados');
     setTextSafely('paciente-observacoes', paciente.observacoes_gerais || 'Sem Dados Cadastrados');
  
  // Atualizar links de ação
  const editarBtn = document.getElementById('editar-paciente');
  const novaEvolucaoBtn = document.getElementById('nova-evolucao');
  const fabNovaEvolucaoBtn = document.getElementById('fab-nova-evolucao');
  
  if (editarBtn) {
    editarBtn.href = `#/prontuarios/editar?id=${paciente.id}`;
  }
  
  if (novaEvolucaoBtn) {
    novaEvolucaoBtn.href = `#/evolucoes/novo?paciente_id=${paciente.id}`;
  }
  
  if (fabNovaEvolucaoBtn) {
    fabNovaEvolucaoBtn.href = `#/evolucoes/novo?paciente_id=${paciente.id}`;
  }
}

// Função para carregar evoluções do paciente
async function carregarEvolucoesPaciente(pacienteId) {
  try {
    // Exibir loading
    const evolucaoContainer = document.getElementById('evolucoes-container');
    if (!evolucaoContainer) {
      console.error('Elemento evolucoes-container não encontrado!');
      return;
    }
    
    evolucaoContainer.innerHTML = `
      <div class="center-align" style="padding: 20px;">
        <div class="preloader-wrapper small active">
          <div class="spinner-layer spinner-blue-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
        <p>Carregando evoluções...</p>
      </div>
    `;
    
    // Buscar evoluções do paciente
    const evolucoes = await apiRequest(`evolucoes/paciente/${pacienteId}`);
    
    if (evolucoes.length === 0) {
      evolucaoContainer.innerHTML = `
        <div class="center-align" style="padding: 20px;">
          <i class="material-icons medium">info</i>
          <p>Nenhuma evolução registrada para este paciente.</p>
          <a href="#/evolucoes/novo?paciente_id=${pacienteId}" class="btn waves-effect waves-light teal">
            <i class="material-icons left">add</i>Nova Evolução
          </a>
        </div>
      `;
      return;
    }
    
    // Ordenar evoluções por data (mais recente primeiro)
    evolucoes.sort((a, b) => new Date(b.data_evolucao) - new Date(a.data_evolucao));
    
    // Renderizar lista de evoluções
    let html = '<ul class="collection">';
    
    evolucoes.forEach(evolucao => {
      html += `
        <li class="collection-item avatar evolucao-item" data-id="${evolucao.id}">
          <i class="material-icons circle teal">note</i>
          <span class="title"><b>${evolucao.titulo}</b></span>
          <p>
            Data: ${formatDate(evolucao.data_evolucao)}<br>
            ${evolucao.conteudo.substring(0, 100)}${evolucao.conteudo.length > 100 ? '...' : ''}
          </p>
          <a href="#!" class="secondary-content"><i class="material-icons">visibility</i></a>
        </li>
      `;
    });
    
    html += '</ul>';
    evolucaoContainer.innerHTML = html;
    
    // Adicionar evento de clique para visualizar evolução
    document.querySelectorAll('.evolucao-item').forEach(item => {
      item.addEventListener('click', function() {
        const evolucaoId = this.getAttribute('data-id');
        abrirEvolucao(evolucaoId);
      });
    });
    
  } catch (error) {
    console.error('Erro ao carregar evoluções:', error);
    document.getElementById('evolucoes-container').innerHTML = `
      <div class="center-align" style="padding: 20px;">
        <i class="material-icons medium red-text">error</i>
        <p>Erro ao carregar evoluções</p>
      </div>
    `;
  }
}

// Função para abrir modal de evolução
function abrirEvolucao(evolucaoId) {
  const evolucao = evolucoes.find(e => e.id == evolucaoId);
  if (!evolucao) return;
  
  // Preencher dados do modal
  document.getElementById('modal-evolucao-titulo').textContent = evolucao.titulo;
  document.getElementById('modal-evolucao-data').textContent = formatDate(evolucao.data_evolucao);
  document.getElementById('modal-evolucao-conteudo').textContent = evolucao.conteudo;
  
  // Configurar botões de ação
  const editarEvolucaoBtn = document.getElementById('editar-evolucao');
  const excluirEvolucaoBtn = document.getElementById('excluir-evolucao');
  
  if (editarEvolucaoBtn) {
    editarEvolucaoBtn.href = `#/evolucoes/editar?id=${evolucao.id}`;
  }
  
  if (excluirEvolucaoBtn) {
    excluirEvolucaoBtn.onclick = () => excluirEvolucao(evolucao.id);
  }
  
  // Abrir modal
  const modal = M.Modal.getInstance(document.getElementById('modal-evolucao'));
  modal.open();
}

// Função para excluir evolução
async function excluirEvolucao(evolucaoId) {
  if (!confirm('Tem certeza que deseja excluir esta evolução?')) {
    return;
  }
  
  try {
    await apiRequest(`evolucoes/${evolucaoId}`, {
      method: 'DELETE'
    });
    
    M.toast({html: 'Evolução excluída com sucesso!', classes: 'green'});
    
    // Fechar modal
    const modal = M.Modal.getInstance(document.getElementById('modal-evolucao'));
    modal.close();
    
    // Recarregar evoluções
    if (pacienteAtual) {
      await carregarEvolucoesPaciente(pacienteAtual.id);
    }
    
  } catch (error) {
    console.error('Erro ao excluir evolução:', error);
    M.toast({html: 'Erro ao excluir evolução', classes: 'red'});
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

// Função para inicializar a página de detalhes do paciente
function initDetalhesPaciente() {
  // Inicializar modais
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  
  // Obter ID do paciente da URL
  const urlParams = getUrlParams();
  const pacienteId = urlParams.id;
  
  if (pacienteId) {
    carregarDetalhesPaciente(pacienteId);
  } else {
    document.getElementById('paciente-loading').innerHTML = `
      <div class="center-align">
        <i class="material-icons medium red-text">error</i>
        <p>ID do paciente não encontrado</p>
        <a href="#/prontuarios" class="btn waves-effect waves-light">Voltar</a>
      </div>
    `;
  }
}