import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Moon variables
var velX = 0.01;
var velY = 0.07;
var limitX = 10.0;
var limitY = 15.0;
var vel = 0.11;
var angle = 0;

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

//Audio

//Creation of the moon and change of material
const moonGeometry = new THREE.SphereGeometry(2, 60, 60);
const moonTexture = new THREE.TextureLoader().load("images/moon_map.jpg");
const moonMaterial = new THREE.MeshPhongMaterial();
moonMaterial.map = moonTexture;
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

//Creation of the astronaut 3D model
var astronaut;
const loader = new GLTFLoader();
loader.load('models/cosmonaut.glb',
    function (gltf) {
        astronaut = gltf.scene;
        astronaut.scale.set(0.02, 0.02, 0.02);
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

//Making the sphere for the astronaut //3,7,3
const astroGeometry = new THREE.SphereGeometry(5, 7, 5);
const astroMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: false, opacity: 0.0, wireframe: true });
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

//Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(-1, 0, 0);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 10000, 10000);
pointLight.position.set(150, 100, -900);
scene.add(pointLight);

//Collision
function foiAtingido() {
    var deltaX = moon.position.x - astroSphere.position.x;
    console.log(deltaX);
    var deltaY = moon.position.y - astroSphere.position.y;
    var deltaZ = moon.position.z - astroSphere.position.z;
    var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    if (moon.position.x < astroSphere.position.x || moon.position.x < astroSphere.position.x) {
        return false;
    } else if (moon.position.y < astroSphere.position.y || moon.position.y < astroSphere.position.y) {
        return false;
    } else if (moon.position.z < astroSphere.position.z || moon.position.z < astroSphere.position.z) {
        return false;
    } else {
        return true;
    }
}

//Camera position
camera.position.z = 20;

var animate = function () {
    requestAnimationFrame(animate);

    //Starting the moon on the left
    moon.position.x = -15 * (Math.cos(angle));
    moon.position.y = 6 * Math.sin(angle);

    //Limiting the area of the moon (arc)
    if (moon.position.x > limitX || moon.position.x < -limitX) {
        velX = -velX;
    }
    if (moon.position.y > limitY || moon.position.y < -limitY) {
        velY = -velY;
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
    if (event.key == "ArrowRight") {
        angle += vel;
    }

    if (event.key == ' ') {
        astronaut.position.x += accelX;
        astronaut.position.y += accelY;
        astronaut.position.z += accelZ;

        astronaut.rotation.x += travel;
        astronaut.rotation.y += travel;
        astronaut.rotation.z += travel;

        astroSphere.rotation.x = astronaut.rotation.x;
        astroSphere.rotation.y = astronaut.rotation.y;
        astroSphere.rotation.z = astronaut.rotation.z;
    }

    if (astroSphere != null && foiAtingido()) {
        //moon.position.set(0, 0, 0);
        console.log("Foi atingido, iei")
    }
}

document.onkeyup = function (event) {
    if (event.key == ' ') {
        astronaut.position.x = astronaut.position.x;
        astronaut.position.y = astronaut.position.y;
        astronaut.position.z = astronaut.position.z;
    }
}

animate();
