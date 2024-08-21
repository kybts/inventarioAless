import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './App.css';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const addProduct = async () => {
    const newProduct = { name, description, quantity, price };
    await axios.post('http://localhost:5000/api/products', newProduct);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const chartData = {
    labels: products.map(product => product.name),
    datasets: [{
      label: 'Cantidad de Productos',
      data: products.map(product => product.quantity),
      backgroundColor: 'rgba(255, 182, 193, 0.5)',  // Color de fondo rosa pastel
      borderColor: 'rgba(255, 182, 193, 1)',         // Color de borde rosa pastel
      borderWidth: 1,
    }],
  };

  return (
    <div className="App">
      <h1>Inventario</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="form-input"
        />
        <button onClick={addProduct} className="submit-button">Agregar Producto</button>
      </div>
      <h2>Lista de Productos</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product._id} className="product-item">
            {product.name} - {product.description} - {product.quantity} - ${product.price}
            <button onClick={() => deleteProduct(product._id)} className="delete-button">Eliminar</button>
          </li>
        ))}
      </ul>
      <h2>Gráfica de Inventario</h2>
      <div className="chart-container">
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

export default App;
