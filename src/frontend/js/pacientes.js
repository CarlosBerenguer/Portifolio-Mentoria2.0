// Funções relacionadas aos pacientes

// Função para carregar pacientes
async function carregarPacientes(busca = '') {
  try {
    const pacientesContainer = document.getElementById('pacientes-container');
    pacientesContainer.innerHTML = `
      <div class="center-align" style="padding: 20px;">
        <div class="preloader-wrapper small active">
          <div class="spinner-layer spinner-blue-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div>
            <div class="gap-patch">
              <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
        <p>Carregando pacientes...</p>
      </div>
    `;
    
    // Construir URL com parâmetros de busca
    let url = 'pacientes';
    if (busca) {
      url += `?busca=${encodeURIComponent(busca)}`;
    }
    
    const pacientes = await apiRequest(url);
    
    if (pacientes.length === 0) {
      pacientesContainer.innerHTML = `
        <div class="center-align" style="padding: 40px;">
          <i class="material-icons large teal-text" style="font-size: 4rem; margin-bottom: 20px;">sentiment_very_dissatisfied</i>
          <h5 class="teal-text">Que pena! Nenhum paciente cadastrado até agora!</h5>
          <p class="grey-text">Comece criando seu primeiro prontuário clicando no botão abaixo.</p>
          <a href="#/prontuarios/novo" class="btn waves-effect waves-light teal" style="margin-top: 20px;">
            <i class="material-icons left">person_add</i>Cadastrar Primeiro Paciente
          </a>
        </div>
      `;
      document.getElementById('paginacao').style.display = 'none';
      return;
    }
    
    // Renderizar cards de pacientes
    let html = '<ul class="collection">';
    
    pacientes.forEach(paciente => {
      html += `
        <li class="collection-item avatar paciente-item hoverable" data-paciente-id="${paciente.id}" style="padding: 20px; border-bottom: 1px solid #e0e0e0; position: relative;">
          <img src="${paciente.foto_perfil || '/images/user-default.png'}" alt="Foto de ${paciente.nome_completo}" class="circle" style="width: 60px; height: 60px; object-fit: cover;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; margin-left: 80px;">
            <div style="flex: 1; padding-right: 160px;">
              <span class="title" style="font-size: 1.2em; font-weight: 500; color: #424242;">${paciente.nome_completo}</span>
              <p style="margin: 5px 0; color: #757575;">
                <i class="material-icons tiny" style="vertical-align: middle; margin-right: 5px;">phone</i> ${paciente.telefone || 'Não informado'}
                <br>
                <i class="material-icons tiny" style="vertical-align: middle; margin-right: 5px;">event</i> ${formatDate(paciente.data_nascimento) || 'Não informada'}
              </p>

            </div>
            <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 8px;">
              <a href="#/prontuarios/editar?id=${paciente.id}" class="btn waves-effect waves-light teal" style="display: flex; align-items: center; justify-content: center; gap: 8px; min-width: 120px;">
                <i class="material-icons white-text">edit</i><span class="white-text">Editar</span>
              </a>
              <a href="#/evolucoes/novo?paciente_id=${paciente.id}" class="btn waves-effect waves-light green" style="display: flex; align-items: center; justify-content: center; gap: 8px; min-width: 120px;">
                <i class="material-icons white-text">note_add</i><span class="white-text">Nova Evolução</span>
              </a>
            </div>
          </div>
        </li>
      `;
    });
    
    html += '</ul>';
    pacientesContainer.innerHTML = html;
    
    // Adicionar event listeners para clique nos itens da lista
    const items = document.querySelectorAll('.paciente-item');
    items.forEach(item => {
      item.addEventListener('click', function(e) {
        // Evitar que o clique nos botões de ação dispare o evento do item
        if (e.target.closest('a') || e.target.closest('.btn') || e.target.closest('.btn-floating')) {
          return;
        }
        
        const pacienteId = this.getAttribute('data-paciente-id');
        if (pacienteId) {
          window.location.hash = `#/prontuarios/visualizar?id=${pacienteId}`;
        }
      });
    });
    
    // Exibir paginação se necessário
    if (pacientes.length > 9) {
      document.getElementById('paginacao').style.display = 'block';
    } else {
      document.getElementById('paginacao').style.display = 'none';
    }
    
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error);
    document.getElementById('pacientes-container').innerHTML = `
      <div class="center-align" style="padding: 20px;">
        <i class="material-icons large red-text">error</i>
        <p>Erro ao carregar pacientes. Tente novamente mais tarde.</p>
      </div>
    `;
  }
}

// Função para inicializar a busca de pacientes
function initBuscaPacientes() {
  const buscaInput = document.getElementById('busca-pacientes');
  if (buscaInput) {
    buscaInput.addEventListener('input', function() {
      const busca = this.value.trim();
      carregarPacientes(busca);
    });
  }
}