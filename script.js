// PROTECT PAGE
if (sessionStorage.getItem("loggedIn") !== "true") {
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
    text: "🌳 My Map",
    children: [],
    collapsed: false
};

function saveTree() {
    localStorage.setItem("memoryTree", JSON.stringify(treeData));
}

// RENDER TREE
function renderTree() {
    const tree = document.getElementById("tree");
    tree.innerHTML = "";
    const ul = document.createElement("ul");
    ul.appendChild(createNode(treeData));
    tree.appendChild(ul);
}

function createNode(node) {
    const li = document.createElement("li");

    const container = document.createElement("div");
    container.className = "node-box";

    const text = document.createElement("span");
    text.innerText = node.text;
    text.className = "node-text";

    const addBtn = createButton("➕", () => addChild(node.id));
    const editBtn = createButton("✏", () => editNode(node.id));
    const deleteBtn = createButton("🗑", () => deleteNode(node.id));
    const toggleBtn = createButton(node.collapsed ? "▶" : "▼", () => toggleNode(node.id));

    container.append(toggleBtn, text, addBtn, editBtn, deleteBtn);
    li.appendChild(container);

    if (!node.collapsed && node.children.length > 0) {
        const ul = document.createElement("ul");
        node.children.forEach(child => {
            ul.appendChild(createNode(child));
        });
        li.appendChild(ul);
    }

    return li;
}

function createButton(label, action) {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.className = "node-btn";
    btn.onclick = action;
    return btn;
}

// CRUD
function addChild(id) {
    const text = prompt("Enter new memory:");
    if (!text) return;

    const parent = findNode(id);
    parent.children.push({
        id: Date.now(),
        text,
        children: [],
        collapsed: false
    });

    saveTree();
    renderTree();
}

function editNode(id) {
    const node = findNode(id);
    const text = prompt("Edit memory:", node.text);
    if (!text) return;

    node.text = text;
    saveTree();
    renderTree();
}

function deleteNode(id) {
    if (id === treeData.id) {
        alert("Cannot delete root node!");
        return;
    }

    const parent = findParent(id);
    parent.children = parent.children.filter(c => c.id !== id);

    saveTree();
    renderTree();
}

function toggleNode(id) {
    const node = findNode(id);
    node.collapsed = !node.collapsed;
    saveTree();
    renderTree();
}

// FIND FUNCTIONS
function findNode(id, node = treeData) {
    if (node.id === id) return node;
    for (let child of node.children) {
        let found = findNode(id, child);
        if (found) return found;
    }
    return null;
}

function findParent(id, node = treeData, parent = null) {
    if (node.id === id) return parent;
    for (let child of node.children) {
        let found = findParent(id, child, node);
        if (found) return found;
    }
    return null;
}

renderTree();
