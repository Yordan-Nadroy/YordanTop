document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formacion-form');
    
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const nombre = form.nombre.value;
            const correo = form.correo.value;
            const curso = form.curso.value;
            const fecha = form.fecha.value;
            
            fetch('/planificar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `nombre=${nombre}&correo=${correo}&curso=${curso}&fecha=${fecha}`
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
                form.reset();
                location.reload(); // Recargar la página para mostrar los nuevos datos
            })
            .catch(error => {
                alert('Ocurrió un error al guardar los datos.');
                console.error(error);
            });
        });
    }

    const datosTable = document.getElementById('datos-table');
    
    if (datosTable) {
        fetch('/datos')
            .then(response => response.json())
            .then(datos => {
                datos.forEach((dato, index) => {
                    const row = document.createElement('tr');
                    
                    const nombreCell = document.createElement('td');
                    nombreCell.textContent = dato.nombre;
                    
                    const cursoCell = document.createElement('td');
                    cursoCell.textContent = dato.curso;
                    
                    const fechaCell = document.createElement('td');
                    fechaCell.textContent = dato.fecha;

                    const accionesCell = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.addEventListener('click', () => {
                        fetch(`/eliminar/${index}`, { method: 'DELETE' })
                            .then(response => response.text())
                            .then(data => {
                                alert(data);
                                location.reload(); // Recargar la página para reflejar los cambios
                            })
                            .catch(error => {
                                alert('Ocurrió un error al eliminar los datos.');
                                console.error(error);
                            });
                    });

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.addEventListener('click', () => {
                        const newName = prompt('Nuevo nombre:', dato.nombre);
                        const newCourse = prompt('Nuevo curso:', dato.curso);
                        const newDate = prompt('Nueva fecha:', dato.fecha);

                        if (newName && newCourse && newDate) {
                            fetch(`/editar/${index}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: `nombre=${newName}&curso=${newCourse}&fecha=${newDate}`
                            })
                            .then(response => response.text())
                            .then(data => {
                                alert(data);
                                location.reload(); // Recargar la página para reflejar los cambios
                            })
                            .catch(error => {
                                alert('Ocurrió un error al editar los datos.');
                                console.error(error);
                            });
                        }
                    });

                    accionesCell.appendChild(deleteButton);
                    accionesCell.appendChild(editButton);
                    
                    row.appendChild(nombreCell);
                    row.appendChild(cursoCell);
                    row.appendChild(fechaCell);
                    row.appendChild(accionesCell);
                    
                    datosTable.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
            });
    }

    const reportesContainer = document.getElementById('reportes-container');

    if (reportesContainer) {
        fetch('/reportes')
            .then(response => response.json())
            .then(reporte => {
                const totalEmpleados = document.createElement('p');
                totalEmpleados.textContent = `Total de empleados: ${reporte.totalEmpleados}`;
                reportesContainer.appendChild(totalEmpleados);

                const cursos = document.createElement('ul');
                for (const curso in reporte.cursos) {
                    const item = document.createElement('li');
                    item.textContent = `${curso}: ${reporte.cursos[curso]} empleados`;
                    cursos.appendChild(item);
                }
                reportesContainer.appendChild(cursos);
            })
            .catch(error => {
                console.error('Error al generar el reporte:', error);
            });
    }

    // Lógica para renderizar el gráfico de progreso
    const progresoChartElement = document.getElementById('progresoChart');
    
    if (progresoChartElement) {
        fetch('/seguimiento/data')
            .then(response => response.json())
            .then(data => {
                const ctx = progresoChartElement.getContext('2d');
                const progresoChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.empleados.map(emp => emp.nombre),
                        datasets: [{
                            label: 'Progreso',
                            data: data.empleados.map(emp => emp.progreso),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error al cargar los datos de progreso:', error);
            });
    }
});

const ctx = document.getElementById('chart').getContext('2d');

const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Usuario 1', 'Usuario 2', 'Usuario 3'], // Reemplaza con datos dinámicos
        datasets: [{
            label: 'Formaciones completadas',
            data: [12, 19, 3], // Reemplaza con datos dinámicos
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
