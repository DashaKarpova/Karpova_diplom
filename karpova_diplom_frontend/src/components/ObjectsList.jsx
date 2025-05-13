import React, { useEffect, useState } from 'react';
import { getObjects } from '../api/objects';

function ObjectsList() {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    getObjects().then(setObjects);
  }, []);

  return (
    <div>
      <h2>Объекты</h2>
      <ul>
        {objects.map(obj => (
          <li key={obj.id}>{obj.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ObjectsList;
