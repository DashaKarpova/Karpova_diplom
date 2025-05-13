import { useState } from 'react';

export default function TreeNode({ node }) {
const [isOpen, setIsOpen] = useState(false);
const hasChildren = node.children && node.children.length > 0;

return (
    <li>
    <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}
    >
        {hasChildren && (isOpen ? '▼ ' : '▶ ')}
        {node.name}
    </div>
    {hasChildren && isOpen && (
        <ul style={{ marginLeft: '1em' }}>
        {node.children.map(child => (
            <TreeNode key={child.id} node={child} />
        ))}
        </ul>
    )}
    </li>
);
}
