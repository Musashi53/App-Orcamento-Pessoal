class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;

    };
    
    validarDados() {
        // Iremos percorrer todos os atributos do objeto despesa e iremos criar uma condição para validar os dados.
        for(let i in this) {
            if(this[i] === undefined || this[i] === '' || this[i] === null) {
                return false;
            }
        };
        return true;
    }; 
};

class Bd {

    constructor() {
        let id = localStorage.getItem('id');

        if(id === null) {
            localStorage.setItem('id', 0);
        };
    };

    // Vai verificar se há um id dentro do local storage
    getProximoId() {
        let proximoId = localStorage.getItem('id'); //null
        return parseInt(proximoId) + 1;
    };

    //Irá gravar a despesa dentro do local storage
    gravar(d) {
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
    };

    recuperarTodosRegistros() {
        let despesas = Array();

        let id = localStorage.getItem('id');
        
        for(let i = 1; i <= id; i++) {
            // Precisamos recuperar a despesa que está dentro de local Storage, para fazer isso, vamos resuperar usando uma variável despesa e logo em seguida,converter esses dados JSON em um objeto:
            let despesa = JSON.parse(localStorage.getItem(i));

            // Pode existir a possibilidade de haver índices que foram pulados ou excluídos.
            // Nestes casos, nós vamos pular esses índices
            if(despesa === null) {
                continue;
            }
            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();

        console.log(despesa);

        console.log(despesasFiltradas);

        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano === despesa.ano);
        }
        
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes === despesa.mes);
        }
        
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia === despesa.dia);
        }

        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo === despesa.tipo);
        }

        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao === despesa.descricao);
        }

        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor === despesa.valor);
        }

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
    }
};

let bd = new Bd();

function cadastrarDespesa() {
    // Recuperando valores pelo ID
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    // Object
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    
    if(despesa.validarDados()) {
        bd.gravar(despesa);

        //Remover dados dentro da página
        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
        
        //dialog de sucesso
        document.getElementById('modal-titulo').innerHTML = 'Registro inserido com sucesso!';
        document.getElementById('modal_titulo_div').className = 'modal-header text-success';
        document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso!';
        document.getElementById('modal_buttom').className = 'btn btn-success';

        
        $('#modalRegistraDespesa').modal('show');

    } else {
        
        document.getElementById('modal-titulo').innerHTML = 'Erro na inclusão do registro!';
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
        document.getElementById('modal_conteudo').innerHTML = 'Por favor, preencha todos os dados corretamente!';
        document.getElementById('modal_buttom').className = 'btn btn-danger';
        
        //dialog de erro
        $('#modalRegistraDespesa').modal('show');
    };
    
};

// Essa função será chamada quando nós fizer a consulta dos dados das despesas
function carregaListaDespesa(despesas = Array(), filter = false) {

    if(despesas.length === 0 && filter === false) {
        despesas = bd.recuperarTodosRegistros();
    }
    
    
    // Selecionado o elemento tbody
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';
    
    /*
    <tr>
        <td>26/09/2021</td>
        <td>Alimentação</td>
        <td>Compras do mês</td>
        <td>995,00</td>
    </tr>
    */

    //  Percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d) {
        // Criando a linha (tr)
        let linha = listaDespesas.insertRow();

        // Criando as colunas (td)
        // insertCell: espera um parâmentro para identificar qual que é a coluna que deve ser criada
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

        // Ajustar o tipo:
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break;
            
            case '2': d.tipo = 'Educação'
                break;
            
            case '3': d.tipo = 'Lazer'
                break;
            
            case '4': d.tipo = 'Saúde'
                break;
            
            case '5': d.tipo = 'Transporte'
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        //Criar botão de exclusão
        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '');
            
            bd.remover(id);

            window.location.reload();
            
        }
        linha.insertCell(4).append(btn);
        
        console.log(d);
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    carregaListaDespesa(despesas, true);
}