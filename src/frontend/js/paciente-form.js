// Funções relacionadas ao formulário de pacientes

// Função para salvar paciente
async function salvarPaciente() {
  try {
    const form = document.getElementById('paciente-form');
    const preloader = document.getElementById('form-preloader');
    
    // Debug: Verificar se os elementos existem
    console.log('=== DEBUG: Verificando elementos do formulário ===');
    const nomeElement = document.getElementById('nome_completo');
    const dataElement = document.getElementById('data_nascimento');
    const cpfElement = document.getElementById('cpf');
    
    console.log('Elemento nome_completo:', nomeElement);
    console.log('Elemento data_nascimento:', dataElement);
    console.log('Elemento cpf:', cpfElement);
    
    if (!nomeElement) {
      console.error('ERRO: Elemento nome_completo não encontrado!');
      M.toast({html: 'Erro: Campo Nome Completo não encontrado na página', classes: 'red'});
      return;
    }
    
    if (!dataElement) {
      console.error('ERRO: Elemento data_nascimento não encontrado!');
      M.toast({html: 'Erro: Campo Data de Nascimento não encontrado na página', classes: 'red'});
      return;
    }
    
    if (!cpfElement) {
      console.error('ERRO: Elemento cpf não encontrado!');
      M.toast({html: 'Erro: Campo CPF não encontrado na página', classes: 'red'});
      return;
    }
    
    // Capturar valores manualmente dos campos
    const nomeCompleto = nomeElement.value?.trim() || '';
    const dataNascimento = dataElement.value?.trim() || '';
    const cpf = cpfElement.value?.trim() || '';
    const genero = document.getElementById('genero')?.value?.trim() || '';
    const estadoCivil = document.getElementById('estado_civil')?.value?.trim() || '';
    const profissao = document.getElementById('profissao')?.value?.trim() || '';
    const telefone = document.getElementById('telefone')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const endereco = document.getElementById('endereco')?.value?.trim() || '';
    const contatoEmergencia = document.getElementById('contato_emergencia')?.value?.trim() || '';
    const observacoes = document.getElementById('observacoes')?.value?.trim() || '';
    
    // Debug: Log dos valores capturados
    console.log('=== DEBUG: Valores capturados do formulário ===');
    console.log('Nome Completo:', `"${nomeCompleto}"`, 'Length:', nomeCompleto.length);
    console.log('Data de Nascimento:', `"${dataNascimento}"`, 'Length:', dataNascimento.length);
    console.log('CPF:', `"${cpf}"`, 'Length:', cpf.length);
    
    // Debug: Verificar se os campos estão visíveis e habilitados
    console.log('=== DEBUG: Estado dos elementos ===');
    console.log('Nome - Visível:', !nomeElement.hidden, 'Habilitado:', !nomeElement.disabled);
    console.log('Data - Visível:', !dataElement.hidden, 'Habilitado:', !dataElement.disabled);
    console.log('CPF - Visível:', !cpfElement.hidden, 'Habilitado:', !cpfElement.disabled);
    
    // Validação no frontend
    const camposFaltando = [];
    if (!nomeCompleto) camposFaltando.push('Nome Completo');
    if (!dataNascimento) camposFaltando.push('Data de Nascimento');
    if (!cpf) camposFaltando.push('CPF');
    
    if (camposFaltando.length > 0) {
      M.toast({html: `Os campos ${camposFaltando.join(', ')} são obrigatórios`, classes: 'orange'});
      return;
    }
    
    // Converter data de nascimento do formato DD/MM/AAAA para YYYY-MM-DD
    let dataFormatada = dataNascimento;
    if (dataNascimento) {
      const partesData = dataNascimento.split('/');
      if (partesData.length === 3) {
        const dia = partesData[0].padStart(2, '0');
        const mes = partesData[1].padStart(2, '0');
        const ano = partesData[2];
        
        // Validar se a data é válida
        const dataObj = new Date(`${ano}-${mes}-${dia}`);
        if (isNaN(dataObj.getTime())) {
          M.toast({html: 'Data de nascimento inválida. Use o formato DD/MM/AAAA com uma data válida.', classes: 'red'});
          return;
        }
        
        dataFormatada = `${ano}-${mes}-${dia}`;
      } else {
        M.toast({html: 'Formato de data inválido. Use DD/MM/AAAA.', classes: 'red'});
        return;
      }
    }
    
    // Criar FormData com os valores capturados manualmente
    const formData = new FormData();
    formData.append('nome_completo', nomeCompleto);
    formData.append('data_nascimento', dataFormatada);
    formData.append('cpf', cpf);
    formData.append('genero', genero);
    formData.append('estado_civil', estadoCivil);
    formData.append('profissao', profissao);
    formData.append('telefone', telefone);
    formData.append('email', email);
    formData.append('endereco', endereco);
    formData.append('contato_emergencia', contatoEmergencia);
    formData.append('observacoes', observacoes);
    
    // Adicionar foto se houver
    const fotoInput = document.getElementById('foto_perfil');
    if (fotoInput && fotoInput.files[0]) {
      formData.append('foto_perfil', fotoInput.files[0]);
    }
    
    // Exibir preloader
    preloader.style.display = 'inline-block';
    document.getElementById('salvar-paciente').disabled = true;
    
    // Debug: Verificar dados antes do envio
    console.log('Dados que serão enviados:');
    for (let [key, value] of formData.entries()) {
      console.log(key + ':', value);
    }
    
    // Enviar dados para a API
    const response = await fetch('/api/pacientes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();

      
      // Exibir mensagem de erro específica em amarelo para problemas de validação
      if (response.status === 400) {
        M.toast({html: error.mensagem || 'Dados inválidos. Verifique os campos obrigatórios.', classes: 'orange'});
        return;
      }
      throw new Error(error.mensagem || error.message || 'Erro ao salvar paciente');
    }
    
    const data = await response.json();
    
    // Exibir mensagem de sucesso
    M.toast({html: 'Paciente cadastrado com sucesso!', classes: 'green'});
    
    // Redirecionar para a página de visualização do paciente
    setTimeout(() => {
      window.location.hash = `#/prontuarios/visualizar?id=${data.id}`;
    }, 1000);
    
  } catch (error) {
    console.error('Erro ao salvar paciente:', error);
    M.toast({html: error.message || 'Erro ao salvar paciente', classes: 'red'});
  } finally {
    // Ocultar preloader
    document.getElementById('form-preloader').style.display = 'none';
    document.getElementById('salvar-paciente').disabled = false;
  }
}

