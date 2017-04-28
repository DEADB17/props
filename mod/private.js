export function error(getter, root, path, index) {
    const pathStr = path.join(', ');
    const key = path[index];
    const message = `${key} is not defined in [${pathStr}][${index}]`;
    const err = new ReferenceError(message);
    return Object.assign(err, {getter, key, root, path, index});
}
