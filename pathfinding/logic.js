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

function drawLine(pointA = [10, 100], pointB = [100, 100], lineWidth = 2, color = "#dbdbdb", querySelector = '#pathfinding #canvas') {
    const canvas = document.querySelector(querySelector);
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function drawCircle(position = [200, 200], radius = 20, color = "#3bb7e7", querySelector = '#pathfinding #canvas') {
    const canvas = document.querySelector(querySelector);
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(position[0], position[1], radius, 0, 2 * Math.PI); 
    ctx.fillStyle = color;
    ctx.fill();
}

function clearCanvas(querySelector = '#pathfinding #canvas') {
    const canvas = document.querySelector(querySelector);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(canvas.width)
    console.log(canvas.height)
}

let resizeTimer;

window.addEventListener('resize', () => {
    // Falls der Timer läuft, löschen wir ihn (solange der Nutzer zieht)
    clearTimeout(resizeTimer);

    // Erst wenn der Nutzer 200 Millisekunden lang stillhält, wird gezeichnet
    resizeTimer = setTimeout(() => {
        const canvas = document.querySelector('#pathfinding #canvas');

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }, 200); 
});

class PathfindingVisualization {
    /**
     * @param {string} querySelector
     * Node Decleration: name: { "x": 0, "y": 0}
     * Path Decleration: {"node1": "", "node2": "", "cost": 0}
     * 
     */
    constructor(querySelector, nodes = [], paths = []) {
        this.canvas = document.querySelector(querySelector)
        this.ctx = this.canvas.getContext('2d');
        this.nodes = nodes;
        this.paths = paths;

        let resizeTimer;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;

                this.update();
            }, 200); 
        });
    }

    update() {
        this.paths.forEach((path) => {
            console.log(path)
            this.drawLine([this.nodes[path["node1"]]["x"], this.nodes[path["node1"]]["y"]], [this.nodes[path["node2"]]["x"], this.nodes[path["node2"]]["y"]])
        })

        Object.values(this.nodes).forEach((node) => {
            this.drawCircle([node["x"], node["y"]])
        })
    }

    addNodes(newNodes) {
        this.nodes.push(...newNodes);
    }

    addPaths(newPaths) {
        this.paths.push(...newPaths);
    }

    getNodes() {
        return this.nodes;
    }

    getPaths() {
        return this.paths;
    }

    drawLine(pointA = [10, 100], pointB = [100, 100], lineWidth = 4, color = "#dbdbdb") {
        this.ctx.beginPath();
        this.ctx.moveTo(pointA[0], pointA[1]);
        this.ctx.lineTo(pointB[0], pointB[1]);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    }

    drawCircle(position = [200, 200], radius = 20, color = "#3bb7e7") {
        this.ctx.beginPath();
        this.ctx.arc(position[0], position[1], radius, 0, 2 * Math.PI); 
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    dijkstra(nodes, paths, startnode, endnode) {
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

    getConnections(route) {
        let data = []
        for (let i = 0; i < (route.length - 1); i++) {
            data.push([route[i], route[i+1]])
        }
        return data
    }
}

const nodes2 = [
    {"name": "Köln", "x": 300, "y": 100},
    {"name": "Hennef", "x": 300, "y": 200},
    {"name": "Siegburg", "x": 400, "y": 200},
    {"name": "Troisdorf", "x": 300, "y": 300}
]

const nodes3 = {
    "Köln": { "x": 300, "y": 100},
    "Hennef": {"x": 300, "y": 200},
    "Siegburg": {"x": 400, "y": 200},
    "Troisdorf": {"x": 300, "y": 300}
}

const paths2 = [
    {"node1": "Köln", "node2": "Hennef", "cost": 5},
    {"node1": "Köln", "node2": "Siegburg", "cost": 2},
    {"node1": "Siegburg", "node2": "Hennef", "cost": 2},
    {"node1": "Siegburg", "node2": "Troisdorf", "cost":1}
]

const pathfinding = new PathfindingVisualization('#pathfinding #canvas', nodes3, paths2)