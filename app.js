// asset by https://sketchfab.com/meerschaumdigital
import "./style.css"
import * as THREE from "./modules/three.module.js";
import { OrbitControls } from "./modules/OrbitControls.js";
import { GLTFLoader } from "./modules/GLTFLoader.js";
// import { RGBELoader } from "./modules/RGBELoader.js";
import { LoadingBar } from "./libs/LoadingBar.js";

function getAspectRatio() {
  return window.innerWidth / window.innerHeight;
}

class OrbitController {
  constructor(scope) {
    const control = new OrbitControls(scope.camera, scope.renderer.domElement);
    control.enablePan = false;
    control.target = new THREE.Vector3(0, 0.1, 0);
    control.update();
    return control;
  }
}

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.camera = new THREE.PerspectiveCamera(60, getAspectRatio(), 0.02, 10);
    this.camera.position.set(0, 0.25, 1.65);

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.scene.background = new THREE.Color(0x100000);

    this.ambientLight = new THREE.HemisphereLight(0xddeeff, 0x333300, 0.1);
    this.scene.add(this.ambientLight);

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(0.3, 0.6, 0.3);
    this.light.target.position.set(0, 0, 0);
    this.light.castShadow = true;
    this.light.shadowCameraVisible = true; // only for debugging
    this.light.shadow.mapSize.width = 1024; // default
    this.light.shadow.mapSize.height = 1024; // default

    this.scene.add(this.light);
    this.scene.add(this.light.target);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    container.appendChild(this.renderer.domElement);
    // this.setEnvironment();

    this.renderer.setAnimationLoop(this.render.bind(this));

    // this.box = newMesh();
    // this.scene.add(this.box);
    this.asset = new THREE.Object3D();

    this.loadingBar = new LoadingBar();

    this.loadGLTF();

    this.control = new OrbitController(this);

    window.addEventListener("resize", this.resize.bind(this));
  }

  // setEnvironment() {
  //   const loader = new RGBELoader().setDataType(THREE.HalfFloatType);
  //   const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
  //   pmremGenerator.compileEquirectangularShader();
  //   const self = this;
  //   loader.load(
  //     "./assets/textures/sandsloot_1k.hdr",
  //     (texture) => {
  //       const envMap = pmremGenerator.fromEquirectangular(texture);
  //       self.scene.environment = envMap;
  //       pmremGenerator.dispose();
  //     },
  //     (xhr) => {},
  //     (err) => {
  //       console.err(err);
  //     }
  //   );
  // }

  loadGLTF() {
    const loader = new GLTFLoader().setPath("/assets/models/");
    loader.load(
      "asset.glb",
      (gltf) => {
        this.scene.add(gltf.scene);
        this.loadingBar.visible = false;
        gltf.scene.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.name === "akwaba_ashanti_fertility") obj.castShadow = true;
            if (obj.name === "rock") obj.receiveShadow = true;
          }
        });
        const bbox = new THREE.Box3().setFromObject(this.scene);
        this.asset = gltf.scene;
      },
      (xhr) => {
        this.loadingBar.progress = xhr.loaded / xhr.total;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  resize() {
    this.camera.aspect = getAspectRatio();
    this.camera.updateProjectionMatrix(); // so as not to distort the render
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.asset.rotation.y += 0.00175;
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
