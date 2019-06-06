
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const database = 'recursos';
const total = +process.argv[2]; 

MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {   
  const db = client.db(database); 
  const collection = db.collection('enlaces');
  
  console.log('Vaciando colección...');
  collection.deleteMany({}); 

  console.log(`Insertando ${total} documentos...`); 
  for (let i = 0; i < total; i++) {
  	if (i % 1000 == 0) console.log(`${i} documentos registrados...`);
  	collection.insertOne({ nombre: 'enlace ' + i})
  };
  
  console.log(`${total} documentos registrados`);
  console.log('Cerrando conexión con la base de datos.');  
  client.close();
  console.log('Proceso finalizado!!');
});

