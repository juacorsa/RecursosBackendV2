const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = require('chai').expect;
const Tema = require('../models/tema');
const Mensaje = require('../mensaje');

chai.use(require('chai-http'));

const app = require('../app.js'); 

describe('api/temas', function() {

 	afterEach(async () => {
		await Tema.deleteMany({});
  	});

	describe('GET /', () => {
		it('debe devolver todos los temas', async () => {
			await Tema.deleteMany({});

			Tema.collection.insertMany([
				{ nombre: 'tema1' },
				{ nombre: 'tema2' }
			]);

			const res = await chai.request(app).get('/api/temas');

	    	expect(res).to.have.status(HttpStatus.OK);
	    	expect(res.body).to.be.an('object');
	    	expect(res.body).to.have.property('total').equal(2);
	    	expect(res.body).to.have.property('temas');
	  	});
	});

	describe('GET /:id', () => {
		it('devuelve un tema si le pasamos un id válido', async () => {
			const tema = new Tema({ nombre: 'tema1' });
			await tema.save();			

			const res = await chai.request(app).get('/api/temas/' + tema._id);

			expect(tema).to.not.be.null;
			expect(res.body).to.be.an('object');			
			expect(res).to.have.status(HttpStatus.OK);			
		});

		it('devuelve un error 404 si le pasamos un id de tema que no existe', async () => {
			const res = await chai.request(app).get('/api/temas/1');

			expect(res).to.have.status(HttpStatus.NOT_FOUND);
			expect(res.body).to.have.property('msg').equal(Mensaje.PARAMETRO_ID_INCORRECTO);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await chai.request(app).get('/api/temas/' + id);

			expect(res).to.have.status(HttpStatus.NOT_FOUND);			
			expect(res.body).to.have.property('msg').equal(Mensaje.TEMA_NO_ENCONTRADO);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await chai.request(app).post('/api/temas').send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'tema1'; 
    	})

		it('devuelve un error 422 si el nombre del tema es inferior a 3 caracteres', async () => {
			nombre = new Array(2).join('a');
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un error 422 si el nombre del tema es vacío', async () => {
			nombre = '';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un estado 201 si el registro del tema es correcto', async () => {			
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.CREATED);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.TEMA_REGISTRADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');
			expect(res.body).to.be.an('object').to.have.property('tema');
		});

		it('devuelve un error 400 si registramos un tema existente', async () => {			
			await exec();
			res = await exec(); 			
			
			expect(res).to.have.status(HttpStatus.BAD_REQUEST);			
			expect(res.body).to.have.property('msg').equal(Mensaje.TEMA_YA_EXISTE);				
		});
	});

	describe('PUT /', () => {
		let nombreActualizado;
		let id;
		let tema;

    	const exec = async () => {
      		return await chai.request(app).put('/api/temas/' + id).send({ nombre: nombreActualizado });
    	}

    	beforeEach(async () => {     
        	tema = new Tema({ nombre: 'tema1' });
      		await tema.save();      
      
      		id = tema._id; 	
      		nombreActualizado = 'temaActualizado'; 
    	})

		it('devuelve un error 422 si el nombre del tema es inferior a 3 caracteres', async () => {
			nombreActualizado = new Array(2).join('a');
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');			
		});

		it('devuelve un error 422 si el nombre del tema es vacío', async () => {
			nombreActualizado = '';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un estado 200 si el registro del tema es correcto', async () => {			
			nombreActualizado = 'temaActualizado';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.OK);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.TEMA_ACTUALIZADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');
			expect(res.body).to.be.an('object').to.have.property('tema');
		});

		it('devuelve un error 400 si actualizamos un tema existente', async () => {			
			nombreActualizado = 'tema1';
			res = await exec(); 			
			
			expect(res).to.have.status(HttpStatus.BAD_REQUEST);			
			expect(res.body).to.have.property('msg').equal(Mensaje.TEMA_YA_EXISTE);				
		});
	});
});