import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";

function newBox(params) {
  const geometry = new THREE.BoxBufferGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x44ff44 });
  return new THREE.Mesh(geometry, material);
}

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.scene.background = new THREE.Color(0xbbbbbb);

    this.ambientLight = new THREE.HemisphereLight(0xddeeff, 0x333300, 1);
    this.scene.add(this.ambientLight);

    this.light = new THREE.DirectionalLight();
    this.light.position.set(5, 3, 5);
    this.scene.add(this.light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(this.render.bind(this));

    this.box = newBox();
    this.scene.add(this.box);

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {}

  render() {
    this.box.rotation.y += 0.0175;
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
