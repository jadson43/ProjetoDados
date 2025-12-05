

// Função para validar data no formato DD/MM/AAAA
function isValidDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length !== 3) return false;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// Carregar agendamentos do localStorage
let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || {};

// Salvar agendamentos no localStorage
function salvarAgendamentos() {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

// Funções para mostrar/esconder formulários
function mostrarForm(formId) {
    document.querySelectorAll('.form').forEach(form => form.style.display = 'none');
    document.getElementById(formId).style.display = 'block';
    document.getElementById('output').innerHTML = ''; // Limpar saída
}

function voltar() {
    document.querySelectorAll('.form').forEach(form => form.style.display = 'none');
}

// Função para agendar
function agendar() {
    const nome = document.getElementById('nome').value.trim();
    const data = document.getElementById('data').value.trim();
    const horario = document.getElementById('horario').value.trim();
    const servico = document.getElementById('servico').value.trim();

    if (!nome || !data || !horario || !servico) {
        document.getElementById('output').innerHTML = 'Preencha todos os campos!';
        return;
    }

    if (!isValidDate(data)) {
        document.getElementById('output').innerHTML = 'Data inválida! Use DD/MM/YYYY.';
        return;
    }

    // Verificar conflito de horário
    for (const [chave, info] of Object.entries(agendamentos)) {
        if (info.horario === horario) {
            const [nomeExistente, dataExistente] = chave.split('|');
            document.getElementById('output').innerHTML = `Conflito: Horário ${horario} já ocupado por ${nomeExistente} em ${dataExistente}.`;
            return;
        }
    }

    const chave = `${nome}|${data}`;
    agendamentos[chave] = { horario, servico };
    salvarAgendamentos();
    document.getElementById('output').innerHTML = `Agendamento confirmado para ${nome} em ${data} às ${horario} - Serviço: ${servico}`;
    // Limpar campos
    document.getElementById('nome').value = '';
    document.getElementById('data').value = '';
    document.getElementById('horario').value = '';
    document.getElementById('servico').value = '';
    voltar();
}

// Função para listar
function listar() {
    if (Object.keys(agendamentos).length === 0) {
        document.getElementById('output').innerHTML = 'Nenhum agendamento encontrado.';
        return;
    }
    let html = '<h3>Agendamentos:</h3><ul>';
    for (const [chave, info] of Object.entries(agendamentos)) {
        const [nome, data] = chave.split('|');
        html += `<li>${nome}: ${data} às ${info.horario} - ${info.servico}</li>`;
    }
    html += '</ul>';
    document.getElementById('output').innerHTML = html;
}

// Função para cancelar
function cancelar() {
    const nome = document.getElementById('nome-cancelar').value.trim();
    const data = document.getElementById('data-cancelar').value.trim();

    if (!nome || !data) {
        document.getElementById('output').innerHTML = 'Preencha nome e data!';
        return;
    }

    const chave = `${nome}|${data}`;
    if (chave in agendamentos) {
        delete agendamentos[chave];
        salvarAgendamentos();
        document.getElementById('output').innerHTML = `Agendamento de ${nome} em ${data} cancelado.`;
    } else {
        document.getElementById('output').innerHTML = 'Agendamento não encontrado.';
    }
    // Limpar campos
    document.getElementById('nome-cancelar').value = '';
    document.getElementById('data-cancelar').value = '';
    voltar();
}

// Event listeners para os botões
document.getElementById('btn-agendar').addEventListener('click', () => mostrarForm('form-agendar'));
document.getElementById('btn-listar').addEventListener('click', listar);
document.getElementById('btn-cancelar').addEventListener('click', () => mostrarForm('form-cancelar'));
document.getElementById('btn-sair').addEventListener('click', () => {
    document.getElementById('output').innerHTML = 'Saindo do sistema. Até logo!';
    // Opção: redirecionar ou limpar
});

document.getElementById('btn-confirmar-agendar').addEventListener('click', agendar);
document.getElementById('btn-voltar-agendar').addEventListener('click', voltar);
document.getElementById('btn-confirmar-cancelar').addEventListener('click', cancelar);
document.getElementById('btn-voltar-cancelar').addEventListener('click', voltar);
