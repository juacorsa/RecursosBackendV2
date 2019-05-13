const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const chai = require('chai');
const expect  = require('chai').expect;

const Enlace  = require('../models/enlace');
const Tema    = require('../models/tema');
const Mensaje = require('../mensaje');
const { generateUrl, generateString } = require('../util');

chai.use(require('chai-http'));

const app = require('../app.js'); 
const url = '/api/enlaces';

describe('api/enlaces', function() {
 	afterEach(async () => {
		await Enlace.deleteMany({});
		await Tema.deleteMany({});
  	});

	describe('GET /', () => {			
		it('debería devolver todos los enlaces', async () => {			 
			await Enlace.deleteMany({});	
			await Tema.deleteMany({});

			const tema1 = new Tema({ nombre: generateString() }).save();
			const tema2 = new Tema({ nombre: generateString() }).save();
		
			Enlace.collection.insertMany([
				{ 
					titulo: generateString(),
					url: generateUrl(),
					tema: tema1._id, 
					observaciones: generateString()
				},
				{ 
					titulo: generateString(),
					url: generateUrl(),
					tema: tema2._id, 
					observaciones: generateString()
				}
			]);

			const res = await chai.request(app).get(url);						

	    	expect(res).to.have.status(HttpStatus.OK);
	    	expect(res.body).to.be.an('object');
	    	expect(res.body).to.have.property('total').equal(2);
	    	expect(res.body).to.have.property('enlaces');
	  	});
	});

	describe('GET /:id', () => {
		it('devuelve un enlace si le pasamos un id válido', async () => {			
			const tema = new Tema({ nombre: generateString() }).save();

			let enlace = new Enlace({
				titulo: generateString(),
				url: generateUrl(),
				observaciones: generateString(),
				tema: tema._id
			});		

			enlace = await enlace.save();
		
			const res = await chai.request(app).get(url + '/' + enlace._id);

			expect(enlace).to.not.be.null;
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
			expect(res.body).to.have.property('msg').equal(Mensaje.ENLACE_NO_ENCONTRADO);
		});
	});

	describe('POST /', () => {	
		let titulo;
		let url_enlace;
		let observaciones;
		let tema;

		const exec = async () => {
			return await chai.request(app).post(url).send({ 
				titulo, 
				"url": url_enlace, 
				observaciones,
				tema
			});
		}		

		beforeEach(async () => {  			
			await Tema.deleteMany({});
			tema = new Tema({ nombre: generateString() });
			tema = await tema.save();
			titulo = generateString(),
			url_enlace    = generateUrl(),
			observaciones = generateString()
    	})

		it('debería devolver un error 422 si el título del enlace es vacío', async () => {		
			titulo = '';
			const res = await exec();	
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');						
		});

		it('debería devolver un error 422 si la url del enlace es vacía', async () => {						
			url_enlace = '';
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('debería devolver un código de estado 201 si el registro del enlace es correcto', async () => {			
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.CREATED);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.ENLACE_REGISTRADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');			
			expect(res.body).to.be.an('object').to.have.property('enlace');
		});
	});

	describe('PUT /:id', () => {	
		let titulo;
		let url_enlace;
		let observaciones;
		let tema;
		let id;

		const exec = async () => {
			return await chai.request(app).put(url + '/' + id).send({ 
				titulo, 
				"url": url_enlace, 
				observaciones,
				tema
			});
		}		

		beforeEach(async () => {  			
			await Tema.deleteMany({});
			tema = new Tema({ nombre: generateString() }).save();			

			const enlace = new Enlace({
				titulo: generateString(),
				url: generateUrl(),
				observaciones: generateString(),
				tema: tema._id
			}).save();					
    	})

		it('debería devolver un error 422 si el título del enlace es vacío', async () => {		
			titulo = '';	

			const res = await exec();	
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');						
		});

		it('debería devolver un error 422 si la url del enlace es vacía', async () => {						
			url_enlace = '';
			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('debería devolver un código de estado 201 si la actualizacion del enlace ha sido correcta', async () => {			
			titulo = generateString();
			observaciones = generateString();
			url_enlace = generateUrl();
			tema = await Tema.findOne();

			const enlace = await Enlace.findOne();
			id = enlace._id;

			const res = await exec();			
			
			expect(res).to.have.status(HttpStatus.OK);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.ENLACE_ACTUALIZADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');			
			expect(res.body).to.be.an('object').to.have.property('enlace');
		});
	});

	describe('DELETE /:id', () => {		
		let titulo;
		let url_enlace;
		let observaciones;
		let tema;

		const exec = async () => {
			return await chai.request(app).post(url).send({ 
				titulo,
				"url": url_enlace,
				observaciones,
				tema
			});
		}	

		it('devuelve un error 404 si le pasamos un id de enlace que no existe', async () => {
			const res = await chai.request(app).delete(url + '/1');

			expect(res).to.have.status(HttpStatus.NOT_FOUND);
			expect(res.body).to.have.property('msg').equal(Mensaje.PARAMETRO_ID_INCORRECTO);
		});

		it('debería devolver el enlace que ha sido borrado', async () => {		
			await Enlace.deleteMany({});
			await Tema.deleteMany({});

			tema = new Tema({ nombre: generateString() });
			tema = await tema.save();
			titulo = generateString();
			url_enlace    = generateUrl();
			observaciones = generateString();

			let res = await exec();				
			
			res = await chai.request(app).delete(url + '/' + res.body.enlace._id);			
		
			expect(res).to.have.status(HttpStatus.OK);				
			expect(res.body).to.be.an('object');						
			expect(res.body).to.be.an('object').to.have.property('enlace');
			expect(res.body).to.have.property('msg').equal(Mensaje.ENLACE_BORRADO);				
		});
	});


});