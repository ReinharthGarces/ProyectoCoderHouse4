const chai = require('chai');
const supertest = require('supertest');
require('dotenv').config();

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const AuthorizationTokenTest = process.env.TOKEN_JWT_TEST;
const user = { 
        _id: "651c1e62d8de707ff344ea05",
        name: "Bian",
        lastname: "Zamboni",
        email: "bianz@gmail.com",
        age: 23,
        __v: 0,
        role: "admin",
        cart: "651c1e69d8de707ff344ea0c"
      }

describe('Testing productsRouter', () => {
  describe('Test 1', () => {
    it('El método GET deberá generar productos ficticios', async () => {
      const response = await requester.get('/api/products/mockingproducts');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('mockProducts');
      expect(response.body.message).to.equal('Productos ficticios generados con éxito');
    });
  });

  describe('Test 2', () => {
    it('El método GET deberá devolver todos los productos', async () => {
      const response = await requester.get('/api/products');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.equal('success');
      expect(response.body).to.have.property('payload');
      expect(response.body.payload).to.be.an('array');
    });
  });

  describe('Test 3', () => {
    it('El método GET deberá devolver el producto correspondiente al ID pasado por params', async () => {
      const pid = '64d9469552ac83bcdecf71c0'; 
      const response = await requester.get(`/api/products/${pid}`);
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('available');
      expect(response.body.available).to.equal(true);
      expect(response.body).to.have.property('product');
    });
  });

  describe('Test 4', () => {
    it('El método POST deberá crear un nuevo producto', async () => {
      const newProduct = {
        name: 'Monitor4',
        description: 'Producto 12',
        code: 'CODE12',
        price: 40,
        stock: 100,
        category: 'monitores',
        thumbnail: 'monitorProducto12.jpg',
      };
  
      const response = await requester.post('/api/products')
        .send(newProduct)
        .set('Authorization', `Bearer ${AuthorizationTokenTest}`)
        .set('X-User', JSON.stringify(user));
      
      expect(response.status).to.be.equal(201);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.equal('success');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Product created');
    });
  });

  describe('Test 5', () => {
    it('El método PUT deberá actualizar el producto correspondiente al ID pasado por params', async () => {
      const pid = '64d948b252ac83bcdecf71f3'; 
      const updatedProductData = {
        price: 55,
        stock: 90,
        thumbnail: "monitor2Producto11.jpg"
      };

      const response = await requester.put(`/api/products/${pid}`).send(updatedProductData);
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body._id).to.be.equal(pid);
    });
  });

  describe('Test 6', () => {
    it('El método DELETE deberá eliminar el producto correspondiente al ID pasado por params', async () => {
      const pid = '655a6232c02873bbcba29923'; 

      const response = await requester.delete(`/api/products/${pid}`)
      .set('Authorization', `Bearer ${AuthorizationTokenTest}`)
      .set('X-User', JSON.stringify(user));

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message');
    });
  });
});