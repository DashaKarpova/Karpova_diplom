export function buildTree(data) {
    const map = {};
    const roots = [];

    data.forEach(item => {
    map[item.id] = { ...item, children: [] };
    });

    data.forEach(item => {
    const parent_id = item.parent_id;

    if (
        parent_id &&
        parent_id !== item.id &&
        map[parent_id]
    ) {
        map[parent_id].children.push(map[item.id]);
    } else {
        roots.push(map[item.id]);
    }
    });

    return roots;
}
