

function open(url){
  // window.alert(window.location);
  // fetch url
  fetch(url).then(res => {
    return res.text();
  }).then(data => {
    // document.querySelector('#myframe').innerHTML = data;
    document.getElementById('myframe').src = "data:text/html;charset=utf-8," + escape(data);
  });
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
        element.append(" ");
        element.append(link);
      }
      else {
        element.append(" " + word);
      }
    })

    document.querySelector('#main').innerHTML = '';
    document.querySelector('#main').prepend(element);
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
    document.getElementById('myframe').addEventListener('click', function(){
      window.alert('click');
    });
  });
})();
