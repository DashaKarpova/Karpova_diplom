import { useState } from 'react';
import './TreeNode.css';

export default function TreeNode({ node, level = 0, showCheckbox = false, showHierarchy = true, onCheck }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = showHierarchy && node.children?.length > 0;

  const handleCheck = (e) => {
    e.stopPropagation();
    onCheck?.(node.id, e.target.checked);
  };

  return (
    <li className="tree-node" style={{ paddingLeft: `${level * 20}px` }}>
      <div
        className="tree-node-label"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren && <span className="arrow">{isOpen ? '▼' : '▶'}</span>}
        
        {showCheckbox && (
          <input
            type="checkbox"
            checked={node.checked || false}
            onChange={handleCheck}
            className="node-checkbox"
          />
        )}
        
        <span className="folder-icon" />
        <span className="node-name">{node.fullname || node.name}</span>
      </div>

      {hasChildren && isOpen && (
        <ul className="tree-children">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              showCheckbox={showCheckbox}
              showHierarchy={showHierarchy}
              onCheck={onCheck}
            />
          ))}
        </ul>
      )}
    </li>
  );
}