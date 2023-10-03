import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Astronaut variables
var travel = 0.01;
var accelX = 0.3
var accelY = 0.2
var accelZ = 0.1
var limitAstroX = 11.0;
var limitAstroY = 7.0;
var limitAstroZ = 5.0;

//Randoms
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor() {
    return '#' + parseInt((Math.random() * 0xFFFFFF)).toString(16).padStart(6, '0');
}

//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

//Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Creation of the astronaut 3D model
var astronaut;
const loader = new GLTFLoader();
loader.load('models/cosmonaut.glb', function (gltf) {
    astronaut = gltf.scene;
    astronaut.scale.set(0.02, 0.02, 0.02);
    scene.add(gltf.scene);
},
    undefined, function (error) {
        console.error(error);
    }
);

//Making the sphere for the astronaut 
const astroGeometry = new THREE.SphereGeometry(3, 7, 3);
const astroMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 });
const astroSphere = new THREE.Mesh(astroGeometry, astroMaterial);
scene.add(astroSphere);

//Making the sky with stars
class sky {
    limiteX = 20.0;
    limiteY = 10.0;
    limiteZ = 1.0;
    constructor(stars) {
        this.stars = stars;

        //Appear randomly
        this.stars.position.x = getRandomArbitrary(-this.limiteX, this.limiteX);
        this.stars.position.y = getRandomArbitrary(-this.limiteY, this.limiteY);
        this.stars.position.z = getRandomArbitrary(-this.limiteZ, this.limiteZ);
    }
}

//Creation the stars
var quantStars = [];
for (var i = 0; i < 100; i++) {
    const starGeometry = new THREE.OctahedronGeometry(0.1, 0);
    var paint = getRandomColor();
    const starMaterial = new THREE.MeshStandardMaterial({ color: paint, wireframe: false });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(star);

    const stars = new sky(star);
    quantStars.push(stars)
}

//Creation the moons
class simulavel {
    limiteX = 6;
    limiteY = 5;
    limiteZ = 10;
    constructor(geometria, velZ) {
        this.geometria = geometria;
        this.velX = 0;
        this.velY = 0;
        this.velZ = velZ;
        this.rotX = getRandomArbitrary(0.01, 0.02);
        this.rotY = getRandomArbitrary(0.01, 0.02);
        this.rotZ = getRandomArbitrary(0.01, 0.02);
        this.geometria.position.x = getRandomArbitrary(-this.limiteX, this.limiteX);
        this.geometria.position.y = getRandomArbitrary(-this.limiteY, this.limiteY);
        this.geometria.position.z = -this.limiteZ;
    }

    simule() {
        this.geometria.rotation.x += this.rotX;
        this.geometria.rotation.y += this.rotY;
        this.geometria.rotation.z += this.rotZ;
        this.geometria.position.x += this.velX;
        this.geometria.position.y += this.velY;
        this.geometria.position.z += this.velZ;

        if (this.geometria.position.x > this.limiteX || this.geometria.position.x < -this.limiteX)
            this.geometria.visible = false;
        if (this.geometria.position.y > this.limiteY || this.geometria.position.y < -this.limiteY)
            this.geometria.visible = false;
        if (this.geometria.position.z > this.limiteZ)
            this.geometria.visible = false;
    }
}

var objetos = [];

for (var i = 0; i < 14; i++) {
    const geometry = new THREE.SphereGeometry(1, 60, 60);
    const moonTexture = new THREE.TextureLoader().load("../images/moon4.jpg");
    const material = new THREE.MeshBasicMaterial();
    material.map = moonTexture;
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const obj1 = new simulavel(cube, getRandomArbitrary(0.01, 0.05));
    objetos.push(obj1)
}

//Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(-1, 0, 0);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x0000ff, 1000, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x0000ff, 0.03);
scene.add(ambientLight);

//Camera position
camera.position.z = 20;

var velX = 0
var velY = 0

var animate = function () {
    requestAnimationFrame(animate);

    for (var i in objetos)
        objetos[i].simule();

    camera.position.y += velY
    camera.position.x += velX

    //Light on the astronaut
    pointLight.position.set(astroSphere.position.x, astroSphere.position.y, astroSphere.position.z);

    //Creating a gravity
    if (astronaut) {
        astronaut.position.x += 0.003;
        astronaut.position.y += 0.003;
        astronaut.position.z += 0.003;

        astronaut.rotation.x += 0.003;
        astronaut.rotation.y += 0.003;
        astronaut.rotation.z += 0.003;
    }

    //Making the astronaut spin
    if (astronaut && astroSphere) {
        astroSphere.position.x = astronaut.position.x;
        astroSphere.position.y = astronaut.position.y;
        astroSphere.position.z = astronaut.position.z;

        if (astronaut.position.x > limitAstroX || astronaut.position.x < -limitAstroX) {
            accelX = -accelX;
        }
        if (astronaut.position.y > limitAstroY || astronaut.position.y < -limitAstroY) {
            accelY = -accelY;
        }
        if (astronaut.position.z > limitAstroZ || astronaut.position.z < -limitAstroZ) {
            accelZ = -accelZ;
        }
    }
    renderer.render(scene, camera);
}

//User interaction
document.onkeydown = function (event) {
    if (event.key == "ArrowUp") {
        astronaut.position.y += accelY;
    }
    else if (event.key == "ArrowDown") {
        astronaut.position.y -= accelY;
    }
    else if (event.key == "ArrowRight") {
        astronaut.position.x += accelX;
    }
    else if (event.key == "ArrowLeft") {
        astronaut.position.x -= accelX;
    }
}

document.onkeyup = function (e) {
    console.log(e)
    if (e.key == "ArrowUp") {
        velY = 0
    }
    else if (e.key == "ArrowDown") {
        velY = 0
    }
    else if (e.key == "ArrowRight") {
        velX = 0
    }
    else if (e.key == "ArrowLeft") {
        velX = 0
    }
}

animate();