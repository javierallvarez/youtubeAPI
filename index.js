const api = '';
const output = document.querySelector('.output');
const searchTerm = document.querySelector('input');
const btn = document.querySelector('button');

// Asigna el valor por defecto de la barra de búsqueda:
searchTerm.setAttribute('value','api');
btn.addEventListener('click', ySearch)

// Paginator:
const btnPrev = document.createElement('button');
// Creamos los botones, en principio deshabilitados:
btnPrev.setAttribute('disable', true)
btnPrev.textContent = 'Prev';
const paginator = document.querySelector('.paginator');
paginator.appendChild(btnPrev);
const btnNext = document.createElement('button')
btnNext.setAttribute('disable', true)
btnNext.textContent = 'Next';
paginator.appendChild(btnNext);
const btns = document.querySelectorAll('button');
btns.forEach(function(btn){
    btn.addEventListener('click', ySearch);
})

function ySearch(e){
    let search = searchTerm.value;
    // Codifica la búsqueda para que sirva en la url, ej. cambia los espacios de la búsqueda por %: search: musica%electrica:
    search = encodeURIComponent(search)
    let url = "https://www.googleapis.com/youtube/v3/search/?part=snippet&key="
    +api+
    "&q="
    +search+
    "&maxResults=6"
    if(e.target.token) {
        url += '&pageToken=' + e.target.token;
    }
    //Mostraría primero el link de la API, lo comentamos:
    //output.textContent = url;
    fetch(url).then(function(rep) {
        return rep.json()
    })
    .then(function(data) {
        //prevPageToken es uno de los datos que recibimos por json.
        //Si tiene un previous token, muestra el btn:
        if(data.prevPageToken){
            btnPrev.token = data.prevPageToken;
            btnPrev.disabled = false;
        } else {
            btnPrev.token = false;
            btnPrev.disabled = true;
        }
        if(data.nextPageToken){
            btnNext.token = data.nextPageToken;
            btnNext.disabled = false;
        } else {
            btnNext.token = false;
            btnNext.disabled = true;
        }
        return data.items.map(function(uTube) {
            return {
                title: uTube.snippet.title,
                description: uTube.snippet.description,
                img: uTube.snippet.img,
                id: uTube.id.videoId,
                uTube: uTube
            }
        })
    }).then(function(arr){
        show(arr);
    }).catch(function(error){
        console.error(error);
    })
}    

//console.log(ySearch()); 

function show(data) {
    //console.log(data);
    //console.log(data.length);
    // Oculta la línea actual de videos y pone la nueva, sin ello se irían sumando líneas de videos cada vez que pulsas next:
    output.innerHTML = ''
    data.forEach(function(video) {
        console.log(video);
        let div = document.createElement('div');
        div.classList.add('box');
        // Crea un texto e string del valor especificado:
        let desc = document.createTextNode(video.description);
        let span = document.createElement('span');
        span.innerHTML = 
                        `
                        <img src="${video.uTube.snippet.thumbnails.default.url}" alt="">
                        <a href="http://www.youtube.com/watch?v=${video.id}" target="_blank">${video.title}</a>
                        <br>
                        `;
        div.appendChild(span);
        div.appendChild(desc);
        output.appendChild(div);
    });
}


// Escribiendo la url en el navegador conseguimos el token, pegamos precedido de pageToken=:
//https://www.googleapis.com/youtube/v3/search/?part=snippet&key=AIzaSyCPGg5IK6kf3Wy567YFtogMuwVnYbJLy5I&q=&maxResults=20&pageToken=CBQQAA