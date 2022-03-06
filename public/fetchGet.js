fetchJSON = async (url) => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch(e) {
    console.log('Error', e.message);
  }
}

fetchJSON('http://localhost:8000/recipies/view')
  .then(res => {
    let str = "";
    res.forEach(recipe => str += recipe.title + '<br>');
    document.getElementById('test').innerHTML = str;
  });
