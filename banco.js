window.addEventListener('load', carregado);

var db = openDatabase('myDB', '1.0', 'Tips Database Example', 2 * 1024 * 1024);


db.transaction (function(tx){
	tx.executeSql('Create Table IF NOT EXISTS myTable (id INTEGER PRIMARY KEY, nome TEXT, senha TEXT, email TEXT)' );
} );	

function carregado(){
	document.getElementById('btn-salvar').addEventListener('click', salvar);
	document.getElementById('btn-deletar').addEventListener('click', deletar);

	mostrar();
}

function salvar() {
	
	var id = document.getElementById('field-id').value;
	var nome = document.getElementById('field-name').value;
	var senha = document.getElementById('field-pass').value;
	var mail = document.getElementById('field-mail').value;
    
    console.log('Nome: '+nome+'   Senha: '+senha+'   Mail: '+mail);
	db.transaction(function (tx){

		if (id) {
			tx.executeSql('UPDATE myTable SET nome=?, senha=?, email=? WHERE id=?', [nome, senha, mail,id]);
		} else {

			tx.executeSql('INSERT INTO myTable (nome, senha, email) VALUES (?, ?, ?)', [nome, senha, mail],
				function(tx, resultado){
					console.log('Inserção com sucesso');
					console.log('resultado');
				},
				function(tx, error){
					console.log('deu pau!');
					console.log(error);
				}

				);
		}		
	});

	mostrar();
}


function mostrar(){
	var table = document.getElementById('tbody-register');

	db.transaction(function(tx){
		tx.executeSql('SELECT * from myTable', [], function(tx,resultado){
			var rows = resultado.rows;
			var tr = '';
			for (var i = 0; i < rows.length; i++){
				tr += '<tr>';
				tr += '<td onClick= "atualizar('+ rows[i].id +')">' + rows[i].nome + '</td>';
				tr += '<td>' + rows[i].senha + '</td>';
				tr += '<td>' + rows[i].email + '</td>';
				tr += '</tr>';
			}

			console.log('Mostrar foi executado');
			console.log('tr: '+tr);
			console.log(table);

			table.innerHTML = tr;

		});
	}, null);
}

function atualizar(novoId) {

	var id = document.getElementById('field-id');
	var nome = document.getElementById('field-name');
	var pass = document.getElementById('field-pass');
	var mail = document.getElementById('field-mail');

	id.value = novoId;

	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM myTable WHERE id=?',[novoId], function(tx, resultado){

			var rows = resultado.rows[0];
			if (rows) {
				nome.value = rows.nome;
				pass.value = rows.senha;
				mail.value = rows.email;
			}
		});
	},null);

}

function deletar() {
	var id = document.getElementById('field-id').value;

	db.transaction(function (tx){
		tx.executeSql('DELETE FROM myTable WHERE id=?',[id]);
	})
	
	mostrar();
}
