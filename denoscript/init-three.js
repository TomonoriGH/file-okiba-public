// init-three.ts

const filecontents = {}
filecontents["index.html"] = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Three.js Cube</title>
    <style>body { margin: 0; overflow: hidden; }</style>
</head>
<body>
    <script type="module" src="script.js">
    </script>
</body>
</html>`;

filecontents["script.js"] = `import * as THREE from 'https://esm.sh/three@0.165.0';
import { OrbitControls } from 'https://esm.sh/three@0.165.0/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
}
animate();`;

// カレントディレクトリに index.html を書き出す
for(const [fn,content] of Object.entries(filecontents)){
    try {
        await Deno.stat(fn);
        // 存在した場合はエラーを投げて処理を中断
        console.error(`❌ エラー: ${fn} は既に存在します。上書きを避けるため終了します。`);
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            // ファイルが存在しない（NotFound）場合のみ書き込み実行
            await Deno.writeTextFile(fn, content);
            console.log(`✅ ${fn} を作成しました！`);
        } else {
            // それ以外の予期せぬエラー（権限不足など）
            throw error;
        }
    }
}
