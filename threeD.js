import * as THREE from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvasbg")
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(1);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Slight ambient glow
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);

scene.add(pointLight, ambientLight, directionalLight);

const backgroundImg = new THREE.TextureLoader().load("./image.png");
scene.background = backgroundImg;

const allBoxes = [];

function addBox() {
    const geometry = new THREE.BoxGeometry(5,5,5);
    const material = new THREE.MeshStandardMaterial({color: 0xf7f7f7});
    const box = new THREE.Mesh(geometry, material);

    let validPos = false;

    while (!validPos) {
        const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(100));
        
        box.position.set(x, y, z);

        validPos = allBoxes.every(otherBox => {
            const distance = box.position.distanceTo(otherBox.position);
            const minDistance = 6; 
            return distance > minDistance;
        });
    }

    scene.add(box);
    allBoxes.push(box);
}
Array(200).fill().forEach(addBox);



function animate() {
    requestAnimationFrame(animate);
    allBoxes.forEach(box => {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        box.rotation.z += 0.01;
    })
    camera.rotation.x += 0.001;
    camera.rotation.y += 0.001;
    camera.rotation.z += 0.001;
    renderer.render(scene, camera)
}
animate();