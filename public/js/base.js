window.onload = function (){
    document.addEventListener('touchstart',(e)=>{
        var e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
    })

    window.onresize = function (){
        let styleNode = document.createElement('style');
        let w = document.documentElement.clientWidth / 16;
        styleNode.innerHTML = 'html{font-size:'+w+'px;}'
        document.head.appendChild(styleNode);
    }
    let styleNode = document.createElement('style');
    let w = document.documentElement.clientWidth / 16;
    styleNode.innerHTML = 'html{font-size:'+w+'px;}'
    document.head.appendChild(styleNode);
}