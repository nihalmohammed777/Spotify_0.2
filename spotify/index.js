let currentsong= new Audio()

let songs;

function secoundstominutes(secounds){
  if(isNaN(secounds)||secounds<0){
    return "00:00"
  }
  const minutes=Math.floor(secounds/60)
  const remainingseconds=Math.floor(secounds % 60);
  const formattedminutes =String(minutes).padStart(2,'0')
  const formattedsecounds=String(remainingseconds).padStart(2,"0")
  return `${formattedminutes}:${formattedsecounds}`
}

async function getsongs() {
  let music = await fetch("http://127.0.0.1:5501/songs/");
  let response = await music.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let data = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      data.push(element.href);
    }
  }
  // console.log(data);
  return data;
}

function playmusic(music,pause=false) {
  // let audio=new Audio("./songs/"+music+".mp3")
  currentsong.src="./songs/"+music+".mp3"
  if(!pause){
    currentsong.play()
  play.src="./svgs/pause.svg"
  }
  // currentsong.play()
  document.querySelector(".songinfo").innerHTML=decodeURI(music)
  document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}



async function main() {
 songs = await getsongs();
  // console.log(songs);
  playmusic(songs[0].split('/').pop().split('.')[0],true)

  for (const song of songs) {
    let ol = document.querySelector(".songList ol");
    let li = document.createElement("li");
    ol.append(li);
    let songname = song.split("/songs/")[1].split(".mp3")[0];
    li.innerHTML=`
    <img src="./svgs/music.svg" alt="" srcset="">
    <div class="info">
      <div>${songname}</div>
      
    </div>
    <div class="playnow">
      <span>Play Now</span>
      <img src="./svgs/play.svg" alt="" srcset="">
    </div>`
  }

  // ---------------------------------------------------------------

  document.querySelectorAll(".songList ol li").forEach((value,index)=>{
    value.addEventListener("click",(e)=>{
      console.log(value.querySelector(".info").textContent);
      playmusic(value.querySelector(".info").textContent.trim())
    })
    })

// ---------------------------------------------------------------------------
play.addEventListener("click",()=>{
  if (currentsong.paused) {
    currentsong.play()
    play.src="./svgs/pause.svg"
  } else {
    currentsong.pause()
    play.src="./svgs/play.svg"
  }
})

// ----------------------------------------------------------
currentsong.addEventListener("timeupdate",()=>{
  console.log(currentsong.currentTime,currentsong.duration)
  document.querySelector(".songtime").innerHTML=`
  ${secoundstominutes(currentsong.currentTime)}:${secoundstominutes(currentsong.duration)}`
  document.querySelector('.circle').style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
})
// -----------------------------------------------------------
document.querySelector(".seekbar").addEventListener("click",(e)=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left=percent+"%";
  currentsong.currentTime=((currentsong.duration)*percent)/100
})


document.querySelector(".hamburger").addEventListener("click",(()=>{
  document.querySelector(".leftside").style.left="0"
}))


document.querySelector(".close").addEventListener("click",(()=>{
  document.querySelector(".leftside").style.left="-110%"
}))
// ==========================================================
previous.addEventListener("click",()=>{
  currentsong.pause()
  let find=songs.map(url => url.split('/').pop().split('.')[0])
  let index = find.indexOf(currentsong.src.split('/').pop().split('.')[0])
  if ((index - 1) >= 0) {
    playmusic(find[index - 1])
}
})

next.addEventListener("click",()=>{
  currentsong.pause()
  let find=songs.map(url => url.split('/').pop().split('.')[0])
  let index = find.indexOf(currentsong.src.split('/').pop().split('.')[0])
  if ((index + 1) < find.length) {
      playmusic(find[index + 1])
  }
})


document.querySelector(".range").addEventListener("change",(e)=>{
  currentsong.volume=parseInt(e.target.value)/100
})

}

main();
