/**
 * init-three.js
 * * 使い方:
 * deno install -A -n init-three init-three.js
 * init-three
 */

async function initThree() {
  const filecontents = {};

  // --- 質問セクション ---

  console.log("%c--- Three.js Project Initializer ---", "color: cyan; font-weight: bold");

  // 1. 背景色の選択
  let bgColor = "0x444444";
  console.log("\nQ: 背景色を選択してください:");
  console.log(" 1: gray (#444444)");
  console.log(" 2: white (#ffffff)");
  console.log(" 3: black (#000000)");
  console.log(" 4: custom (16進数)");
  const bgChoice = prompt("選択 (1-4):", "1");

  if (bgChoice === "2") bgColor = "0xffffff";
  else if (bgChoice === "3") bgColor = "0x000000";
  else if (bgChoice === "4") {
    const custom = prompt("カラーコードを入力 (例: ffff00):", "ffff00");
    bgColor = `0x${custom}`;
  }

  // 2. Fogの追加
  const addFog = confirm("Q: Fog（霧）を追加しますか？");

  // 3. Cubeの追加
  const addCube = confirm("Q: 中央にCube（立方体）を追加しますか？");

  // 4. GridHelperの追加
  const addGrid = confirm("Q: GridHelper（地面のグリッド）を追加しますか？");

  // 5. ArrowAxesの追加
  const addAxes = confirm("Q: ArrowAxes（自作の座標軸）を追加しますか？");

  // --- script.js の組み立て ---

  let scriptJs = `import * as THREE from 'https://esm.sh/three@0.165.0';
import { OrbitControls } from 'https://esm.sh/three@0.165.0/addons/controls/OrbitControls.js';\n`;

  if (addAxes) {
    scriptJs += `import { createArrowAxes } from 'https://esm.sh/gh/tomonorigh/file-okiba-public@78502d3/threemod/ArrowAxes.js';\n`;
  }

  scriptJs += `
const scene = new THREE.Scene();
scene.background = new THREE.Color(${bgColor});
`;

  if (addFog) {
    scriptJs += `scene.fog = new THREE.Fog(${bgColor}, 1, 50);\n`;
  }

  scriptJs += `
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
`;

  if (addCube) {
    scriptJs += `\nconst cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
scene.add(cube);\n`;
  }

  if (addGrid) {
    scriptJs += `\nconst gridHelper = new THREE.GridHelper(20, 20, 0xffffff, 0x888888);
scene.add(gridHelper);\n`;
  }

  if (addAxes) {
    scriptJs += `\nconst arrowAxes = createArrowAxes(5);
scene.add(arrowAxes);\n`;
  }

  scriptJs += `
function animate() {
    requestAnimationFrame(animate);
    if (scene.children.find(c => c.type === "Mesh")) {
        // Cubeが存在する場合のみ少し回転させるなどの処理をここに追加可能
    }
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
`;

  filecontents["script.js"] = scriptJs;

  // --- index.html の作成 ---
  filecontents["index.html"] = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Three.js Scene</title>
    <style>body { margin: 0; overflow: hidden; background: #000; }</style>
</head>
<body>
    <script type="module" src="script.js"></script>
</body>
</html>`;

  // --- ファイル書き出しロジック ---
  console.log("\n--- ファイルを生成中 ---");
  for (const [fn, content] of Object.entries(filecontents)) {
    try {
      await Deno.stat(fn);
      console.error(`❌ エラー: ${fn} は既に存在します。中断しました。`);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        await Deno.writeTextFile(fn, content);
        console.log(`✅ ${fn} を作成しました。`);
      } else {
        throw error;
      }
    }
  }
}

// 実行
initThree();
