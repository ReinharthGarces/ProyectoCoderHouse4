const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing cartsRouter', () => {
  describe('Test 1', () => {
    it('El metodo POST debera crear un carrito nuevo', async () => {
      const response = await requester.post('/api/carts/');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('string');
    })
  })

  describe('Test 2', () => {
    it('El metodo GET debera devolver el carrito correspondiente al ID pasado por params', async () => {
      const cid = '6557a00570630c660c18d84b'; 
      const response = await requester.get(`/api/carts/${cid}`);
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('products')
    })
  })

  describe('Test 3', () => {
    it('El metodo POST debera obtener un carrito y permitir el POPULATE de products', async () => {
      const cid = '6557a00570630c660c18d84b';
      const pid = '64d9485c52ac83bcdecf71e9';
      const response = await requester.post(`/api/carts/${cid}/products/${pid}`);
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body.products).to.be.an('array');
    })
  })

  describe('Test 4', () => {
    it('El metodo DELETE debera eliminar del carrito el producto del ID pasado por params', async () => {
      const cid = '6557a00570630c660c18d84b';
      const pid = '64d9485c52ac83bcdecf71e9';
      const response = await requester.delete(`/api/carts/${cid}/products/${pid}`);
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('array');
    })
  })

  describe('Test 5', () => {
    it('El metodo PUT debera actualizar el carrito correspondiente al ID pasado por params', async () => {
      const cid = '6557a00570630c660c18d84b';  
      const updatedCartData = {
        products: [
          { productId: '64d9488c52ac83bcdecf71ee', quantity: 2 },
        ],
      };
  
      const response = await requester.put(`/api/carts/${cid}`).send(updatedCartData); 

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('products');
      expect(response.body.products).to.be.an('array');
  
      const updatedProduct = response.body.products.find(
        (product) => product.productId._id === '64d9488c52ac83bcdecf71ee'
      );

      expect(updatedProduct).to.exist;
      expect(updatedProduct.quantity).to.be.equal(2);
    });
  });

  describe('Test 6', () => {
    it('El metodo PUT debera actualizar el carrito y la cantidad del producto correspondiente al ID pasado por params', async () => {
      const cid = '6557a00570630c660c18d84b';
      const pid = '64d9488c52ac83bcdecf71ee';
      const updatedQuantity = 3;
  
      const response = await requester
        .put(`/api/carts/${cid}/products/${pid}`)
        .send({ quantity: updatedQuantity });
  
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('products');
      expect(response.body.products).to.be.an('array');

      const updatedProduct = response.body.products.find(
        (product) => product.productId._id === pid
      );
      expect(updatedProduct).to.exist;
      expect(updatedProduct).to.have.property('quantity');
      expect(updatedProduct.quantity).to.be.equal(updatedQuantity);
    });
  });
  
  describe('Test 7', () => {
    it('El metodo DELETE debera eliminar el carrito correspondiente al ID pasado por params', async () => {
      const cid = '6537177549635bb661e9d827';
  
      const response = await requester.delete(`/api/carts/${cid}`);
  
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('products');
      expect(response.body.products).to.be.an('array').that.is.empty;
    });
  });

  describe('Test 8', () => {
    it('El metodo POST debera realizar la compra del carrito correspondiente al ID pasado por params', async () => {
      const cid = '651c1e69d8de707ff344ea0c';
  
      const response = await requester.post(`/api/carts/${cid}/purchase`);
  
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Compra finalizada con éxito');
    });
  });
  
})