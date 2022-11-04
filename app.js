import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js";
import { convertArray } from "three/src/animation/AnimationUtils.js";

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);
    window.addEventListener("resize", this.resize.bind(this));    
  }

  resize() {}

  render() {}
}

export { App };
