//get our elements

const player=document.querySelector('.player');
const video=player.querySelector('.viewer');
const progress=player.querySelector('.progress');
const progressBar=player.querySelector('.progress__filled');
const toggle=player.querySelector('.toggle');
const skipButtons=player.querySelectorAll('[data-skip]');
const ranges=player.querySelectorAll('.player__slider');
const Volume=player.querySelector('#vloume');
// build out functions

function togglePlay(){

    if(video.paused){
        video.play();
    }
    else{
        video.pause();
    }
}

function updateButton(){
    const icon=this.paused ? '►' : '❚ ❚';
    toggle.textContent=icon;
}

function skip(){
    video.currentTime+=parseFloat(this.dataset.skip);
}

function handleRangeUpdate(){
video[this.name]=this.value;
console.log(this.name,this.value)
}
function getVolume() { 
    alert(video.volume);
  } 
    
  function increaseVolume(){
    if(video.volume<=.90){ 
    video.volume+=.10;
    }
  } 
    
  function decreaseVolume(){ 
    if(video.volume>=.10){ 
        video.volume-=.10;
    }
  } 

function handleProgress(){
    const percent=(video.currentTime/video.duration)*100;
    progressBar.style.flexBasis=`${percent}%`;
}

function scrub(e){
    const scrubTime=(e.offsetX/progress.offsetWidth)*video.duration;
    video.currentTime=scrubTime;
}

video.addEventListener('click',togglePlay);
video.addEventListener('play',updateButton);
video.addEventListener('pause',updateButton);
video.addEventListener('timeupdate',handleProgress);
toggle.addEventListener('click',togglePlay);
skipButtons.forEach(button=>button.addEventListener('click',skip));
ranges.forEach(range=>range.addEventListener('change',handleRangeUpdate));
ranges.forEach(range=>range.addEventListener('mousemove',handleRangeUpdate));
let mousedown=false;
progress.addEventListener('click',scrub);
progress.addEventListener('mousemove',(e)=>mousedown && scrub(e));
progress.addEventListener('mousedown',()=>mousedown=true);
progress.addEventListener('mouseup',()=>mousedown=false);



window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
// recognition.lang = 'en-US';

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {
    const transcript=Array.from(e.results)
        .map(result=>result[0])
        .map(result=>result.transcript)
        .join('');

        // for play voice command
        if(transcript==='play'){
            video.play();
            updateButton();
        }
        // for pause voice command
        else if(transcript==="pause"){
            video.pause();
            updateButton();
        }
        // for fastforward
        else if(transcript==="forward"){
            video.currentTime+=10;
        }
        // for going back
        else if(transcript==="back"){
            video.currentTime+=-10;
        }
        else if(transcript==="increase"){
           increaseVolume();
        }
        else if(transcript==="decrease"){
            decreaseVolume();
        }
    console.log(transcript);
});
recognition.addEventListener('end',recognition.start);
recognition.start();