
let tareasData = [];

async function init() {
  // Inicializar base de datos
  await fetch('/api/init');

  // Cargar tareas
  const res = await fetch('/api/tareas');
  tareasData = await res.json();

  renderizar();
}

function renderizar() {
  const cont = document.getElementById('contenedor');
  cont.innerHTML = '';

  const torres = [...new Set(tareasData.map(t => t.torre))];

  torres.forEach(torre => {
    const divTorre = document.createElement('div');
    divTorre.className = 'torre';
    divTorre.innerHTML = `<h2>Torre ${torre}</h2>`;

    const deps = [...new Set(tareasData.filter(t => t.torre === torre).map(t => t.departamento))];

    deps.forEach(dep => {
      const divDep = document.createElement('div');
      divDep.className = 'departamento';
      divDep.innerHTML = `<h3>Departamento ${dep}</h3>`;

      const tareas = tareasData.filter(t => t.torre === torre && t.departamento === dep);

      tareas.forEach(tarea => {
        const divTarea = document.createElement('div');
        divTarea.className = 'tarea';
        divTarea.innerHTML = `<input type="checkbox" data-id="${tarea.id}" ${tarea.resuelto ? 'checked' : ''}>${tarea.tarea}`;
        divDep.appendChild(divTarea);
      });

      const btn = document.createElement('button');
      btn.textContent = 'Marcar todo resuelto';
      btn.onclick = () => marcarTodo(dep, torre);
      divDep.appendChild(btn);

      divTorre.appendChild(divDep);
    });

    cont.appendChild(divTorre);
  });

  actualizarProgreso();
  // Escuchar cambios en checkboxes
  document.querySelectorAll('.tarea input').forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      const id = e.target.dataset.id;
      const resuelto = e.target.checked;
      await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resuelto })
      });
      const tarea = tareasData.find(t => t.id == id);
      tarea.resuelto = resuelto;
      actualizarProgreso();
    });
  });
}

function actualizarProgreso() {
  const total = tareasData.length;
  const resueltas = tareasData.filter(t => t.resuelto).length;
  const porcentaje = Math.round((resueltas / total) * 100);
  document.getElementById('porcentaje').textContent = porcentaje;
  document.getElementById('barra').value = porcentaje;
}

function marcarTodo(dep, torre) {
  tareasData.forEach(t => {
    if (t.departamento == dep && t.torre == torre) t.resuelto = true;
  });
  // Guardar cambios
  tareasData.filter(t => t.departamento == dep && t.torre == torre).forEach(async t => {
    await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: t.id, resuelto: true })
    });
  });
  renderizar();
}

init();
