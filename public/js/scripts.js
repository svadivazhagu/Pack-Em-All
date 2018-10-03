



//READY FUNCTION
$( document ).ready(function() {
    console.log( "Page Loaded!" );
    randomSearch();
});

//Function onclick Upload
function upload(){
  var data = getUploadQuery(); //get inputdata
  if(data == null){
    //update UI to BAD URL
    var errormsg = document.getElementById("errormsg");
    errormsg.classList.remove("hidden");
  } else{
    var xml = new XMLHttpRequest();
    xml.open("POST", "/upload");
    xml.onreadystatechange = handle_res_post;
    xml.send(JSON.stringify(data));
  }
}





//Onclick response for Update button
function update(){
  var data = getUploadQuery();
  if(data == null){
    //update UI to input
    var errormsg = document.getElementById("errormsg");
    errormsg.classList.remove("hidden");
  } else{
    var xml = new XMLHttpRequest();
    xml.open("POST", "/update");
    xml.onreadystatechange = handle_res_post;
    xml.send(JSON.stringify(data));
  }
}
//Handle return data from upload
function handle_res_post() {
  //console.log("TOuch handle_res");
  switch(this.readyState){
    case 1:
        console.log("Opened Query MSG");
        break;
    case 2:
        console.log("Reading Query HEADER");
        break;
    case 3:
        console.log("Loading Query Data");
        break;
    case 4:
    if (this.status == 200) {
      //console.log(this.responseText)
      var myArr = JSON.parse(this.responseText);
      console.log(this.responseText);
      //CHECK IF response was an update response!
      if(myArr.responselen != null){
          console.log("That item was in the array already");
          $('#updatemodal').modal('toggle');

      }else{
        //UPDATE UI
        var table = document.getElementById("tablebody");
       table.removeChild(table.children[0]); // remove the first child
        document.getElementById(myArr.link).remove();
        //table.removeChild(table.childNode[JSON.stringify(myArr.link)]); //remove child that was possible updated
        var row = document.createElement("tr");
        row.id = myArr.link;
        row.innerHTML=('<td>'+ myArr.teamname +'</td><td>'+ myArr.author +'</td><td>'+ myArr.format +'</td><td>'+ myArr.gen +'</td><td><a href="'+ myArr.link +'"target="_blank">'+myArr.link+'</a></td><td id="del" onclick="deleteitem(\'' +  myArr.link + '\')" class="delete"><i class="fa fa-trash-o"></i></td>');
        table.appendChild(row);
        }
      }
      else if(this.status == 404){
        console.log("Error 404");
      }
      else{
        console.log('Error 503');
      }
      break;
    default:
      console.log("Something Went wrong...");
      break;
  }

  }

  //Get upload data
    function getUploadQuery(){
    //  var json = [];
      var input_data = document.getElementById("input_pokepaste");
      var url = urlCheck(input_data.value); //check if URL is good
      var input_name = document.getElementById("input_teamname");
      var input_author = document.getElementById("input_author");
      var input_format = document.getElementById("input_format");
      var input_gen = document.getElementById("input_gen");
      if(input_data.value == '' || url == 1 || input_name.value == '' || input_author.value == '' ){
        console.log("YOU DONE MESSED UP")
        return null;
      }
      var data = {'teamname': input_name.value, 'author': input_author.value,  'format': input_format.value, 'gen': input_gen.value, 'link': input_data.value};
      //  json.push(data);
      return data;
    }
//checks if URL begins with proper pokepaste
    function urlCheck(url){
      var source = url.toString().substring(0,20);
      if(source === "https://pokepast.es/"){
        console.log("Good LINK");
        console.log(source);
        return 0;
      }
      else{
        console.log("BAD LINK");
        console.log(source);
        return 1;
      }
    }


//Onclick Search Function
  function search(){
    var data = getSearchQuery();
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = handle_res_get;
    xml.open("POST", "/search");
    xml.send(JSON.stringify(data));
  }

//Get the search query from form
  function getSearchQuery(){
    //var json = [];
    var search_name = document.getElementById("search_teamname");
    var search_author = document.getElementById("search_author");
    var search_format = document.getElementById("search_format");
    var search_gen = document.getElementById("search_gen");
    var line = {'teamname': search_name.value, 'author': search_author.value, 'format': search_format.value, 'gen': search_gen.value};
    // json.push(line);
    return line;
  }

//handle search response
  function handle_res_get() {
    switch(this.readyState){
      case 1:
          console.log("Opened Query MSG");
          break;
      case 2:
          console.log("Reading Query HEADER");
          break;
      case 3:
          console.log("Loading Query Data");
          break;
      case 4:
      if (this.status == 200) {
        var myArr = JSON.parse(this.responseText);
          //console.log("From the front end:\n");
          console.log(myArr.result.length);
           //UPDATE TABLE w/ RESPONSES

          var parent = document.getElementById("tablebody");
          parent.innerHTML = '';
            //check if no responses
          if(myArr.result.length == '0'){
            var row = document.createElement("tr");
            row.innerHTML=('<td colspan="6">'+ 'No Teams Available, Sorry...' +'</td>');
            parent.appendChild(row);
          }else{
            var results = myArr.result;
            for(var i =0;i<myArr.result.length;i++){
              var row = document.createElement("tr");
              row.id = results[i].link;
              row.innerHTML=('<td>'+ results[i].teamname +'</td><td>'+ results[i].author +'</td><td>'+ results[i].format +'</td><td>'+ results[i].gen +'</td><td><a href="'+ results[i].link +'"target="_blank">'+results[i].link+'</a></td><td id="del" onclick="deleteitem(\'' +  results[i].link + '\')" class="delete"><i class="fa fa-trash-o"></i></td>');
              parent.appendChild(row);
            }
          }


        }
        else if(this.status == 404){
          console.log("Error 404");
        }
        else{
          console.log('Error 503');
        }
        break;
      default:
        console.log("Something Went wrong...");
        break;
      }
    }


//onClick Response for Delete Button
function deleteitem(id){
  //console.log("HELLO THERE");
  console.log(id);
  $('#deletemodal').modal('toggle');
  var modalbod = document.getElementById("deletemodalbody");
  modalbod.innerHTML = (''+id); //load delete warning
  var row = document.getElementById(id);
  console.log(id);
  //row.parentElement.removeChild(row);

}
//on delete confirm, delete row from ui and call server
function deleteitemconfirm(){
  var modalbod = document.getElementById("deletemodalbody");
  var id = modalbod.innerHTML;
  var row = document.getElementById(id);
  console.log(id);

  var data = getdelrow(row);
  row.parentElement.removeChild(row);
  var xml = new XMLHttpRequest();
  xml.open("POST", "/delete");
  //xml.onreadystatechange = handle_res_post;
  xml.send(JSON.stringify(data));
}

//Get info to delete the correct row
function getdelrow(row){
  var children = row.childNodes;
  var name= children[0].innerHTML;
  var auth= children[1].innerHTML;
  var format= children[2].innerHTML;
  var gen= children[3].innerHTML;
  var link= row.id;
  var data = {'teamname': name, 'author': auth,  'format': format, 'gen': gen, 'link': link};
  console.log(data);
  return data;
}

//On start and on click Randomized Search
function randomSearch(){
  console.log("Random Search...");
  var data = {};
  var xml = new XMLHttpRequest();
  xml.open("POST", "/random");
  xml.onreadystatechange = handle_res_get;
  xml.send(JSON.stringify(data));
}
