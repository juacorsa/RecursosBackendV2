const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const chai = require('chai');
const expect  = require('chai').expect;

const Tutorial  = require('../models/tutorial');
const Tema = require('../models/tema');
const Fabricante = require('../models/fabricante');
const Idioma = require('../models/idioma');
const Mensaje = require('../mensaje');
const { generateString, generateMinutes, generateYear, getYear } = require('../util');

chai.use(require('chai-http'));

const app = require('../app.js'); 
const url = '/api/tutoriales';

describe('api/tutoriales', function() {
 	afterEach(async () => {
		await Tutorial.deleteMany({});
		await Tema.deleteMany({});
		await Fabricante.deleteMany({});
		await Idioma.deleteMany({});
  	});

	describe('GET /', () => {			
		it('debería devolver todos los tutoriales', async () => {			 
			await Tutorial.deleteMany({});
			await Tema.deleteMany({});
			await Fabricante.deleteMany({});
			await Idioma.deleteMany({});

			const tema = new Tema({ nombre: generateString() }).save();			
			const fabricante = new Fabricante({ nombre: generateString() }).save();
			const idioma = new Idioma({ nombre: generateString() }).save();			
		
			Tutorial.collection.insertMany([
				{ 
					titulo: generateString(),					
					duracion: generateMinutes(),
					publicado: generateYear(),
					tema: tema,
					idioma: idioma,
					fabricante: fabricante,
					observaciones: generateString()
				},
				{ 
					titulo: generateString(),					
					duracion: generateMinutes(),
					publicado: generateYear(),
					tema: tema,
					idioma: idioma,
					fabricante: fabricante,
					observaciones: generateString()
				}
			]);

			const res = await chai.request(app).get(url);						

	    	expect(res).to.have.status(HttpStatus.OK);
	    	expect(res.body).to.be.an('object');
	    	expect(res.body).to.have.property('total_tutoriales').equal(2);
	    	expect(res.body).to.have.property('total_duracion');
	    	expect(res.body).to.have.property('tutoriales');
	  	});
	});

	describe('GET /:id', () => {
		it('debería devolver un tutorial', async () => {			
			const tema = new Tema({ nombre: generateString() }).save();			
			const fabricante = new Fabricante({ nombre: generateString() }).save();
			const idioma = new Idioma({ nombre: generateString() }).save();				

			let tutorial = new Tutorial({
				titulo: generateString(),
				duracion: generateMinutes(),
				publicado: generateYear(),				
				observaciones: generateString(),
				tema: tema._id,
				idioma: idioma._id,
				fabricante: fabricante._id
			});		

			tutorial = await tutorial.save();
		
			const res = await chai.request(app).get(url + '/' + tutorial._id);

			expect(tutorial).to.not.be.null;
			expect(res.body).to.be.an('object');			
			expect(res).to.have.status(HttpStatus.OK);			
		});

		it('devuelve un error 404 si le pasamos un id de enlace que no existe', async () => {
			const res = await chai.request(app).get(url + '/1');

			expect(res).to.have.status(HttpStatus.NOT_FOUND);
			expect(res.body).to.have.property('msg').equal(Mensaje.PARAMETRO_ID_INCORRECTO);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await chai.request(app).get(url + '/' + id);

			expect(res).to.have.status(HttpStatus.NOT_FOUND);			
			expect(res.body).to.have.property('msg').equal(Mensaje.TUTORIAL_NO_ENCONTRADO);
		});
	});

	describe('DELETE /:id', () => {		
		let titulo;		
		let duracion;
		let observaciones;
		let tema;
		let idioma;
		let fabricante;

		const exec = async () => {
			return await chai.request(app).post(url).send({ 
				titulo,
				duracion,
				publicado,				
				observaciones,
				tema,
				idioma,
				fabricante
			});
		}	

		it('devuelve un error 404 si le pasamos un id de tutorial que no existe', async () => {
			const res = await chai.request(app).delete(url + '/1');

			expect(res).to.have.status(HttpStatus.NOT_FOUND);
			expect(res.body).to.have.property('msg').equal(Mensaje.PARAMETRO_ID_INCORRECTO);
		});

		it('debería devolver el tutorial que ha sido borrado', async () => {		
			await Tutorial.deleteMany({});
			await Tema.deleteMany({});
			await Fabricante.deleteMany({});
			await Idioma.deleteMany({});

			tema = new Tema({nombre: generateString()});
			idioma = new Idioma({nombre: generateString()});
			fabricante = new Fabricante({nombre: generateString()});

			tema = await tema.save();
			idioma = await idioma.save();
			fabricante = await fabricante.save();

			titulo = generateString();
			observaciones = generateString();
			duracion = generateMinutes();
			publicado = generateYear();

			let res = await exec();							
			
			res = await chai.request(app).delete(url + '/' + res.body.tutorial._id);			
		
			expect(res).to.have.status(HttpStatus.OK);												
			expect(res.body).to.be.an('object').to.have.property('tutorial');
			expect(res.body).to.have.property('msg').equal(Mensaje.TUTORIAL_BORRADO);				
		});
	});

	describe('POST /', () => {	
		let titulo;		
		let observaciones;
		let tema;
		let idioma;
		let fabricante;
		let duracion;
		let publicado;
		let añoActual = getYear();
		let añoMinimo = 2010;

		const exec = async () => {
			return await chai.request(app).post(url).send({ 
				titulo, 
				duracion,
				publicado,				
				observaciones,
				fabricante,
				idioma,
				tema
			});
		}		

		beforeEach(async () => {  			
			await Tutorial.deleteMany({});
			await Tema.deleteMany({});
			await Fabricante.deleteMany({});
			await Idioma.deleteMany({});

			tema = new Tema({nombre: generateString()});
			idioma = new Idioma({nombre: generateString()});
			fabricante = new Fabricante({nombre: generateString()});

			tema = await tema.save();
			idioma = await idioma.save();
			fabricante = await fabricante.save();
			titulo = generateString();
			duracion = generateMinutes();
			publicado = generateYear();
			observaciones = generateString();
    	})

		it('debería devolver un error 422 si el título del tutorial es vacío', async () => {		
			titulo = '';
			const res = await exec();			

			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);						
			expect(res.body).to.have.property('msg').equal(Mensaje.TITULO_REQUERIDO);	
		});

		it('debería devolver un error 422 si el año de publicación es posterior al actual', async () => {									
			publicado = añoActual + 1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.have.property('msg').equal(Mensaje.AÑO_PUBLICACION_NO_VALIDO);	
		});

		it('debería devolver un error 422 si el año de publicación es anterior al año mínimo', async () => {									
			publicado = añoMinimo - 1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.have.property('msg').equal(Mensaje.AÑO_PUBLICACION_NO_VALIDO);	
		});	

		it('debería devolver un error 422 si la duración del tutorial es inferior a cero', async () => {									
			duracion = -1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.have.property('msg').equal(Mensaje.DURACION_NO_VALIDA);	
		});				

		it('debería devolver un código de estado 201 si el libro se ha registrado correctamente', async () => {			
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.CREATED);	
			expect(res).to.be.json;		
			expect(res).to.have.status(HttpStatus.CREATED);			
			expect(res.body).to.have.property('msg').equal(Mensaje.TUTORIAL_REGISTRADO);	
			expect(res.body).to.be.an('object').to.have.property('tutorial');
		});
	});

	describe('PUT /:id', () => {	
		let titulo;		
		let observaciones;
		let tema;
		let idioma;
		let fabricante;
		let duracion;
		let publicado;
		let añoActual = getYear();
		let añoMinimo = 2010;

		const exec = async () => {
			return await chai.request(app).put(url + '/' + id).send({ 
				titulo, 
				duracion,
				publicado,				
				observaciones,
				fabricante,
				idioma,
				tema
			});
		}		

		beforeEach(async () => {  			
			await Tema.deleteMany({});
			await Fabricante.deleteMany({});
			await Idioma.deleteMany({});

			tema = new Tema({ nombre: generateString() });
			idioma = new Idioma({ nombre: generateString() });
			fabricante = new Fabricante({ nombre: generateString() });

			tema   = await tema.save();
			idioma = await idioma.save();
			fabricante = await fabricante.save();
			titulo    = generateString();
			duracion  = generateMinutes();
			publicado = generateYear();
			observaciones = generateString();

			let tutorial = new Tutorial({
				titulo: generateString(),				
				publicado: getYear(),
				duracion: generateMinutes(),
				observaciones: generateString(),
				tema  : tema._id,
				idioma: idioma._id,
				fabricante: fabricante._id
			});

			tutorial = await tutorial.save();
			id = tutorial._id;				
    	})

		it('debería devolver un error 422 si el título del tutorial es vacío', async () => {		
			titulo = '';
			const res = await exec();			

			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);						
			expect(res.body).to.have.property('msg').equal(Mensaje.TITULO_REQUERIDO);						
		});

		it('debería devolver un error 422 si el año de publicación es posterior al actual', async () => {									
			publicado = añoActual + 1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.have.property('msg').equal(Mensaje.AÑO_PUBLICACION_NO_VALIDO);	
		});

		it('debería devolver un error 422 si el año de publicación es anterior al año mínimo', async () => {									
			publicado = añoMinimo - 1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.have.property('msg').equal(Mensaje.AÑO_PUBLICACION_NO_VALIDO);	
		});	

		it('debería devolver un error 422 si la duración del tutorial es inferior a cero', async () => {									
			duracion = -1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.have.property('msg').equal(Mensaje.DURACION_NO_VALIDA);	
		});				

		it('debería devolver un código de estado 201 si la actualizacion del tutorial ha sido correcta', async () => {			
			titulo = generateString();
			observaciones = generateString();
			duracion = generateMinutes();
			publicado = getYear();
			tema = await Tema.findOne();
			idioma = await Idioma.findOne();
			fabricante = await Fabricante.findOne();

			const tutorial = await Tutorial.findOne();
			id = tutorial._id;

			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.OK);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.TUTORIAL_ACTUALIZADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');			
			expect(res.body).to.be.an('object').to.have.property('tutorial');
		});
	});
});
