import TreeNode from '../utils/TreeNode';
import { buildTree } from '../utils/buildTree';

export default function TreeView({ data }) {
const tree = buildTree(data);

return (
    <ul>
    {tree.map(node => (
        <TreeNode key={node.id} node={node} />
    ))}
    </ul>
);
}
