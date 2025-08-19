// Variáveis globais para evolução
let pacienteId = null;
let pacienteData = null;
let evolucaoId = null;

// Função para carregar dados do paciente
async function carregarPacienteEvolucao() {
  try {
    // Exibir loading
    document.getElementById('paciente-loading').style.display = 'block';
    document.getElementById('evolucao-content').style.display = 'none';
    
    // Buscar dados do paciente
    pacienteData = await apiRequest(`pacientes/${pacienteId}`);
    
    // Preencher dados na página
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
    document.getElementById('cancelar-evolucao').href = `#/prontuarios/visualizar?id=${pacienteId}`;
    
    // Definir ID do paciente no formulário
    document.getElementById('paciente_id').value = pacienteId;
    
    // Ocultar loading
    document.getElementById('paciente-loading').style.display = 'none';
    document.getElementById('evolucao-content').style.display = 'block';
    
    // Atualizar labels para efeito flutuante do Materialize
    M.updateTextFields();
    
  } catch (error) {
    console.error('Erro ao carregar paciente:', error);
    M.toast({html: 'Erro ao carregar dados do paciente', classes: 'red'});
    document.getElementById('paciente-loading').innerHTML = `
      <div class="center-align" style="padding: 40px;">
        <i class="material-icons large red-text">error</i>
        <p>Erro ao carregar dados do paciente. <a href="#/prontuarios">Voltar para lista de prontuários</a></p>
      </div>
    `;
  }
}

// Função para carregar dados de uma evolução existente (para edição)
async function carregarDadosEvolucao() {
  try {
    // Exibir loading
    document.getElementById('evolucao-loading').style.display = 'block';
    document.getElementById('evolucao-content').style.display = 'none';
    
    // Buscar dados da evolução
    const evolucaoData = await apiRequest(`evolucoes/${evolucaoId}`);
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
    document.getElementById('cancelar-evolucao').href = `#/prontuarios/visualizar?id=${pacienteId}`;
    
    // Preencher formulário com dados da evolução
    if (document.getElementById('evolucao_id')) {
      document.getElementById('evolucao_id').value = evolucaoId;
    }
    document.getElementById('paciente_id').value = pacienteId;
    
    // Preencher campos baseado na estrutura da evolução
    if (document.getElementById('titulo')) {
      document.getElementById('titulo').value = evolucaoData.titulo || '';
    }
    if (document.getElementById('conteudo')) {
      document.getElementById('conteudo').value = evolucaoData.conteudo || '';
    }
    if (document.getElementById('observacoes')) {
      document.getElementById('observacoes').value = evolucaoData.observacoes || '';
    }
    if (document.getElementById('tipo_evolucao')) {
      document.getElementById('tipo_evolucao').value = evolucaoData.tipo || '';
    }
    
    // Extrair data e hora da evolução
    const dataHora = new Date(evolucaoData.data_evolucao || evolucaoData.data_hora);
    document.getElementById('data_evolucao').value = formatDateForInput(dataHora);
    document.getElementById('hora_evolucao').value = formatTimeForInput(dataHora);
    
    // Carregar anexos existentes se houver
    if (evolucaoData.anexos && evolucaoData.anexos.length > 0) {
      let anexosHtml = '';
      evolucaoData.anexos.forEach(anexo => {
        anexosHtml += `
          <a href="${anexo.url}" target="_blank" class="collection-item">
            <i class="material-icons left">insert_drive_file</i>
            ${anexo.nome_arquivo}
            <span class="badge">
              <a href="#!" class="red-text excluir-anexo" data-id="${anexo.id}">
                <i class="material-icons">delete</i>
              </a>
            </span>
          </a>
        `;
      });
      
      const listaAnexos = document.getElementById('lista-anexos');
      if (listaAnexos) {
        listaAnexos.innerHTML = anexosHtml;
        
        // Adicionar eventos para excluir anexos
        document.querySelectorAll('.excluir-anexo').forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            const anexoId = this.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este anexo?')) {
              excluirAnexo(anexoId);
            }
          });
        });
        
        const anexosExistentes = document.getElementById('anexos-existentes');
        if (anexosExistentes) {
          anexosExistentes.style.display = 'block';
        }
      }
    } else {
      const anexosExistentes = document.getElementById('anexos-existentes');
      if (anexosExistentes) {
        anexosExistentes.style.display = 'none';
      }
    }
    
    // Ocultar loading
    document.getElementById('evolucao-loading').style.display = 'none';
    document.getElementById('evolucao-content').style.display = 'block';
    
    // Atualizar labels para efeito flutuante do Materialize
    M.updateTextFields();
    const conteudoTextarea = document.getElementById('conteudo');
    if (conteudoTextarea) {
      M.textareaAutoResize(conteudoTextarea);
    }
    
  } catch (error) {
    console.error('Erro ao carregar evolução:', error);
    M.toast({html: 'Erro ao carregar dados da evolução', classes: 'red'});
    const evolucaoLoading = document.getElementById('evolucao-loading');
    if (evolucaoLoading) {
      evolucaoLoading.innerHTML = `
        <div class="center-align" style="padding: 40px;">
          <i class="material-icons large red-text">error</i>
          <p>Erro ao carregar dados da evolução. <a href="#/prontuarios">Voltar para lista de prontuários</a></p>
        </div>
      `;
    }
  }
}

