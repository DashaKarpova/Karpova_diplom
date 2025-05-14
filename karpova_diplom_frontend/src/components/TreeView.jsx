import TreeNode from '../utils/TreeNode';
import { buildTree } from '../utils/buildTree';

export default function TreeView({ data, showCheckbox = false, showHierarchy = true, onCheck }) {
  const processedData = showHierarchy ? buildTree(data) : data;

  return (
    <ul className="tree-root">
      {processedData.map(node => (
        <TreeNode 
          key={node.id} 
          node={node} 
          showCheckbox={showCheckbox}
          showHierarchy={showHierarchy}
          onCheck={onCheck}
        />
      ))}
    </ul>
  );
}