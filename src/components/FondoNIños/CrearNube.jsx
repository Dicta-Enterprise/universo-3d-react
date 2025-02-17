import * as THREE from 'three';

export default function CrearNube(color = 0xdaddd5){
    const posiciones = [
        [0, 0, -5],  // Primer círculo en el origen
        [2, 1, -5], // Segundo círculo en una posición específica
        [4, 1, -5], // Tercer círculo en otra posición
        [5, 0, -5], // Cuarto círculo
        [4, -1, -5], // Quinto círculo
        [2, -1, -5], // Sexto círculo
    ];

    const nube = new THREE.Group();  // Creamos un grupo para la nube
    
    const material = new THREE.MeshStandardMaterial({
        color: color,  // Color de la nube
        roughness: 0.8,  // Textura rugosa para simular esponjosidad
        metalness: 0.0,  // Sin metalicidad
        opacity: 1,  // Opacidad
        transparent: true,  // Transparente
    });

    // Creamos los círculos y los colocamos en las posiciones que determines
    for (let i = 0; i < 6; i++) {
        const radio = 2;  // Tamaño aleatorio para cada círculo
        const geometria = new THREE.CircleGeometry(radio, 32);
        const circulo = new THREE.Mesh(geometria, material);

        // Si se pasan posiciones, usaremos las que se pasen; de lo contrario, colocaremos en posiciones predeterminadas
        if (posiciones[i]) {
            circulo.position.set(...posiciones[i]);
        }

        // Añadimos el círculo al grupo de la nube
        nube.add(circulo);
    }
    
    // Crear los ojos (circulitos negros)
    const ojoMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.8,
        metalness: 0.0,
        opacity: 1.0,
        transparent: true,
    });

    // Círculo izquierdo
    const ojoIzquierdo = new THREE.CircleGeometry(0.5, 32);
    const ojoIzquierdoMesh = new THREE.Mesh(ojoIzquierdo, ojoMaterial);
    ojoIzquierdoMesh.position.set(1.3, 0.2, -5);  // Posición de ojo izquierdo

    // Círculo derecho
    const ojoDerecho = new THREE.CircleGeometry(0.5, 32);
    const ojoDerechoMesh = new THREE.Mesh(ojoDerecho, ojoMaterial);
    ojoDerechoMesh.position.set(4.3, 0.2, -5);  // Posición de ojo derecho

    const ojoBlancoMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,  // Color blanco para los ojos
        roughness: 0.8,
        metalness: 0.0,
        opacity: 1.0,
        transparent: true,
    });
    
    // Ojo izquierdo blanco
    const ojoIzquierdoBlanco = new THREE.CircleGeometry(0.2, 32);
    const ojoIzquierdoBlancoMesh = new THREE.Mesh(ojoIzquierdoBlanco, ojoBlancoMaterial);
    ojoIzquierdoBlancoMesh.position.set(1.3, 0.1, -5);  // Posición encima del ojo negro izquierdo

    // Ojo derecho blanco
    const ojoDerechoBlanco = new THREE.CircleGeometry(0.2, 32);
    const ojoDerechoBlancoMesh = new THREE.Mesh(ojoDerechoBlanco, ojoBlancoMaterial);
    ojoDerechoBlancoMesh.position.set(4.3, 0.1, -5);  // Posición encima del ojo negro derecho

    // Añadir los ojos blancos y negros al grupo de la nube
    nube.add(ojoIzquierdoMesh);
    nube.add(ojoDerechoMesh);
    nube.add(ojoIzquierdoBlancoMesh);
    nube.add(ojoDerechoBlancoMesh);

    // Crear la boca con una curva
    const puntosBoca = [
        new THREE.Vector3(1.5, -1.5, -4.9),  // Punto izquierdo de la boca
        new THREE.Vector3(3, -0.5, -4.9),   // Punto medio (curvatura)
        new THREE.Vector3(4.5, -1.5, -4.9),   // Punto derecho de la boca
    ];

    // Creamos la curva de la boca utilizando los puntos
    const curvaBoca = new THREE.QuadraticBezierCurve3(...puntosBoca);

    // Crear geometría para la boca
    const geometryBoca = new THREE.BufferGeometry().setFromPoints(curvaBoca.getPoints(50)); // 50 puntos para suavizar la curva

    // Crear el material de la boca
    const materialBoca = new THREE.LineBasicMaterial({
        color: 0x000000,  // Color de la boca (negro)
        linewidth: 3,  // Grosor de la línea
    });

    // Crear la línea de la boca
    const boca = new THREE.Line(geometryBoca, materialBoca);
    
    // Añadir la boca al grupo de la nube
    nube.add(boca);

    // Crear las cejas (formas rectangulares)
    const cejaMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,  // Color de las cejas (negro)
        roughness: 0.8,
        metalness: 0.0,
        opacity: 1.0,
        transparent: true,
    });

    // Cejas
    const cejaGeometry = new THREE.BoxGeometry(2, 0.3, 0.1);  // Forma rectangular para la ceja

    // Cejas izquierda
    const cejaIzquierda = new THREE.Mesh(cejaGeometry, cejaMaterial);
    cejaIzquierda.position.set(1.4, 1.1, -5);  // Posición de la ceja izquierda
    cejaIzquierda.rotation.z = -Math.PI / 10;  // Rotación ligera para que no quede recta
    cejaIzquierda.scale.set(0.5,0.5,0.5);

    // Cejas derecha
    const cejaDerecha = new THREE.Mesh(cejaGeometry, cejaMaterial);
    cejaDerecha.position.set(4, 1.1, -5);  // Posición de la ceja derecha
    cejaDerecha.rotation.z = Math.PI / 10;  // Rotación ligera para que no quede recta
    cejaDerecha.scale.set(0.5,0.5,0.5);

    // Añadir las cejas al grupo de la nube
    nube.add(cejaIzquierda);
    nube.add(cejaDerecha);

        // Animación de las cejas
    let factorCejas = 0;
    const animateCejas = () => {
        // Rotar las cejas para que se pongan rectas
        const angulo = Math.sin(factorCejas * Math.PI) * Math.PI / 10;  // Controla el ángulo de rotación

        cejaIzquierda.rotation.z = -Math.PI / 10 + angulo;  // Rotación de la ceja izquierda
        cejaDerecha.rotation.z = Math.PI / 10 - angulo;  // Rotación de la ceja derecha

        factorCejas += 0.01;  // Incrementar el factor de animación
        if (factorCejas > 2) factorCejas = 0;  // Reiniciar el ciclo

        requestAnimationFrame(animateCejas);  // Continuar la animación
    };

    animateCejas();  // Iniciar la animación de las cejas

    // Función para animar la boca
    let factorAnimacion = 0;  // Factor de animación que varía entre -1 (boca cerrada) y 1 (boca abierta)
    const animateBoca = () => {
        // Modificar la altura de los puntos centrales y laterales
        const desplazamiento = Math.sin(factorAnimacion * Math.PI) * 0.5;

        // Intercambiar los movimientos: 
        puntosBoca[0].y = -1.5 - desplazamiento;
        puntosBoca[2].y = -1.5 - desplazamiento; 
        puntosBoca[1].y = -1.2 + desplazamiento;

        factorAnimacion += 0.01;
        if (factorAnimacion > 2) factorAnimacion = 0;

        // Actualizar la geometría de la boca con los nuevos puntos
        const curvaBoca = new THREE.QuadraticBezierCurve3(...puntosBoca);
        const geometryBoca = new THREE.BufferGeometry().setFromPoints(curvaBoca.getPoints(50));  // Suavizar la curva
        boca.geometry = geometryBoca;

        // Redibujar la boca
        requestAnimationFrame(animateBoca);
    };

    animateBoca();  // Iniciar la animación de la boca

    const crearRayoConPunta = (x, y, escalado) => {
        // Creamos la forma cerrada para el rayo
        const shapeRayo = new THREE.Shape();
    
        // Puntos para crear el zigzag
        shapeRayo.moveTo(x, y);  // Primer punto
        shapeRayo.lineTo(x + 0.5, y);  // Segundo punto
        shapeRayo.lineTo(x + 0.3, y - 0.3);    // Tercer punto
        shapeRayo.lineTo(x + 0.7, y - 0.3);  // Cuarto punto
        shapeRayo.lineTo(x, y - 1);
        shapeRayo.lineTo(x + 0.2, y - 0.5);
        shapeRayo.lineTo(x - 0.2, y - 0.5);
    
        // Cerramos la figura en punta
        shapeRayo.lineTo(x, y);  // Cerrar el contorno hacia el primer punto
    
        // Crear la geometría del rayo con la forma cerrada
        const extrudeSettings = {
            depth: 0.1,  // El grosor del rayo
            bevelEnabled: false,  // No queremos un bisel en los bordes
        };
    
        const geometriaRayo = new THREE.ExtrudeGeometry(shapeRayo, extrudeSettings);  // Corregido 'shape' por 'shapeRayo'
    
        // Material amarillo para el rayo
        const rayoMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd700,  // Color amarillo
            side: THREE.DoubleSide,  // Asegura que se vea el relleno por ambos lados
        });
    
        // Crear el objeto Mesh del rayo
        const rayo = new THREE.Mesh(geometriaRayo, rayoMaterial);
        
        rayo.position.z = -5.1;
        rayo.scale.set(escalado, escalado + 0.6, 1);
        return rayo;
    };
    
    // Ejemplo de creación de rayos
    const rayos = [
        crearRayoConPunta(0, -0.8, 2),
        crearRayoConPunta(1.1, -1.1, 2),
        crearRayoConPunta(2.3, -0.9, 2)
    ];
    
    // Variables de animación
    let factorRayo = 0;

    // Añadir los rayos a la escena
    rayos.forEach(rayo => {
        rayo.visible = true;  // Asegurarse de que los rayos sean visibles
        rayo.material.opacity = 0;
        nube.add(rayo);
    });
    
    const animateRayos = () => {
        rayos.forEach(rayo => {
            // Alternar visibilidad de los rayos en función de la animación
            rayo.visible = Math.sin(factorRayo * Math.PI) > 0;
        });
        factorRayo += 0.01;
        requestAnimationFrame(animateRayos);  // Llamada recursiva para animación continua
    };
    
    animateRayos();  // Iniciar animación de rayos
    
    return nube;
    
}