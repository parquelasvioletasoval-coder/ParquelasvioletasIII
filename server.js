const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('avance.db');

// Crear tabla si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    torre TEXT,
    departamento INTEGER,
    tarea TEXT,
    resuelto INTEGER DEFAULT 0
  )`);
});

// Obtener tareas
app.get('/api/tareas', (req, res) => {
  db.all(`SELECT * FROM tareas`, [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

// Actualizar tarea
app.post('/api/tareas', (req, res) => {
  const { id, resuelto } = req.body;
  db.run(`UPDATE tareas SET resuelto = ? WHERE id = ?`, [resuelto ? 1 : 0, id], function(err){
    if(err) res.status(500).send(err);
    else res.json({ success: true });
  });
});

// Inicializar tareas si no hay datos
app.get('/api/init', (req, res) => {
  db.get(`SELECT COUNT(*) as count FROM tareas`, [], (err, row) => {
    if (row.count > 0) return res.json({ success: true });

    const torres = {
      "1": 30, "2": 20, "3": 30, "4": 30, "5": 30,
      "6": 30, "7": 30, "8": 30, "9": 20,
      "10": 30, "11": 30, "12": 30, "13": 30, "14": 30, "15": 30
    };

    const tareas = [
      "Limpieza y Reparación fisuras OG",
      "Descarachado y pulido Departamento",
      "Descarachado y pulido baño y cocina",
      "Trazado Barandas",
      "Instalación barandas departamentos",
      "Rectificación de centros",
      "Remates Húmedos Baño y Cocina",
      "Yeso en recinto húmedos",
      "Rasgos de puertas y ventanas",
      "Trazado pasa buques",
      "Moldaje pasa buque",
      "Hormigonado pasa buque",
      "Trazado Tabiques",
      "Descargas sanitarias sector baños",
      "Descargas sanitarias sector logia",
      "Distribución agua potable logia y cocina",
      "Estructurado de tabiques",
      "Tabique primera cara",
      "Distribución agua potable baños",
      "Distribución eléctricas en tabiques",
      "Enlauchado eléctrico",
      "EIFS en rasgo de ventanas",
      "Segunda Cara",
      "Pasta en cielo y muro",
      "Primera mano pintura",
      "Estructuración soporte tina",
      "Impermeabilización baños y cocinas",
      "Impermeabilización terrazas",
      "Instalación de tinas",
      "Nivelación piso logia y terraza",
      "Instalación cerámicas piso",
      "Instalación cerámicas muros",
      "Instalación de Guardapolvos recintos húmedos",
      "Fragüe ceramicos piso y muro",
      "Instalación guardapolvos mdf",
      "Instalación de cornisas",
      "Instalación artefactos sanitarios",
      "Instalación de alfeizar",
      "Instalar ventanas",
      "Instalación de marcos",
      "Instalación de puertas",
      "Instalación topes de puertas",
      "Instalación de mueble lavaplatos",
      "Instalación de quincallería",
      "Pintura esmalte sintetico barandas",
      "Instalación cenefas",
      "Instalación Celosias metalicas",
      "Ejecución alambrado electricos departamentos",
      "Instalación artefactos electricos",
      "Instalación griferías",
      "Pintado logia",
      "Pintura texturizado logia",
      "Instalación de tubería de gas",
      "Instalación de nicho de gas",
      "Instalación Calefón",
      "Instalación atril lavadero",
      "Instalación lavadero",
      "Pintura terraza",
      "Pintura texturizado terraza",
      "Segunda mano pintura recintos húmedos",
      "Ejecución cortagotera",
      "Sellos elementos estructurales",
      "Aseo Final"
    ];

    // Insertar todas las tareas
    for (const torre in torres) {
      for (let dep = 1; dep <= torres[torre]; dep++) {
        for (const tarea of tareas) {
          db.run(`INSERT INTO tareas (torre, departamento, tarea) VALUES (?, ?, ?)`, [torre, dep, tarea]);
        }
      }
    }
    res.json({ success: true });
  });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
