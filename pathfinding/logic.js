let nodes = [
    1, 2, 3, 4
]

let paths = {
    [1, 2]: 2,
    [1, 3]: 3,
    [4, 1]: 4
}

function objFromArr(array, value) {
    const obj = array.reduce((acc, current) => {
    acc[current] = value;
    return acc;
    }, {});

    return obj
}

function getConnectingPaths(node, paths) {
    let connectingPaths = [];

    paths.array.forEach(path => {
        if (path[0] == node) {
            connectingPaths.push(path);
        }
        if (path[1] == node) {
            path.reverse()
            connectingPaths.push(path);
        }
    });

    return connectingPaths;
}