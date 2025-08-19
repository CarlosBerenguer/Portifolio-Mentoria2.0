// Funções relacionadas ao dashboard

// Função para carregar dados do dashboard
async function carregarDadosDashboard() {
  try {
    // Carregar estatísticas
    const estatisticas = await apiRequest('pacientes/estatisticas');
    document.getElementById('total-pacientes').textContent = estatisticas.totalPacientes || 0;
    document.getElementById('evolucoes-mes').textContent = estatisticas.evolucoesMes || 0;
    document.getElementById('evolucoes-hoje').textContent = estatisticas.evolucoesHoje || 0;
    document.getElementById('pacientes-novos').textContent = estatisticas.pacientesNovos || 0;
    
    // Carregar últimos pacientes
    const pacientes = await apiRequest('pacientes?limite=3');
    const pacientesContainer = document.getElementById('ultimos-pacientes-container');
    
    if (pacientes.length === 0) {
      pacientesContainer.innerHTML = '<p class="center-align">Nenhum prontuário cadastrado.</p>';
    } else {
      let html = '<ul class="collection">';
      pacientes.forEach(paciente => {
        html += `
          <li class="collection-item avatar">
            <img src="${paciente.foto_perfil || '/images/user-default.png'}" alt="" class="circle">
            <span class="title">${paciente.nome_completo}</span>
            <p>${paciente.telefone || 'Sem telefone'}<br>
               ${paciente.email || 'Sem email'}
            </p>
            <a href="#/pacientes/visualizar?id=${paciente.id}" class="secondary-content"><i class="material-icons">visibility</i></a>
          </li>
        `;
      });
      html += '</ul>';
      pacientesContainer.innerHTML = html;
    }
    

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
  }
}

// Função para inicializar a página do dashboard
function initDashboardPage() {
  // Inicializar componentes do Materialize
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'));
  
  // Carregar dados do dashboard
  carregarDadosDashboard();
}