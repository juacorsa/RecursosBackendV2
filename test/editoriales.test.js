const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = require('chai').expect;
const Editorial = require('../models/editorial');
const Mensaje = require('../mensaje');

chai.use(require('chai-http'));

const app = require('../app.js'); 
const url = '/api/editoriales/';

describe('api/editoriales', function() {
 	afterEach(async () => {
		await Editorial.deleteMany({});
  	});

	describe('GET /', () => {
		it('debe devolver todas las editoriales', async () => {	
			await Editorial.deleteMany({});	

			Editorial.collection.insertMany([
				{ nombre: 'editorial1' },
				{ nombre: 'editorial2' }
			]);

			const res = await chai.request(app).get(url);

	    	expect(res).to.have.status(HttpStatus.OK);
	    	expect(res.body).to.be.an('object');
	    	expect(res.body).to.have.property('total').equal(2);
	    	expect(res.body).to.have.property('editoriales');
	  	});
	});

	describe('GET /:id', () => {
		it('devuelve una editorial si le pasamos un id válido', async () => {
			const editorial = new Editorial({ nombre: 'editorial1' });
			await editorial.save();			
			
			const res = await chai.request(app).get(url + editorial._id);

			expect(editorial).to.not.be.null;
			expect(res.body).to.be.an('object');			
			expect(res).to.have.status(HttpStatus.OK);			
		});

		it('devuelve un error 404 si le pasamos un id de editorial que no existe', async () => {
			const res = await chai.request(app).get(url + '1');

			expect(res).to.have.status(HttpStatus.NOT_FOUND);
			expect(res.body).to.have.property('msg').equal(Mensaje.PARAMETRO_ID_INCORRECTO);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await chai.request(app).get(url + id);

			expect(res).to.have.status(HttpStatus.NOT_FOUND);			
			expect(res.body).to.have.property('msg').equal(Mensaje.EDITORIAL_NO_ENCONTRADA);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await chai.request(app).post(url).send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'editorial1'; 
    	})

		it('devuelve un error 422 si el nombre de la editorial es inferior a 3 caracteres', async () => {
			nombre = new Array(2).join('a');
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un error 422 si el nombre de la editorial es vacía', async () => {
			nombre = '';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un estado 201 si el registro de la editorial es correcto', async () => {			
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.CREATED);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.EDITORIAL_REGISTRADA);	
			expect(res.body).to.be.an('object').to.have.property('msg');			
			expect(res.body).to.be.an('object').to.have.property('editorial');
		});

		it('devuelve un error 400 si registramos una editorial existente', async () => {			
			await exec();
			res = await exec(); 			
			
			expect(res).to.have.status(HttpStatus.BAD_REQUEST);			
			expect(res.body).to.have.property('msg').equal(Mensaje.EDITORIAL_YA_EXISTE);				
		});
	});

	describe('PUT /', () => {
		let nombreActualizado;
		let id;
		let editorial;

    	const exec = async () => {
      		return await chai.request(app).put(url + id).send({ nombre: nombreActualizado });
    	}

    	beforeEach(async () => {     
        	editorial = new Editorial({ nombre: 'editorial1' });
      		await editorial.save();      
      
      		id = editorial._id; 	
      		nombreActualizado = 'editorialActualizada'; 
    	})

		it('devuelve un error 422 si el nombre de la editorial es inferior a 3 caracteres', async () => {
			nombreActualizado = new Array(2).join('a');
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');			
		});

		it('devuelve un error 422 si el nombre de la editorial es vacío', async () => {
			nombreActualizado = '';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un estado 200 si el registro de la editorial es correcto', async () => {			
			nombreActualizado = 'editorialActualizada';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.OK);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.EDITORIAL_ACTUALIZADA);	
			expect(res.body).to.be.an('object').to.have.property('msg');
			expect(res.body).to.be.an('object').to.have.property('editorial');
		});

		it('devuelve un error 400 si actualizamos una editorial existente', async () => {			
			nombreActualizado = 'editorial1';
			res = await exec(); 			
			
			expect(res).to.have.status(HttpStatus.BAD_REQUEST);			
			expect(res.body).to.have.property('msg').equal(Mensaje.EDITORIAL_YA_EXISTE);				
		});
	});
});