// Função para inicializar o preview da foto
function initPreviewFoto() {
  const inputFoto = document.getElementById('foto_perfil');
  const previewFoto = document.getElementById('preview-foto');
  
  if (inputFoto && previewFoto) {
    inputFoto.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewFoto.src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

// Função para inicializar o formulário de paciente
function initFormularioPaciente() {
  // Inicializar preview da foto
  initPreviewFoto();
  
  // Inicializar formulário
  const form = document.getElementById('paciente-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      await salvarPaciente();
    });
  }
}

// Função para carregar dados do paciente (para edição)
async function carregarDadosPaciente(pacienteId) {
  try {
    const paciente = await apiRequest(`pacientes/${pacienteId}`);
    
    // Preencher campos do formulário
    document.getElementById('nome_completo').value = paciente.nome_completo || '';
    document.getElementById('cpf').value = paciente.cpf || '';
    
    // Formatar data para input type="text" (formato DD/MM/AAAA)
    if (paciente.data_nascimento) {
      const data = new Date(paciente.data_nascimento);
      if (!isNaN(data.getTime())) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        document.getElementById('data_nascimento').value = `${dia}/${mes}/${ano}`;
      }
    }
    
    document.getElementById('telefone').value = paciente.telefone || '';
    document.getElementById('email').value = paciente.email || '';
    document.getElementById('endereco').value = paciente.endereco || '';
    document.getElementById('profissao').value = paciente.profissao || '';
    document.getElementById('estado_civil').value = paciente.estado_civil || '';
    document.getElementById('observacoes').value = paciente.observacoes || '';
    
    // Atualizar labels do Materialize
    M.updateTextFields();
    
    // Atualizar selects
    const selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);
    
    // Atualizar preview da foto se existir
    if (paciente.foto_perfil) {
      const previewFoto = document.getElementById('preview-foto');
      if (previewFoto) {
        previewFoto.src = paciente.foto_perfil;
      }
    }
    
  } catch (error) {
    console.error('Erro ao carregar dados do paciente:', error);
    M.toast({html: 'Erro ao carregar dados do paciente', classes: 'red'});
  }
}

// Função para atualizar paciente (para edição)
async function atualizarPaciente(pacienteId) {
  try {
    const form = document.getElementById('paciente-form');
    const formData = new FormData(form);
    const preloader = document.getElementById('form-preloader');
    
    // Exibir preloader
    preloader.style.display = 'inline-block';
    document.getElementById('salvar-paciente').disabled = true;
    
    // Enviar dados para a API
    const response = await fetch(`/api/pacientes/${pacienteId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar paciente');
    }
    
    // Exibir mensagem de sucesso
    M.toast({html: 'Paciente atualizado com sucesso!', classes: 'green'});
    
    // Redirecionar para a página de visualização do paciente
    setTimeout(() => {
      window.location.hash = `#/prontuarios/visualizar?id=${pacienteId}`;
    }, 1000);
    
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    M.toast({html: error.message || 'Erro ao atualizar paciente', classes: 'red'});
  } finally {
    // Ocultar preloader
    document.getElementById('form-preloader').style.display = 'none';
    document.getElementById('salvar-paciente').disabled = false;
  }
}