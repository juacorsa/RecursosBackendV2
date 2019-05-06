const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const chai = require('chai');
const expect  = require('chai').expect;
const Idioma  = require('../models/idioma');
const Mensaje = require('../mensaje');

chai.use(require('chai-http'));

const app = require('../app.js'); 
const url = '/api/idiomas/';

describe('api/idiomas', function() {
 	afterEach(async () => {
		await Idioma.deleteMany({});
  	});

	describe('GET /', () => {
		it('debe devolver todos los idiomas', async () => {
			await Idioma.deleteMany({});

			Idioma.collection.insertMany([
				{ nombre: 'idioma1' },
				{ nombre: 'idioma2' }
			]);

			const res = await chai.request(app).get(url);

	    	expect(res).to.have.status(HttpStatus.OK);
	    	expect(res.body).to.be.an('object');
	    	expect(res.body).to.have.property('total').equal(2);
	    	expect(res.body).to.have.property('idiomas');
	  	});
	});

	describe('GET /:id', () => {
		it('devuelve un idioma si le pasamos un id válido', async () => {
			const idioma = new Idioma({ nombre: 'idioma1' });
			await idioma.save();			
			
			const res = await chai.request(app).get(url + idioma._id);

			expect(idioma).to.not.be.null;
			expect(res.body).to.be.an('object');			
			expect(res).to.have.status(HttpStatus.OK);			
		});

		it('devuelve un error 404 si le pasamos un id de idioma que no existe', async () => {
			const res = await chai.request(app).get(url + '/1');

			expect(res).to.have.status(HttpStatus.NOT_FOUND);
			expect(res.body).to.have.property('msg').equal(Mensaje.PARAMETRO_ID_INCORRECTO);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await chai.request(app).get(url + id);

			expect(res).to.have.status(HttpStatus.NOT_FOUND);			
			expect(res.body).to.have.property('msg').equal(Mensaje.IDIOMA_NO_ENCONTRADO);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await chai.request(app).post(url).send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'idioma1'; 
    	})

		it('devuelve un error 422 si el nombre del idioma es inferior a 3 caracteres', async () => {
			nombre = new Array(2).join('a');
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un error 422 si el nombre del idioma es vacío', async () => {
			nombre = '';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un estado 201 si el registro del idioma es correcto', async () => {			
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.CREATED);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.IDIOMA_REGISTRADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');			
			expect(res.body).to.be.an('object').to.have.property('idioma');
		});

		it('devuelve un error 400 si registramos un idioma existente', async () => {			
			await exec();
			res = await exec(); 			
			
			expect(res).to.have.status(HttpStatus.BAD_REQUEST);			
			expect(res.body).to.have.property('msg').equal(Mensaje.IDIOMA_YA_EXISTE);				
		});
	});

	describe('PUT /', () => {
		let nombreActualizado;
		let id;
		let idioma;

    	const exec = async () => {
      		return await chai.request(app).put(url + id).send({ nombre: nombreActualizado });
    	}

    	beforeEach(async () => {     
        	idioma = new Idioma({ nombre: 'idioma1' });
      		await idioma.save();      
      
      		id = idioma._id; 	
      		nombreActualizado = 'idiomaActualizado'; 
    	})

		it('devuelve un error 422 si el nombre del idioma es inferior a 3 caracteres', async () => {
			nombreActualizado = new Array(2).join('a');
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');			
		});

		it('devuelve un error 422 si el nombre del idioma es vacío', async () => {
			nombreActualizado = '';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un estado 200 si el registro del idioma es correcto', async () => {			
			nombreActualizado = 'idiomaActualizado';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.OK);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.IDIOMA_ACTUALIZADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');
			expect(res.body).to.be.an('object').to.have.property('idioma');
		});

		it('devuelve un error 400 si actualizamos un idioma existente', async () => {			
			nombreActualizado = 'idioma1';
			res = await exec(); 			
			
			expect(res).to.have.status(HttpStatus.BAD_REQUEST);			
			expect(res.body).to.have.property('msg').equal(Mensaje.IDIOMA_YA_EXISTE);				
		});
	});
});
