const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = require('chai').expect;
const Fabricante = require('../models/fabricante');
const Mensaje = require('../mensaje');

chai.use(require('chai-http'));

const app = require('../app.js'); 
const url = '/api/fabricantes';

describe('api/fabricantes', function() {

 	afterEach(async () => {
		await Fabricante.deleteMany({});
  	});

	describe('GET /', () => {
		it('debe devolver todos los fabricantes', async () => {
			await Fabricante.deleteMany({});

			Fabricante.collection.insertMany([
				{ nombre: 'fabricante1' },
				{ nombre: 'fabricante2' }
			]);

			const res = await chai.request(app).get(url);

	    	expect(res).to.have.status(HttpStatus.OK);
	    	expect(res.body).to.be.an('object');
	    	expect(res.body).to.have.property('total').equal(2);
	    	expect(res.body).to.have.property('fabricantes');
	  	});
	});

	describe('GET /:id', () => {
		it('devuelve un fabricante si le pasamos un id válido', async () => {
			const fabricante = new Fabricante({ nombre: 'fabricante1' });
			await fabricante.save();			
			
			const res = await chai.request(app).get(url + `/${fabricante._id}`);

			expect(fabricante).to.not.be.null;
			expect(res.body).to.be.an('object');			
			expect(res).to.have.status(HttpStatus.OK);			
		});

		it('devuelve un error 404 si le pasamos un id de fabricante que no existe', async () => {
			const res = await chai.request(app).get('/api/fabricantes/1');

			expect(res).to.have.status(HttpStatus.NOT_FOUND);
			expect(res.body).to.have.property('msg').equal(Mensaje.PARAMETRO_ID_INCORRECTO);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await chai.request(app).get('/api/fabricantes/' + id);

			expect(res).to.have.status(HttpStatus.NOT_FOUND);			
			expect(res.body).to.have.property('msg').equal(Mensaje.FABRICANTE_NO_ENCONTRADO);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await chai.request(app).post(url).send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'fabricante1'; 
    	})

		it('devuelve un error 422 si el nombre del fabricante es inferior a 3 caracteres', async () => {
			nombre = new Array(2).join('a');
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un error 422 si el nombre del fabricante es vacío', async () => {
			nombre = '';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un estado 201 si el registro del fabricante es correcto', async () => {			
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.CREATED);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.FABRICANTE_REGISTRADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');			
			expect(res.body).to.be.an('object').to.have.property('fabricante');
		});

		it('devuelve un error 400 si registramos un fabricante existente', async () => {			
			await exec();
			res = await exec(); 			
			
			expect(res).to.have.status(HttpStatus.BAD_REQUEST);			
			expect(res.body).to.have.property('msg').equal(Mensaje.FABRICANTE_YA_EXISTE);				
		});
	});

	describe('PUT /', () => {
		let nombreActualizado;
		let id;
		let fabricante;

    	const exec = async () => {
      		return await chai.request(app).put(url + `/${id}`).send({ nombre: nombreActualizado });
    	}

    	beforeEach(async () => {     
        	fabricante = new Fabricante({ nombre: 'fabricante1' });
      		await fabricante.save();      
      
      		id = fabricante._id; 	
      		nombreActualizado = 'fabricanteActualizado'; 
    	})

		it('devuelve un error 422 si el nombre del fabricante es inferior a 3 caracteres', async () => {
			nombreActualizado = new Array(2).join('a');
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');			
		});

		it('devuelve un error 422 si el nombre del fabricante es vacío', async () => {
			nombreActualizado = '';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);			
			expect(res.body).to.be.an('object').to.have.property('errors');
		});

		it('devuelve un estado 200 si el registro del fabricante es correcto', async () => {			
			nombreActualizado = 'fabricanteActualizado';
			const res = await exec();
			
			expect(res).to.have.status(HttpStatus.OK);	
			expect(res).to.be.json;		
			expect(res.body).to.have.property('msg').equal(Mensaje.FABRICANTE_ACTUALIZADO);	
			expect(res.body).to.be.an('object').to.have.property('msg');
			expect(res.body).to.be.an('object').to.have.property('fabricante');
		});

		it('devuelve un error 400 si actualizamos un fabricante existente', async () => {			
			nombreActualizado = 'fabricante1';
			res = await exec(); 			
			
			expect(res).to.have.status(HttpStatus.BAD_REQUEST);			
			expect(res.body).to.have.property('msg').equal(Mensaje.FABRICANTE_YA_EXISTE);				
		});
	});
});