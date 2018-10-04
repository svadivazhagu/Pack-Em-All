
//READY FUNCTION
$( document ).ready(function() {
    console.log( "Page Loaded!" );
    //Load the Circle packing Graph
    var xml = new XMLHttpRequest();
    xml.open("POST", "/flare");
    xml.onreadystatechange = handle_init_Graph;
    xml.send();
});

function askforgraph(){
  var xml = new XMLHttpRequest();
  xml.open("POST", "/flare");
  xml.onreadystatechange = handle_init_Graph;
  xml.send();
}

var dataset;
//handle the init fetched data to printthe graph
  function handle_init_Graph() {
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
          console.log(myArr.result[0]);
          dataset = myArr.result[0];
          load_init_graph(dataset);
          //return myArr;
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


//This function takes the root node of the data set and makes a circle packing gaph
function load_init_graph(root){
  var canvas = document.getElementById("canvas");
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
  var color = d3.scaleLinear()
        .domain([-1, 5])
        .range(["#8BBCFC", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var body = d3.select("body").style("background-color", color(-1));
    var diameter;
    var g;

    var svg = d3.select("svg");
    var margin = 50;
    if($(window).width()<=700){
       diameter =+ $(window).width()
       g = svg.append("g").attr("transform", "translate(" + diameter/2  + "," + diameter/2 + ")");
    }
    else{
      diameter =+ ($(window).width()/2)- margin
      g = svg.append("g").attr("transform", "translate(" + diameter  + "," + diameter/2 + ")");
    }

    var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(2);
    var tooltip = d3.select("body")
    	.append("div")
    	.style("position", "absolute")
    	.style("z-index", "10")
    	.style("visibility", "hidden")

      function getSize() {
               var d3text = d3.select(this);
               var circ = d3.select(this.previousElementSibling); // in other cases could be parentElement or nextElementSibling
               var radius = Number(circ.attr("r"));
               var offset = Number(d3text.attr("dy"));
               var textWidth = d3.select(this).text; // TODO: this could be bounding box instead
               var availWidth = chordWidth(Math.abs(offset), radius)* 0.85; // TODO: could adjust based on ratio of dy to radius
               //availWidth = availWidth * 0.85; // fixed 15% 'padding' for now, could be more dynamic/precise based on above TODOs
               console.log(textWidth);
               d3text.attr("data-scale", availWidth / textWidth); // sets the data attribute, which is read in the next step
              }

              function chordWidth(dFromCenter, radius) {
               if (dFromCenter > radius) return Number.NaN;
               if (dFromCenter === radius) return 0;
               if (dFromCenter === 0) return radius * 2;

               // a^2 + b^2 = c^2
               var a = dFromCenter;
               var c = radius;
               var b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2)); // 1/2 of chord length

               return b * 2;
              }

      root = d3.hierarchy(root)
          .sum(function(d) { return d.size; })
          .sort(function(a, b) { return b.value - a.value; });

      var focus = root,
          nodes = pack(root).descendants(),
          view;
      var circle = g.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
          .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
          .style("fill", function(d) { return d.children ? color(d.depth) : null; })
          .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
        var text = g.selectAll("text")
          .data(nodes)
          .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
            .style("visibility", function(d) { return d.parent === root ? "inline" : "none"; })
            .style("font-size", function(d) {
                var len = d.data.name.substring(0, d.r / 3).length;
                var size = d.r/3;
                size *= 10 / len;
                size += 1;
                return Math.round(size)+'px';
            })
            .text(function(d) {
                var text = d.data.name;
                return text;
            })
            .attr("dy", ".35em");;


      var node = g.selectAll("circle,text");
      svg.style("background", color(-1))
          .on("click", function() { zoom(root); });
      zoomTo([root.x, root.y, root.r * 2 + margin]);
      function zoom(d) {
        var focus0 = focus; focus = d;
        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
              var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
              return function(t) { zoomTo(i(t)); };
            });
        transition.selectAll("text")
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }
      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
      }

      function hovered(hover) {
      return function(d) {
    	d3.selectAll(d.ancestors().map(function(d) {}));
      };
    }
  }




