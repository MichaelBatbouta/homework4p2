/*
File: tablecreate
jquery functions to validate and update sliders and text also create a table dynamically
Michael Batbouta, UMass Lowell Computer Science, michael_batbouta@student.uml.edu
Copyright (c) 2021 by Wenjin. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by Michael Batbouta on august 9, 2021 at 10:30 pm
resources used
https://stackoverflow.com/questions/17548520/dynamically-adding-a-tab-on-button-click
https://www.lidorsystems.com/support/articles/jquery/tabstrip/tab-strip-add-remove.aspx
*/
//global to keep track of tabs
var current_idx = 0;

$(function() {

    //min and max functions for verification
  $.validator.addMethod('lessThan', function (value, element, param) {
    return this.optional(element) || parseInt(value) <= parseInt($(param).val());
  }, 'Invalid value');
  $.validator.addMethod('greaterThan', function (value, element, param) {
    return this.optional(element) || parseInt(value) >= parseInt($(param).val());
  }, 'Invalid value');
  //function to not accept decimals
  $.validator.addMethod("noDecimal", function(value, element) {
    return !(value % 1);
  }, "No decimal numbers");

  $("#dynamicCheck").validate({
    rules: {
      minCol:
      {
          required: true,
          number: true,
          lessThan: '#maxCol',
          noDecimal: '#minCol'
      },
      maxCol:
      {
          required: true,
          number: true,
          greaterThan: '#minCol',
          noDecimal: '#maxCol'
      },
      minRow:
      {
          required: true,
          number: true,
          lessThan: '#maxRow',
          noDecimal: '#minRow'
      },
      maxRow:
      {
          required: true,
          number: true,
          greaterThan: '#minRow',
          noDecimal: '#maxRow'
      }
  },
  messages: {
    minCol: {lessThan: 'Must be less than max column size.'},
    maxCol: {greaterThan: 'Must be greater than min column size.'},
    minRow: {lessThan: 'Must be less than max row size.'},
    maxRow: {greaterThan: 'Must be greater than min row size.'}
  },

  });

    $( "#minColSlider" ).slider({
      range: "max",
      min: -50,
      max: 50,
      value: 0,
      change: function( event, ui ) {
        if($('#minCol').valid() && $('#maxCol').valid() && $('#minRow').valid() && $('#maxRow').valid()){
          addTable();
        }
        $( "#minCol" ).val( ui.value );
      },
      slide: function( event, ui ) {
        $( "#minCol" ).val( ui.value );
      }
    });
    $( "#maxColSlider" ).slider({
      range: "max",
      min: -50,
      max: 50,
      value: 0,
      change: function( event, ui ) {  
        if($('#maxCol').valid() && $('#minCol').valid() &&  $('#minRow').valid() && $('#maxRow').valid()){
          addTable();
        }
        $( "#maxCol" ).val( ui.value );
      },
      slide: function( event, ui ) {
        $( "#maxCol" ).val( ui.value );
      }
    });
    $( "#minRowSlider" ).slider({
      range: "max",
      min: -50,
      max: 50,
      value: 0,
      change: function( event, ui ) {
        if($('#minRow').valid() && $('#minCol').valid() && $('#maxCol').valid() &&  $('#maxRow').valid()){
          addTable();
        }
        $( "#minRow" ).val( ui.value );
      },
      slide: function( event, ui ) {
        $( "#minRow" ).val( ui.value );
      }
    });
    $( "#maxRowSlider" ).slider({
      range: "max",
      min: -50,
      max: 50,
      value: 0,
      change: function( event, ui ) {
        if($('#maxRow').valid() && $('#minCol').valid() && $('#maxCol').valid() && $('#minRow').valid() ){
          addTable();
        }
        $( "#maxRow" ).val( ui.value );
      },
      slide: function( event, ui ) {
        $( "#maxRow" ).val( ui.value );
      }
    });
  
    $( "#minCol" ).val( $( "#minColSlider" ).slider( "value" ) );
    $( "#maxCol" ).val( $( "#maxColSlider" ).slider( "value" ) );
    $( "#minRow" ).val( $( "#minRowSlider" ).slider( "value" ) );
    $( "#maxRow" ).val( $( "#maxRowSlider" ).slider( "value" ) );
    //two way validation
    $('#minCol').change(function(e) { 
      if($('#minCol').valid() && $('#maxCol').valid() && $('#minRow').valid() && $('#maxRow').valid()){
        addTable();
      }
      $('#minColSlider').slider("value", $(this).val());
    })
    $('#maxCol').change(function(e) {
      
      if($('#minCol').valid() && $('#maxCol').valid() && $('#minRow').valid() && $('#maxRow').valid()){
        addTable();
      }
      $('#maxColSlider').slider("value", $(this).val());
    })
    $('#minRow').change(function(e) {
      
      if($('#minCol').valid() && $('#maxCol').valid() && $('#minRow').valid() && $('#maxRow').valid()){
        addTable();
      }
      $('#minRowSlider').slider("value", $(this).val());
    })
    $('#maxRow').change(function(e) {
      
      if($('#minCol').valid() && $('#maxCol').valid() && $('#minRow').valid() && $('#maxRow').valid()){
        addTable();
      }
      $('#maxRowSlider').slider("value", $(this).val());
    })

  //below handles the tabs cb handles adding while remove removes the tabs( cant remove the last tab due to data loss)
  var tabs = $("#container-1").tabs();
    $('#cb').click( function(){
        var ul = tabs.find( "ul" );
        let x = document.getElementById("minCol").value;
        let y = document.getElementById("maxCol").value;
        let z = document.getElementById("minRow").value;
        let q = document.getElementById("maxRow").value;
        $("<li><a href='#fragment-" + current_idx + "'>"+ x +" x " + y + " x "+ z + " x "+ q + "</a></li>" ).appendTo( ul );
        tabs.append("<div id='fragment-" + current_idx + "'></div>");
        tabs.tabs("refresh");
        addTableToTab("fragment-" + current_idx);
        current_idx += 1;
    });

// never remove the last column 
    $("#removeTabs").click(function() {
      var ul = tabs.find( "ul" );
      var current_amount = ul.find("li").length + 1;
      var amount = parseInt($("#amount").val(), 10);
      var tabIndex = parseInt($("#indexValue").val(), 10);
      var toManyDeleted = document.getElementById("toManyDeleted");
      let toManyDeletedtext
      if(amount <= current_amount - tabIndex-1 && current_amount != 2 && (current_amount - amount - 1) != 0){
        if(amount!= 0){
          for(var i =0; i < amount; i++){
            if(current_amount > 2){
              $( "#container-1" ).find(".ui-tabs-nav li:eq(" + tabIndex + ")").remove();
              $("#container-1").tabs("refresh");
            }
          }
          toManyDeleted.style.display = "none"
        }
        else{
          toManyDeletedtext = "Zero tables deleted";
          document.getElementById("toManyDeleted").innerHTML = toManyDeletedtext;
          toManyDeleted.style.display = "";
        }

      }
      else{
        toManyDeletedtext = "Not enough elements to remove (last table cannot be removed)";
        document.getElementById("toManyDeleted").innerHTML = toManyDeletedtext;
        toManyDeleted.style.display = "";
      }

    });

}); 

