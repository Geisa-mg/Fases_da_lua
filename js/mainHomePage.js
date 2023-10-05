//Variables
let starGeometry, stars;

//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;
camera.rotation.x = Math.PI/2;

//Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Making the sky with stars animation
starGeometry = new THREE.Geometry();
for (let i = 0; i < 6000; i++) {
    star = new THREE.Vector3(
        Math.random() * 600 - 300, 
        Math.random() * 600 - 300, 
        Math.random() * 600 - 300);
    
        star.vel = 0;
        star.accel = 0.02;
        starGeometry.vertices.push(star);
}

let starTexture = new THREE.TextureLoader().load('images/star.png');
let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: starTexture
});

stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

function animate() {
    //Making the animation of the stars "arrive" on the screen
    starGeometry.vertices.forEach(starPoint => {
        starPoint.vel += starPoint.accel;
        starPoint.y -= starPoint.vel;
        if(starPoint.y <-200){
            starPoint.y = 200;
            starPoint.vel = 0;
        }
    });

    starGeometry.verticesNeedUpdate = true;
    stars.rotation.y += 0.002;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();