//Function onclick Upload
function upload(){
  var data = getUploadQuery(); //get inputdata
  if(data == null){
    //update UI to BAD URL
  alert("Data not Sufficient...");
  } else{
    findNode_upload(data.parent, dataset,data.job);
    var xml = new XMLHttpRequest();
    xml.open("POST", "/update");
    xml.onreadystatechange = handle_upload_res;
    xml.send(JSON.stringify(dataset)); //send the data to the server
  }
}


//Get upload data
  function getUploadQuery(){
    //var input_data = document.getElementById("input_data"); //takes the data
    var input_name = document.getElementById("input_jobname"); //takes the job title
    var input_parent = document.getElementById("input_parent"); //takes the parent class
    if( input_name.value == '' || input_parent.value == '' ){
      console.log("YOU DONE MESSED UP")
      return null;
    }
    var data = {'job': input_name.value,  'parent': input_parent.value};
    //  json.push(data);
    return data;
  }


//Onclick response for Update button
function update(){
  var data = getUpdateQuery();
  if(data == null){
    //update UI to input
    var errormsg = document.getElementById("errormsg-upd");
    errormsg.classList.remove("hidden");
  } else{
    findNode_update(data, dataset);
    var xml = new XMLHttpRequest();
    xml.open("POST", "/update");
    xml.onreadystatechange = handle_update_res;
    xml.send(JSON.stringify(dataset));
  }
}

//Get upload data
  function getUpdateQuery(){
    var input_data = document.getElementById("input_data_u"); //takes the data
    var input_name = document.getElementById("input_jobname_u"); //takes the job title
    var input_parent = document.getElementById("input_parent_u"); //takes the parent class
    if( input_name.value == '' || (input_parent.value == '' && input_data.value == '')){
      console.log("YOU DONE MESSED UP")
      return null;
    }
    var data;
    if(input_data.value == null){
      data = {'job': input_name.value,  'parent': input_parent.value};
    }
    else if (input_parent.value == null){
      data = {'job': input_name.value, 'data': input_data.value  };
    }
    else{
       data = {'job': input_name.value, 'data': input_data.value,  'parent': input_parent.value};
    }
    return data;
  }



