import * as THREE from "./modules/three.module.js";
import { OrbitControls } from "./modules/OrbitControls.js";
import { GLTFLoader } from "./modules/GLTFLoader.js";

function newBox(params) {
  const geometry = new THREE.BoxBufferGeometry(0.3, 0.005, 0.3);
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getAspectRatio() {
  return window.innerWidth / window.innerHeight;
}

class OrbitController{
  constructor(scope){
    const control = new OrbitControls(scope.camera, scope.renderer.domElement);
    control.enablePan = false;
    control.target = new THREE.Vector3(0,0.1,0);
    control.update();
    return control;
  }
}

class LoadingBar {
  constructor() {}
}

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.camera = new THREE.PerspectiveCamera(60, getAspectRatio(), 0.02, 10);
    this.camera.position.set(0, 0.2, 0.4);

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.scene.background = new THREE.Color(0xbbbbbb);

    this.ambientLight = new THREE.HemisphereLight(0xddeeff, 0x333300, 2);
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

    this.loadingBar = new LoadingBar();
    this.loadGLTF();

    this.control = new OrbitController(this);

    window.addEventListener("resize", this.resize.bind(this));
  }

  loadGLTF() {
    const loader = new GLTFLoader().setPath("./assets/");
    loader.load(
      "african_figurine_game_ready__2k_pbr.glb",
      (gltf) => {
        gltf.scene.position.y = 0.025/2;
        this.box.add(gltf.scene);
      },
      (xhr) => {},
      (err) => {}
    );
  }

  resize() {
    this.camera.aspect = getAspectRatio();
    this.camera.updateProjectionMatrix(); // so as not to distort the render
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.box.rotation.y += 0.00175;
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