//basic function to create table without a tab
function addTable() {
  var myTableDiv = document.getElementById("myDynamicTable");
  var table = document.createElement('TABLE');
  let mincol = document.getElementById("minCol").value;
  let minrow = document.getElementById("minRow").value;
  let maxcol = document.getElementById("maxCol").value;
  let maxrow = document.getElementById("maxRow").value;

  myTableDiv.innerHTML = "";
  table.border = '1';

  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);

  for (var i = minrow-1; i <= maxrow; i++) {
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    if(i == minrow-1){
      for (let j = mincol-1; j <= maxcol; j++) {
        /*do the first row different then the rest */
        if(j == mincol-1){
          var td = document.createElement('TD');
          td.width = '75';
          td.appendChild(document.createTextNode(" "));
          tr.appendChild(td);
        }
        else{
          var td = document.createElement('TD');
          td.width = '75';
          td.appendChild(document.createTextNode(j));
          tr.appendChild(td);
        }
      }
    }
    else{
      for (let j = mincol-1; j <= maxcol; j++) {
        if(j == mincol- 1){
          var td = document.createElement('TD');
          td.width = '75';
          td.appendChild(document.createTextNode(i));
          tr.appendChild(td);
        }else{
          var td = document.createElement('TD');
          td.width = '75';
          td.appendChild(document.createTextNode(i * j));
          tr.appendChild(td);
        }

      }
    }

  }
  myTableDiv.appendChild(table);
}


//function to add table to tabs!
function addTableToTab(tablename) {
  var myTableDiv = document.getElementById(tablename);
  var table = document.createElement('TABLE');
  let mincol = document.getElementById("minCol").value;
  let minrow = document.getElementById("minRow").value;
  let maxcol = document.getElementById("maxCol").value;
  let maxrow = document.getElementById("maxRow").value;
  myTableDiv.innerHTML = "";
  table.border = '1';

  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);

  for (var i = minrow-1; i <= maxrow; i++) {
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    if(i == minrow-1){
      for (let j = mincol-1; j <= maxcol; j++) {
        /*do the first row different then the rest */
        if(j == mincol-1){
          var td = document.createElement('TD');
          td.width = '75';
          td.appendChild(document.createTextNode(" "));
          tr.appendChild(td);
        }
        else{
          var td = document.createElement('TD');
          td.width = '75';
          td.appendChild(document.createTextNode(j));
          tr.appendChild(td);
        }
      }
    }
    else{
      for (let j = mincol-1; j <= maxcol; j++) {
        if(j == mincol- 1){
          var td = document.createElement('TD');
          td.width = '75';
          td.appendChild(document.createTextNode(i));
          tr.appendChild(td);
        }else{
          var td = document.createElement('TD');
          td.width = '75';
          td.appendChild(document.createTextNode(i * j));
          tr.appendChild(td);
        }

      }
    }

  }
  myTableDiv.appendChild(table);
}
