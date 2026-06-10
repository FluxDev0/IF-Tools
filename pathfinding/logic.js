let nodes = [
    1, 2, 3, 4, 5
]

let paths = [
    [1, 2, 2],
    [4, 1, 4],
    [1, 3, 3],
    [2, 4, 1],
    [2, 5, 2]
]

function objFromArr(array, value = 0) {
    const obj = array.reduce((acc, current) => {
    acc[current] = Array.isArray(value) ? [...value] : value;
    return acc;
    }, {});

    return obj
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function dijkstraAnimated(nodes, paths, startnode, endnode) {
    let todo_nodes = [startnode]
    // path decleration: [node1, node2, weight]
    // node decleration: [cost, visited, lastnode]
    nodes = objFromArr(nodes, [Infinity, false, "no last node"])
    nodes[startnode] = [0, false, "startnode"]

    let currentNode
    let otherNode
    while (todo_nodes.length !== 0) {
        currentNode = todo_nodes.pop()

        if (currentNode == endnode) {
            break;
        }

        if (nodes[currentNode][1]) continue;

        paths.forEach(async path => {
            if (path[0] == currentNode) {
                otherNode = path[1]
            }
            if (path[1] == currentNode) {
                otherNode = path[0]
            }
            if (path[0] == currentNode || path[1] == currentNode) {
                const oldCost = nodes[otherNode][0]
                const currentCost = path[2] + nodes[currentNode][0]
                if (oldCost > currentCost) {
                    nodes[otherNode][0] = currentCost
                    nodes[otherNode][2] = currentNode
                }
                if (!nodes[otherNode][1] && !todo_nodes.includes(otherNode)) {
                    todo_nodes.push(otherNode)
                }
                await sleep(500)
            }
        });

        nodes[currentNode][1] = true;

        todo_nodes.sort((a, b) => nodes[b][0] - nodes[a][0])
    }
    await sleep(500)

    let route = [endnode]
    let nextNode = endnode
    while (true) {
        if (nodes[nextNode][2] == "startnode") break;
        route.push(nodes[nextNode][2])
        nextNode = nodes[nextNode][2]
    }

    return route;
}

function dijkstra(nodes, paths, startnode, endnode) {
    let todo_nodes = [startnode]
    // path decleration: [node1, node2, weight]
    // node decleration: [cost, visited, lastnode]
    nodes = objFromArr(nodes, [Infinity, false, "no last node"])
    nodes[startnode] = [0, false, "startnode"]

    let currentNode
    let otherNode
    while (todo_nodes.length !== 0) {
        currentNode = todo_nodes.pop()

        if (currentNode == endnode) {
            break;
        }

        if (nodes[currentNode][1]) continue;

        paths.forEach(path => {
            if (path[0] == currentNode) {
                otherNode = path[1]
            }
            if (path[1] == currentNode) {
                otherNode = path[0]
            }
            if (path[0] == currentNode || path[1] == currentNode) {
                const oldCost = nodes[otherNode][0]
                const currentCost = path[2] + nodes[currentNode][0]
                if (oldCost > currentCost) {
                    nodes[otherNode][0] = currentCost
                    nodes[otherNode][2] = currentNode
                }
                if (!nodes[otherNode][1] && !todo_nodes.includes(otherNode)) {
                    todo_nodes.push(otherNode)
                }
            }
        });

        nodes[currentNode][1] = true;

        todo_nodes.sort((a, b) => nodes[b][0] - nodes[a][0])
    }

    let route = [endnode]
    let nextNode = endnode
    while (true) {
        if (nodes[nextNode][2] == "startnode") break;
        route.push(nodes[nextNode][2])
        nextNode = nodes[nextNode][2]
    }

    return route;
}

function getConnections(route) {
    let data = []
    for (let i = 0; i < (route.length - 1); i++) {
        data.push([route[i], route[i+1]])
    }
    return data
}