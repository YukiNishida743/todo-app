function formatDateTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0始まりなので+1
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) {
        alert('タスクを入力してください！');
        return;
    }
    if (text.length > 100) {
        alert('タスクは100文字以内にしてください！');
        return;
    }
    const highPriorityKeywords = ['テスト', '締切', '会議', 'レポート', '試験', '提出'];
    const priority = highPriorityKeywords.some(keyword => text.toLowerCase().includes(keyword)) ? 'High' : 'Low';
    const task = {
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false,
        createdAt: formatDateTime(new Date())
    };
    saveTask(task);
    renderTask(task);
    input.value = '';
}
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTask(task) {
    const list = document.getElementById('taskList');
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <span class="${task.completed ? 'completed' : ''} ${task.priority === 'High' ? 'high-priority' : ''}">${task.text} (${task.priority})</span>
        <span class="date-time">${task.createdAt}</span>
        <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(li);
}
function toggleTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTasks();
}
function deleteTask(id) {
    const li = document.querySelector(`li[data-id="${id}"]`);
    li.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        let tasks = JSON.parse(localStorage.getItem('tasks')).filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        refreshTasks();
    }, 300); // アニメーション0.3秒後に削除
}
function refreshTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    try {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const filter = document.getElementById('filterTasks').value;
        if (filter === 'high') {
            tasks = tasks.filter(task => task.priority === 'High');
        } else if (filter === 'completed') {
            tasks = tasks.filter(task => task.completed);
        }
        tasks.forEach(task => renderTask(task));
    } catch (e) {
        console.error('LocalStorageエラー:', e);
        localStorage.setItem('tasks', JSON.stringify([]));
    }
}
document.getElementById('filterTasks').addEventListener('change', refreshTasks);
document.querySelector('button').addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', refreshTasks);
document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
document.getElementById('toggleTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    refreshTasks();
});
