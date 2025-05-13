import React, { useEffect, useState } from 'react';
import { getPrices } from '../api/prices';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div>
      <h2>Инфографика по ценам</h2>
      <ResponsiveContainer width="95%" height={300}>
        <LineChart data={prices}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="price" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#1976d2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PricesChart;
