import { useState } from 'react';
import './TreeNode.css';

export default function TreeNode({ node, level = 0 }) {
const [isOpen, setIsOpen] = useState(false);
const hasChildren = node.children && node.children.length > 0;

return (
    <li className="tree-node" style={{ paddingLeft: `${level * 20}px` }}>
    <div
        className="tree-node-label"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
    >
        {hasChildren && (
        <span className="arrow">{isOpen ? '▼' : '▶'}</span>
        )}
        <span className="folder-icon" />
        <span className="node-name">{node.name}</span>
    </div>

    {hasChildren && isOpen && (
        <ul className="tree-children">
        {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
        ))}
        </ul>
    )}
    </li>
);
}