// Função para salvar evolução
async function salvarEvolucao() {
  try {
    console.log('Iniciando salvamento de evolução...');
    const form = document.getElementById('evolucao-form');
    const formData = new FormData(form);
    const preloader = document.getElementById('form-preloader');
    
    // Validar campos obrigatórios
    const pacienteIdValue = document.getElementById('paciente_id').value;
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;
    const data = document.getElementById('data_evolucao').value;
    const hora = document.getElementById('hora_evolucao').value;
    
    console.log('Dados coletados:', {
      paciente_id: pacienteIdValue,
      titulo: titulo,
      conteudo: conteudo,
      data: data,
      hora: hora
    });
    
    if (!pacienteIdValue || !titulo || !conteudo || !data || !hora) {
      M.toast({html: 'Por favor, preencha todos os campos obrigatórios', classes: 'red'});
      return;
    }
    
    // Combinar data e hora
    formData.set('data_hora', `${data}T${hora}:00`);
    
    // Adicionar o título
    formData.set('titulo', titulo);
    
    // Mapear o campo 'conteudo' para 'observacao' que o backend espera
    formData.set('observacao', conteudo);
    formData.delete('conteudo');
    
    console.log('FormData preparado para envio');
    
    // Exibir preloader
    preloader.style.display = 'inline-block';
    document.getElementById('salvar-evolucao').disabled = true;
    
    let url = '/api/evolucoes';
    let method = 'POST';
    
    // Se é edição, usar PUT
    if (evolucaoId) {
      url = `/api/evolucoes/${evolucaoId}`;
      method = 'PUT';
    }
    
    // Enviar dados para a API
    console.log('Enviando requisição para:', url, 'método:', method);
    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    console.log('Resposta recebida:', response.status, response.statusText);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Erro da API:', error);
      throw new Error(error.mensagem || error.message || 'Erro ao salvar evolução');
    }
    
    const responseData = await response.json();
    
    // Exibir mensagem de sucesso
    const mensagem = evolucaoId ? 'Evolução atualizada com sucesso!' : 'Evolução registrada com sucesso!';
    M.toast({html: mensagem, classes: 'green'});
    
    // Redirecionar para a página de visualização do paciente
    setTimeout(() => {
      window.location.hash = `#/prontuarios/visualizar?id=${pacienteId}`;
    }, 1000);
    
  } catch (error) {
    console.error('Erro ao salvar evolução:', error);
    M.toast({html: error.message || 'Erro ao salvar evolução', classes: 'red'});
  } finally {
    // Ocultar preloader
    document.getElementById('form-preloader').style.display = 'none';
    document.getElementById('salvar-evolucao').disabled = false;
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

// Função para formatar data para input
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Função para formatar hora para input
function formatTimeForInput(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

// Função para excluir anexo
async function excluirAnexo(anexoId) {
  try {
    const response = await fetch(`/api/evolucoes/anexos/${anexoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao excluir anexo');
    }
    
    // Exibir mensagem de sucesso
    M.toast({html: 'Anexo excluído com sucesso!', classes: 'green'});
    
    // Recarregar evolução para atualizar a lista de anexos
    carregarDadosEvolucao();
    
  } catch (error) {
    console.error('Erro ao excluir anexo:', error);
    M.toast({html: error.message || 'Erro ao excluir anexo', classes: 'red'});
  }
}

// Função para inicializar formulário de evolução
function initFormularioEvolucao() {
  // Obter parâmetros da URL
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  pacienteId = urlParams.get('paciente_id');
  evolucaoId = urlParams.get('id'); // Para edição
  
  if (!pacienteId) {
    M.toast({html: 'ID do paciente não fornecido', classes: 'red'});
    window.location.hash = '#/prontuarios';
    return;
  }
  
  // Definir data e hora atuais como padrão (apenas para nova evolução)
  if (!evolucaoId) {
    const hoje = new Date();
    const dataFormatada = formatDateForInput(hoje);
    const horaFormatada = formatTimeForInput(hoje);
    
    document.getElementById('data_evolucao').value = dataFormatada;
    document.getElementById('hora_evolucao').value = horaFormatada;
  }
  
  // Inicializar formulário
  const form = document.getElementById('evolucao-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      await salvarEvolucao();
    });
  }
  
  // Carregar dados do paciente
  carregarPacienteEvolucao();
  
  // Se é edição, carregar dados da evolução
  if (evolucaoId) {
    carregarDadosEvolucao();
  }
}