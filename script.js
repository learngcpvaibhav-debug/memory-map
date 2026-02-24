// PROTECT PAGE
if(sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

// LOGOUT
function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

// TREE DATA
let treeData = JSON.parse(localStorage.getItem("memoryTree")) || {
    id: 1,
    text: "🌟 My Dreams",
    color: randomColor(),
    children: []
};

function saveTree() {
    localStorage.setItem("memoryTree", JSON.stringify(treeData));
}

// RANDOM COLOR
function randomColor() {
    const colors = ["#ff6f61","#6a5acd","#20b2aa","#ff9800","#9c27b0","#4caf50"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// RENDER TREE
function renderTree() {
    const tree = document.getElementById("tree");
    tree.innerHTML = "";
    tree.appendChild(createNode(treeData));
}

function createNode(node) {
    const li = document.createElement("li");

    const div = document.createElement("div");
    div.className = "node";
    div.style.background = node.color;
    div.draggable = true;
    div.innerText = node.text;

    div.onclick = () => editNode(node.id);
    div.ondblclick = () => addChild(node.id);

    div.ondragstart = (e) => {
        e.dataTransfer.setData("id", node.id);
    };

    div.ondragover = (e) => e.preventDefault();

    div.ondrop = (e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("id");
        moveNode(draggedId, node.id);
    };

    li.appendChild(div);

    if(node.children.length > 0) {
        const ul = document.createElement("ul");
        node.children.forEach(child => {
            ul.appendChild(createNode(child));
        });
        li.appendChild(ul);
    }

    return li;
}

// CRUD
function addChild(id) {
    const text = prompt("Enter memory (add emoji too! 😊)");
    if(!text) return;

    const parent = findNode(id);
    parent.children.push({
        id: Date.now(),
        text,
        color: randomColor(),
        children: []
    });

    saveTree();
    renderTree();
}

function editNode(id) {
    const node = findNode(id);
    const text = prompt("Edit or type DELETE to remove:", node.text);
    if(!text) return;

    if(text === "DELETE") {
        deleteNode(id);
        return;
    }

    node.text = text;
    saveTree();
    renderTree();
}

function deleteNode(id) {
    if(id == treeData.id) return alert("Cannot delete root!");

    const parent = findParent(id);
    parent.children = parent.children.filter(c => c.id != id);
    saveTree();
    renderTree();
}

// MOVE NODE (Drag Drop)
function moveNode(dragId, dropId) {
    if(dragId == treeData.id) return;

    const dragged = findNode(parseInt(dragId));
    const oldParent = findParent(parseInt(dragId));
    oldParent.children = oldParent.children.filter(c => c.id != dragId);

    const newParent = findNode(parseInt(dropId));
    newParent.children.push(dragged);

    saveTree();
    renderTree();
}

// FIND FUNCTIONS
function findNode(id, node = treeData) {
    if(node.id == id) return node;
    for(let child of node.children) {
        let found = findNode(id, child);
        if(found) return found;
    }
    return null;
}

function findParent(id, node = treeData, parent = null) {
    if(node.id == id) return parent;
    for(let child of node.children) {
        let found = findParent(id, child, node);
        if(found) return found;
    }
    return null;
}

// EXPORT
function exportTree() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(treeData));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "memory-map.json";
    a.click();
}

// IMPORT
document.getElementById("importFile")?.addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        treeData = JSON.parse(event.target.result);
        saveTree();
        renderTree();
    };
    reader.readAsText(e.target.files[0]);
});

renderTree();
