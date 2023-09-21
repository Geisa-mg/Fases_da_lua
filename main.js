import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

//Creation of the moon and change of material
const geometry = new THREE.SphereGeometry(2, 60, 60);
const moonTexture = new THREE.TextureLoader().load("images/moon_map.jpg");
const material = new THREE.MeshPhongMaterial();
material.map = moonTexture;
const moon = new THREE.Mesh(geometry, material);
scene.add(moon);

//Creation of the astronaut
var astronaut;
const loader = new GLTFLoader();
loader.load('models/cosmonaut.glb',
    function (gltf) {
        astronaut = gltf.scene;
        astronaut.position.set(0, -100, -1000);
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

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
    const geometry2 = new THREE.OctahedronGeometry(0.1, 0);
    var paint = getRandomColor();
    const material2 = new THREE.MeshStandardMaterial({ color: paint, wireframe: false });
    const star = new THREE.Mesh(geometry2, material2);
    scene.add(star);

    const obj1 = new sky(star);
    quantStars.push(obj1)
}

//Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(-1, 0, 0);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 10000, 10000);
pointLight.position.set(150, 100, -900);
scene.add(pointLight);


//Camera position
camera.position.z = 20;

//Boundary variables and speed
var velX = 0.01;
var velY = 0.07;
var limitMaxX = 10.0;
var limitMinX = -10.0;
var limitMaxY = 15.0;
var limitMinY = -15.0;
var vel = 0.11;
var passo = 0;
var i = 0;
var astronaut = 0;
var angulo = 0;

function animate() {
    requestAnimationFrame(animate);
    //Starting the moon on the left
    moon.position.x = -15 * (Math.cos(passo));
    moon.position.y = 6 * Math.sin(passo);

    //Limiting the area of the moon (arc)
    if (moon.position.x > limitMaxX || moon.position.x < limitMinX) {
        velX = -velX;
    }

    if (moon.position.y > limitMaxY || moon.position.y < limitMinY) {
        velY = -velY;
    }

    renderer.render(scene, camera);
}

animate();

//User interaction
document.onkeydown = function (event) {
    console.log(event);
    if (event.key == "ArrowRight") {
        passo += vel;
    }
}

document.onkeyup = function (event) {
    console.log(event);
    if (event.key == " ") {

    }
}
