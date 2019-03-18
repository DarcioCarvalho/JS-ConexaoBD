
var db = openDatabase('dbTips', '1.0', 'Meu Primeiro Banco', 2 * 1024 * 1024);


db.transaction (function(tx){
	tx.executeSql('Create Table tips (id Primary Key, nome TEXT)' );
} );	


