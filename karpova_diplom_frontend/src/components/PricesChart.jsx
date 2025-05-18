import React, { useEffect, useState } from 'react';
import { getPrices } from '../api/prices';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './PricesChart.css';

function PricesChart() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    getPrices().then(data => {
      const formatted = data.map(p => ({
        date: new Date(p.valid_from).toLocaleDateString(),
        price: p.price
      }));
      setPrices(formatted);
    });
  }, []);

  return (
    <div className="prices-chart-container">
      <div className="price-table-block">
        <h3>Список цен</h3>
        <div className="price-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p, index) => (
                <tr key={index}>
                  <td>{p.date}</td>
                  <td>{p.price} руб.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-block">
        <h3>Инфографика по ценам</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={filteredPrices
            .slice() // чтобы не мутировать исходный массив
            .sort((a, b) => new Date(a.valid_from) - new Date(b.valid_from))
            .map((p) => ({
              date: p.valid_from?.split('T')[0],
              price: p.price,
            }))}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis dataKey="price" />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#1976d2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PricesChart;



