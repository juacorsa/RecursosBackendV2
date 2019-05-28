const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const chai = require('chai');
const expect  = require('chai').expect;

const Libro  = require('../models/libro');
const Tema = require('../models/tema');
const Editorial = require('../models/editorial');
const Idioma = require('../models/idioma');
const Mensaje = require('../mensaje');
const { generateString, generatePages, generateYear, getYear } = require('../util');

chai.use(require('chai-http'));

const app = require('../app.js'); 
const url = '/api/libros';

describe('api/libros', function() {
 	afterEach(async () => {
		await Libro.deleteMany({});
		await Tema.deleteMany({});
		await Editorial.deleteMany({});
		await Idioma.deleteMany({});
  	});

	describe('GET /', () => {			
		it('debería devolver todos los libros', async () => {			 
			await Libro.deleteMany({});
			await Tema.deleteMany({});
			await Editorial.deleteMany({});
			await Idioma.deleteMany({});

			const tema = new Tema({ nombre: generateString() }).save();			
			const editorial = new Editorial({ nombre: generateString() }).save();
			const idioma = new Idioma({ nombre: generateString() }).save();			
		
			Libro.collection.insertMany([
				{ 
					titulo: generateString(),					
					paginas: generatePages(),
					publicado: generateYear(),
					tema: tema,
					idioma: idioma,
					editorial: editorial,
					observaciones: generateString()
				},
				{ 
					titulo: generateString(),					
					paginas: generatePages(),
					publicado: generateYear(),
					tema: tema,
					idioma: idioma,
					editorial: editorial,
					observaciones: generateString()
				}
			]);

			const res = await chai.request(app).get(url);						

	    	expect(res).to.have.status(HttpStatus.OK);
	    	expect(res.body).to.be.an('object');
	    	expect(res.body).to.have.property('total_libros').equal(2);
	    	expect(res.body).to.have.property('total_paginas');
	    	expect(res.body).to.have.property('libros');
	  	});
	});

	describe('GET /:id', () => {
		it('debería devolver un libro', async () => {			
			const tema = new Tema({ nombre: generateString() }).save();			
			const editorial = new Editorial({ nombre: generateString() }).save();
			const idioma = new Idioma({ nombre: generateString() }).save();				

			let libro = new Libro({
				titulo: generateString(),
				paginas: generatePages(),
				publicado: generateYear(),				
				observaciones: generateString(),
				tema: tema._id,
				idioma: idioma._id,
				editorial: editorial._id
			});		

			libro = await libro.save();
		
			const res = await chai.request(app).get(url + '/' + libro._id);

			expect(libro).to.not.be.null;
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
			expect(res.body).to.have.property('msg').equal(Mensaje.LIBRO_NO_ENCONTRADO);
		});
	});

	describe('DELETE /:id', () => {		
		let titulo;		
		let observaciones;
		let tema;
		let idioma;
		let editorial;

		const exec = async () => {
			return await chai.request(app).post(url).send({ 
				titulo,
				paginas,
				publicado,				
				observaciones,
				tema,
				idioma,
				editorial
			});
		}	

		it('devuelve un error 404 si le pasamos un id de libro que no existe', async () => {
			const res = await chai.request(app).delete(url + '/1');

			expect(res).to.have.status(HttpStatus.NOT_FOUND);
			expect(res.body).to.have.property('msg').equal(Mensaje.PARAMETRO_ID_INCORRECTO);
		});

		it('debería devolver el libro que ha sido borrado', async () => {		
			await Libro.deleteMany({});
			await Tema.deleteMany({});
			await Editorial.deleteMany({});
			await Idioma.deleteMany({});

			tema = new Tema({nombre: generateString()});
			idioma = new Idioma({nombre: generateString()});
			editorial = new Editorial({nombre: generateString()});

			tema = await tema.save();
			idioma = await idioma.save();
			editorial = await editorial.save();

			titulo = generateString();
			observaciones = generateString();
			paginas = generatePages();
			publicado = generateYear();

			let res = await exec();							
			
			res = await chai.request(app).delete(url + '/' + res.body.libro._id);			
		
			expect(res).to.have.status(HttpStatus.OK);												
			expect(res.body).to.be.an('object').to.have.property('libro');
			expect(res.body).to.have.property('msg').equal(Mensaje.LIBRO_BORRADO);				
		});
	});

	describe('POST /', () => {	
		let titulo;		
		let observaciones;
		let tema;
		let idioma;
		let editorial;
		let paginas;
		let publicado;
		let añoActual = getYear();
		let añoMinimo = 2000;

		const exec = async () => {
			return await chai.request(app).post(url).send({ 
				titulo, 
				paginas,
				publicado,				
				observaciones,
				editorial,
				idioma,
				tema
			});
		}		

		beforeEach(async () => {  			
			await Libro.deleteMany({});
			await Tema.deleteMany({});
			await Editorial.deleteMany({});
			await Idioma.deleteMany({});

			tema = new Tema({nombre: generateString()});
			idioma = new Idioma({nombre: generateString()});
			editorial = new Editorial({nombre: generateString()});

			tema = await tema.save();
			idioma = await idioma.save();
			editorial = await editorial.save();
			titulo = generateString();
			paginas = generatePages();
			publicado = generateYear();
			observaciones = generateString();
    	})

		it('debería devolver un error 422 si el título del libro es vacío', async () => {		
			titulo = '';
			const res = await exec();			

			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);						
			expect(res.body).to.be.an('object').to.have.property('errors');						
		});

		it('debería devolver un error 422 si el año de publicación es posterior al actual', async () => {									
			publicado = añoActual + 1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('debería devolver un error 422 si el año de publicación es anterior al 2000', async () => {									
			publicado = añoMinimo - 1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});	

		it('debería devolver un error 422 si el número de páginas es inferior a cero', async () => {									
			paginas = -1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});				

		it('debería devolver un código de estado 201 si el libro se ha registrado correctamente', async () => {			
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.CREATED);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.LIBRO_REGISTRADO);	
			expect(res.body).to.be.an('object').to.have.property('libro');
		});
	});

	describe('PUT /:id', () => {	
		let titulo;		
		let observaciones;
		let tema;
		let idioma;
		let editorial;
		let paginas;
		let publicado;
		let añoActual = getYear();
		let añoMinimo = 2000;

		const exec = async () => {
			return await chai.request(app).put(url + '/' + id).send({ 
				titulo, 
				paginas,
				publicado,				
				observaciones,
				editorial,
				idioma,
				tema
			});
		}		

		beforeEach(async () => {  			
			await Tema.deleteMany({});
			await Editorial.deleteMany({});
			await Idioma.deleteMany({});

			tema = new Tema({ nombre: generateString() });
			idioma = new Idioma({ nombre: generateString() });
			editorial = new Editorial({ nombre: generateString() });

			tema = await tema.save();
			idioma = await idioma.save();
			editorial = await editorial.save();

			let libro = new Libro({
				titulo: generateString(),
				paginas: generatePages(),
				publicado: getYear(),
				observaciones: generateString(),
				tema: tema._id,
				idioma: idioma._id,
				editorial: editorial._id
			});

			libro = await libro.save();

			id = libro._id;				
    	})

		it('debería devolver un error 422 si el título del libro es vacío', async () => {		
			titulo = '';						
			const res = await exec();					

			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);						
			expect(res.body).to.be.an('object').to.have.property('errors');						
		});

		it('debería devolver un error 422 si el año de publicación es posterior al actual', async () => {									
			publicado = añoActual + 1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('debería devolver un error 422 si el año de publicación es anterior al 2000', async () => {									
			publicado = añoMinimo - 1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});	

		it('debería devolver un error 422 si el número de páginas es inferior a cero', async () => {									
			paginas = -1;
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});				

		it('debería devolver un código de estado 201 si la actualizacion del libro ha sido correcta', async () => {			
			titulo = generateString();
			observaciones = generateString();
			paginas = generatePages();
			publicado = getYear();
			tema = await Tema.findOne();
			idioma = await Idioma.findOne();
			editorial = await Editorial.findOne();

			const libro = await Libro.findOne();
			id = libro._id;

			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.OK);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.LIBRO_ACTUALIZADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');			
			expect(res.body).to.be.an('object').to.have.property('libro');
		});
	});
});
