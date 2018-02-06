// const beautify = require('js-beautify').js_beautify
// const temp = {
//   "window": "www.google.com"
// }
const newLine = [
  ';',
  '{',
  '}',
  ';',
  '//'
]


// const myHeaders = new Headers({'Content-Type': 'application/json'});
//
// const myInit = { method: 'POST',
//                headers: myHeaders,
//                body: JSON.stringify({code: str}),
//                mode: 'cors',
//                cache: 'default' };
//
// fetch('http://localhost:3000/', myInit).then(res => res.json()).then(function(myBlob) {
//   console.log(myBlob);
//   // var objectURL = URL.createObjectURL(myBlob);
//   // myImage.src = objectURL;
// });
function open(url){
  // window.alert(url);
  chrome.devtools.panels.openResource(url, 0, function(){})
}

function toggle(source){
  source.getContent(function(str, encoding){
    const line = str.split(' ');
    let element = document.createElement('pre');
    element.setAttribute('class', "prettyprint");

    line.forEach((word) => {
      if(word.includes('<') && word.includes('>')){
        // do nothing
      }
      else if(db[word]){
        let link = document.createElement('button');
        link.append(word);
        link.setAttribute('class', 'link');
        link.addEventListener('click', function(){
          open(db[word]);
        });
        element.append(link);
      }
      else {
        element.append(word);
      }
    })

    // document.querySelector('#main').removeChild();
    document.querySelector('#main').append(element);
  });
}

(function(){
  chrome.devtools.inspectedWindow.getResources(function(resources){
    const res = resources.filter((r) => {
      return r.type === "script" && r.url.includes(".js") && !r.url.includes('.json');
    });

    res.forEach((source, i) => {
      const id = `button${i}`;
      let button = document.createElement('button');
      button.setAttribute("id", id);
      button.setAttribute("class", "btn btn-outline-info")

      const arr = source.url.split('/');
      let content = document.createTextNode(arr[arr.length - 1]);
      button.append(content);
      button.addEventListener('click', function(){
        toggle(source);
      });
      document.querySelector('#mynav').append(button);
    });

    toggle(res[0]);
  });
})();
