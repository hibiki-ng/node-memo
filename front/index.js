let requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: 'hibiki' })
  };

function showData() {
    fetch('https://api.hibiki.tech:3000/getData', requestOptions)
  .then(response => response.json())
  .then(data => {
      console.log(data);
      let content = '';
    
      for (let i = 0; i < data.length; i++) {
          content += '<div class="element">' + data[i].value + '<i class="fa-solid fa-trash" style="color: white;" onclick="deleteMemo(\'' + data[i].value + '\')"></i></div>';
      }
    
      console.log(content);
    
      $('#main')[0].innerHTML = content;
  })
  .catch(error => console.error(error));

}

function saveMemo() {
    let value = $('#input')[0].value;
    let user = 'hibiki';

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user, value: value })
    };

    fetch('https://api.hibiki.tech:3000/insert', requestOptions);

    setTimeout(() => {
        showData();
        $('#input')[0].value = '';
      }, 300); 
}

function deleteMemo(value) {
    console.log(value);
    let user = 'hibiki';

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user, value: value })
    };

    fetch('https://api.hibiki.tech:3000/delete', requestOptions);

    setTimeout(() => {
        showData();
        $('#input')[0].value = '';
      }, 300); 
}

$(document).ready(function() {
    showData();
});