const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

 const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor( 0xb7c3f3, 1 );

 const light = new THREE.AmbientLight( 0xffffff );
 scene.add( light );

 //global variables
 const start_position = 6.8
 const end_position = -start_position
 const text = document.querySelector(".text")
 const TIME_LIMIT = 13
 let gameStat = "loading"
 let isLookingBackward = true


function createCube(size, positionx, roty = 0, color = 0x00ffff ){
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = positionx;
    cube.rotation.y = roty;
    scene.add( cube );
    return cube;
}

camera.position.z = 5; 

const loader = new THREE.GLTFLoader();

function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

 class Doll{
    constructor(){
        loader.load("../model/scene.gltf", (gltf) => {
            scene.add( gltf.scene );
            gltf.scene.scale.set(.9, .9, .9 );
            gltf.scene.position.set(0, -1, 0);
            this.doll = gltf.scene;
        });

    }

    lookBackward(){
        gsap.to(this.doll.rotation, {y: -3.15, duration: .45})
        setTimeout(() => isLookingBackward = true, 150)
    }

    lookForward(){
        gsap.to(this.doll.rotation, {y: 0, duration: .45})
        setTimeout(() => isLookingBackward = false, 450)
    }

   async start(){
        this.lookBackward()
        await delay((Math.random() * 1000) + 1000)
        this.lookForward()
        await delay((Math.random() * 750) + 750)
        this.start()
    }
 }


  function createTrack(){ 
    createCube( {w: start_position * 2 + .2, h: 1.5, d: .1}, 0, 0, 0x00ffff).position.z = -.1;
    createCube( {w: .2, h: 1.5, d: .1}, start_position, -.99,0xee82ee )
    createCube( {w: .2, h: 1.5, d: .1}, end_position, .99, 0xee82ee)
   
}
createTrack();

class Player{
    constructor(){
        const geometry = new THREE.SphereGeometry( .2, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xdc143c } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = .2
        sphere.position.x = start_position
        scene.add( sphere );
        this.player = sphere
        this.playerInfo = {
            positionX: start_position,
            velocity: 0
        }
    }

    run(){
        this.playerInfo.velocity = .03
    }

    stop(){
       gsap.to(this.playerInfo, {velocity: 0, duration: .2})
    }

    check(){
        if(this.playerInfo.velocity > 0 && !isLookingBackward){
            text.innerText = "You Lost"
            gameStat = "Over"
        } 
        if(this.playerInfo.positionX < end_position + .25){
        text.innerText = "You Win"
        gameStat = "Over"
    }
    }

    update(){
        this.check()
        this.playerInfo.positionX -= this.playerInfo.velocity
        this.player.position.x = this.playerInfo.positionX
    }
   
}
 
const player = new Player()

let doll = new Doll()

async function init(){
    await delay(600) 
    text.innerText = "Starting in 3"
    await delay(600) 
    text.innerText = "Starting in 2"
    await delay(600) 
    text.innerText = "Starting in 1"
    await delay(600) 
    text.innerText = "Gooo!!!"
    startGame()
}

function startGame(){
    gameStat = "started"
    let progressBar = createCube({w: 5, h: .1, d: 1}, 0)
    progressBar.position.y = 3.35
    gsap.to(progressBar.scale, {x: 0, duration: TIME_LIMIT, ease: "none"})
    doll.start()
    setTimeout(() => {
        if(gameStat != "0ver"){
            text.innerText = "Time Over"
            gameStat = "Over"
        }
    }, TIME_LIMIT * 1000);
        
}

init()


function animate() {
    if(gameStat == "Over") return
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    player.update()
};

animate();



 window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){

     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight);

}

window.addEventListener('keydown', (e) => {
    if(gameStat != "started") return
    if(e.key == "ArrowUp"){
        player.run()
    }
})


window.addEventListener('keyup', (e) => {
    if(e.key == "ArrowUp"){
        player.stop()
    }
})