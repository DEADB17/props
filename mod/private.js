export function error(alt, root, path, index) {
    const pathStr = path.join(', ');
    const key = path[index];
    const message = `${key} is not defined in [${pathStr}][${index}]`;
    const err = new ReferenceError(message);
    return Object.assign(err, {key, root, path, index});
}