//Handle return data from upload
function handle_upload_res() {
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
      var myArr = JSON.parse(this.responseText); //Receive ACK
      console.log(this.responseText);
      //CHECK IF response was an update response!
      if(myArr.responselen != null){
          console.log("That item was in the array already");
          askforgraph()
      }else{
          //UPDATE UI
          askforgraph()
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
      console.log("Something Went REALLY wrong...");
      break;
  }

  }

  //Handle return data from upload
  function handle_update_res() {
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
            //load_init_graph(myArr)
        }else{
          //UPDATE UI
            askforgraph()

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

//
// //Onclick Search Function
//   function search(){
//     var data = getSearchQuery();
//     var xml = new XMLHttpRequest();
//     xml.onreadystatechange = handle_search_res;
//     xml.open("POST", "/search");
//     xml.send(JSON.stringify(data));
//   }
//
// //Get the search query from form
//   function getSearchQuery(){
//     var search_name = document.getElementById("search_catagory");
//     var line = {'job': search_name.value};
//     return line;
//   }
//
// //handle search response
//   function handle_search_res() {
//     switch(this.readyState){
//       case 1:
//           console.log("Opened Query MSG");
//           break;
//       case 2:
//           console.log("Reading Query HEADER");
//           break;
//       case 3:
//           console.log("Loading Query Data");
//           break;
//       case 4:
//       if (this.status == 200) {
//         var myArr = JSON.parse(this.responseText);
//           //console.log("From the front end:\n");
//           console.log(myArr.result.length);
//            //UPDATE TABLE w/ RESPONSES
//
//
//
//         }
//         else if(this.status == 404){
//           console.log("Error 404");
//         }
//         else{
//           console.log('Error 503');
//         }
//         break;
//       default:
//         console.log("Something Went wrong...");
//         break;
//       }
//     }
function findNode_upload(name,currentNode,child) {
    var i,
        currentChild,
        result;

    if (name == currentNode.name) {
      var obj = {"name": newname,"children":[]};
        if(typeof currentNode.children ==undefined){
          currentNode.children = [obj];
        }
        else{

          currentNode.children.append = obj;
        }
        return currentNode;
    } else {

        // Use a for loop instead of forEach to avoid nested functions
        // Otherwise "return" will not work properly
        for (i = 0; i < currentNode.children.length; i += 1) {
            currentChild = currentNode.children[i];

            // Search in the current child
            result = findNode(name, currentChild);

            // Return the result if the node has been found
            if (result !== false) {
                return result;
            }
        }

        // The node has not been found and we have no more options
        return false;
    }
}
    function findNode(name, currentNode) {
        var i,
            currentChild,
            result;

        if (name == currentNode.name) {
            return currentNode;
        } else {

            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly

            for (i = 0; i < currentNode.children.length; i += 1) {
                currentChild = currentNode.children[i];

                // Search in the current child
                result = findNode(name, currentChild);

                // Return the result if the node has been found
                if (result !== false) {
                    return result;
                }
            }
          

            // The node has not been found and we have no more options
            return false;
        }
    }

    function findNode_update(name, currentNode,newname) {
        var i,
            currentChild,
            result;

        if (name == currentNode.name) {
            currentNode.Name =newname;
            return currentNode;
        } else {

            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            for (i = 0; i < currentNode.children.length; i += 1) {
                currentChild = currentNode.children[i];

                // Search in the current child
                result = findNode(name, currentChild);

                // Return the result if the node has been found
                if (result !== false) {
                    return result;
                }
            }

            // The node has not been found and we have no more options
            return false;
        }
    }

    function findNode_DEL(name, currentNode) {
        var i,
            currentChild,
            result;

        if (name == currentNode.name) {
            delete currentNode.name;
            delete currentNode.children;
            return currentNode;
        } else {

            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            for (i = 0; i < currentNode.children.length; i += 1) {
                currentChild = currentNode.children[i];

                // Search in the current child
                result = findNode(name, currentChild);

                // Return the result if the node has been found
                if (result !== false) {
                    return result;
                }
            }

            // The node has not been found and we have no more options
            return false;
        }
    }


//onClick Response for Delete Button
function deleteitem(){
  var data = getUpdateQuery();
  if(data == false){
    //update UI to input
    alert("No Data Found by that name.");
  } else{
    findNode_DEL(data, dataset)



    var xml = new XMLHttpRequest();
    xml.open("POST", "/update");
    xml.onreadystatechange = handle_update_res;
   xml.send(JSON.stringify(dataset));
  }
}



//Get delete data
  function getDelQuery(){

    var input_name = document.getElementById("input_jobname_u"); //takes the job title
    if( input_name.value == ''){
      console.log("YOU DONE MESSED UP")
      return false;
    }
    var data = findNode(input_name.value, dataset);
    return data;
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
  xml.onreadystatechange = handle_res_post;
  xml.send(JSON.stringify(dataset));
}

// //Get info to delete the correct row
// function getdelrow(row){
//   var children = row.childNodes;
//   var name= children[0].innerHTML;
//   var auth= children[1].innerHTML;
//   var format= children[2].innerHTML;
//   var gen= children[3].innerHTML;
//   var link= row.id;
//   var data = {'teamname': name, 'author': auth,  'format': format, 'gen': gen, 'link': link};
//   console.log(data);
//   return data;
// }
//
// //On start and on click Randomized Search
// function randomSearch(){
//   console.log("Random Search...");
//   var data = {};
//   var xml = new XMLHttpRequest();
//   xml.open("POST", "/random");
//   xml.onreadystatechange = handle_res_get;
//   xml.send(JSON.stringify(data));
// }
