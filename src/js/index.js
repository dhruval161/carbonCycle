const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')

//const BrowserWindow = electron.remote.BrowserWindow
$ = jQuery;
$(function(){

  var emr= [];
  var photo = [];
  var soil = [1580];
  var atm = [600];
  var lb = [610];
  var surfoc = [891.626];
  var deepoc = [38000];
  var foss = [10000];
  var generation = 0;

  $("#add").click(function(){
    var year = $("#year").val();
    var rate = $("#rate").val();
    $("#year").val("");
    $("#rate").val("");
    if(year === "" || rate=== "")
    {
      return;
    }

    emr.push({y:Number(year),r:Number(rate) });

    $(".rates").append(year + " - "+ rate + "<br>");
    //console.log(emr);
    $("#ans").text(year);
  });

  $("#gen").click(function(){
    //console.log(emr[emr.length-1]);

    generation = 1;
    $("#val").text(emr);
    soil = [1580];
    atm = [600];
    lb = [610];
    surfoc = [891.626];
    deepoc = [38000];
    foss = [10000];
    point = 0;
    emis = 5.5;
    for(var i=1;i<101;i++)
    {
        var dt = (atm[i-1]*280/600 - 280)*0.01;
        var t = 15 +dt;
        var phot = 125*((atm[i-1]*28/60 -30)/(atm[i-1]*28/60 +32.5))*(1+0.04*t);
        photo.push(phot);
        var plntres = phot/2;
        var lf = 50*lb[i-1]/610;
        var rof = 0.6*soil[i-1]/1580;
        var res = soil[i-1]*((49.5)/1580)*(1+0.1*t);
        var hco3=(surfoc[i-1]/435.6 - Math.sqrt((surfoc[i-1]/435.6)*(surfoc[i-1]/435.6) -2.194412*(2*surfoc[i-1]/435.6 -2.22)))/0.99476;
        var turnover=100*deepoc[i-1]/38000 - 90.6*surfoc[i-1]/891.62591;
        var bio_pump=10;
        var co3=(2.22-hco3)/2;
        var burial =0.6;
        var runoff=0.6;
        var oc_atm_exch=0.278*(atm[i-1]*28/60 -15.12*(hco3*hco3)/co3);

        if( point < emr.length )
        {
          console.log(emr[point].y+ " " + Number(1994+i) );
          if( emr[point].y === i+1994 )
          {
            emis = emr[point].r;
            point++;
          }
        }
        atm.push( atm[i-1] - phot + plntres+ res +emis-oc_atm_exch );
        lb.push(lb[i-1] + phot - plntres - lf);
        soil.push(soil[i-1] + lf - res);// - rof;
        surfoc.push(surfoc[i-1] + oc_atm_exch + runoff + turnover - bio_pump);
        deepoc.push(deepoc[i-1] - turnover + bio_pump - burial);

          console.log(i);
          console.log(point + " "+ emr.length);
          console.log("content");
          console.log(emis);

          console.log(photo[i-1]);
          console.log(soil[i]);
          console.log(atm[i]);
          console.log(lb[i]);



        /*if(atm1-atm <= 0)
        {
            //atm1 = atm+3;
            cout<<"err "<<atm-atm1<<endl;
        }*/

        /*lb = lb1;
        atm = atm1;
        soil = soil1;*/
    }

    lab = [];
    dat = [];
    for(var i=1994;i<2095;i++)
    {
      var x = "" +i;
      lab.push(x);
    }

    for(var i=1994;i<2095;i++)
    {
      dat.push( /*Math.round*/(atm[i-1994]) );
    }


    $('#graph').remove(); // this is my <canvas> element
    $('#graph-container').append('<canvas id="graph"><canvas>');

    let sample2 = document.getElementById('graph').getContext('2d');
    let atmgrp = new Chart(sample2,{
      type : 'line',
      data : {
          labels: lab,
          datasets: [{
            label : 'Carbon concentration in atmosphere (in gigatons)',
            data : dat,
            backgroundColor : "rgb(236, 154, 162)"
          }]
        },
        options: {
          title:{
            display : true,
            text : 'Atmosphere'

          },
          scales: {
              /*yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]*/
          }


        }
    });


    // Second graph starts here
    lab = [];
    dat = [];
    for(var i=1995;i<2095;i++)
    {
      var x = "" +i;
      lab.push(i);
    }

    for(var i=1995;i<2095;i++)
    {
      //dat.push(i+20);

      dat.push( /*Math.round*/(photo[i-1995]) );
    }


    $('#graph2').remove(); // this is my <canvas> element
    $('#graph-container2').append('<canvas id="graph2"><canvas>');

    let sample = document.getElementById('graph2').getContext('2d');
    let soilgrp = new Chart(sample,{
      type : 'line',
      data : {
          labels: lab,
          datasets: [{
            label : 'Rate flux of photosynthesis (in gigatons)',
            data : dat,
            backgroundColor : "rgb(236, 154, 162)"
          }]
        },
        options: {
          title:{
            display : true,
            text : 'Photosynthesis'
          },
          scales: {

          }


        }
    });


    // third graph
    lab = [];
    dat = [];
    for(var i=1995;i<2095;i++)
    {
      var x = "" +i;
      lab.push(i);
    }

    emis = 0;
    point =0;
    for(var i=1995;i<2095;i++)
    {
      //dat.push(i+20);
      if(i<2010)
      {
          emis = 5.5;
      }
      else if( point < emr.length )
      {
        console.log(emr[point].y+ " " + Number(i) );

        if( emr[point].y === i )
        {
          emis = emr[point].r;
          point++;
        }
      }
      foss.push(foss[i-1995] - emis);
      console.log(foss[i-1995] + "foss");
      dat.push(emis);
    }


    $('#graph3').remove(); // this is my <canvas> element
    $('#graph-container3').append('<canvas id="graph3"><canvas>');

    let sample3 = document.getElementById('graph3').getContext('2d');
    let emisgrp = new Chart(sample3,{
      type : 'line',
      data : {
          labels: lab,
          datasets: [{
            label : 'Emission rate flux (in gigatons)',
            data : dat,
            backgroundColor : "rgb(236, 154, 162)"
          }]
        },
        options: {
          title:{
            display : true,
            text : 'Carbon emission by human activities'
          },
          scales: {

          }


        }
    });

    // 4th graph
    lab = [];
    dat = [];
    for(var i=1994;i<2095;i++)
    {
      var x = "" +i;
      lab.push(i);
    }

    for(var i=1994;i<2095;i++)
    {
      //dat.push(i+20);
      dat.push(deepoc[i-1994]);
    }


    $('#graph4').remove(); // this is my <canvas> element
    $('#graph-container4').append('<canvas id="graph4"><canvas>');

    let sample4 = document.getElementById('graph4').getContext('2d');
    let deepgrp = new Chart(sample4,{
      type : 'line',
      data : {
          labels: lab,
          datasets: [{
            label : 'Deep ocean carbon concentration (in gigatons)',
            data : dat,
            backgroundColor : "rgb(236, 154, 162)"
          }]
        },
        options: {
          title:{
            display : true,
            text : 'Deep Ocean'
          },
          scales: {

          }


        }
    });

    // 5th graph
    lab = [];
    dat = [];
    for(var i=1994;i<2095;i++)
    {
      var x = "" +i;
      lab.push(i);
    }

    for(var i=1994;i<2095;i++)
    {
      //dat.push(i+20);
      dat.push(surfoc[i-1994]);
    }


    $('#graph5').remove(); // this is my <canvas> element
    $('#graph-container5').append('<canvas id="graph5"><canvas>');

    let sample5 = document.getElementById('graph5').getContext('2d');
    let surfgrp = new Chart(sample5,{
      type : 'line',
      data : {
          labels: lab,
          datasets: [{
            label : 'carbon concentration in surface ocean (in gigatons)',
            data : dat,
            backgroundColor : "rgb(236, 154, 162)"
          }]
        },
        options: {
          title:{
            display : true,
            text : 'Surface Ocean'
          },
          scales: {

          }


        }
    });




  });
  $("#find").click(function(){
    console.log("clicked");
    var yr = $("#yearfind").val();
    $("#error").remove();

    if(yr === "")
    {
       var err = '<small id="error" class="form-text text-muted danger" id="error"> \
        Enter year first \
      </small> '
      $('#blocks').append(err);
      return ;
    }
    if(generation === 0)
    {
        var err = '<small id="error" class="form-text text-muted danger"  id="error"> \
         Generate graphs first \
       </small> '
       $('#blocks').append(err);
       return ;
    }

    $('#contbox1').remove();
    $('#contbox2').remove();
    $('#contbox3').remove();
    $('#contbox4').remove();


    yr = Number(yr);
    var boxes = '\
    <div class="card" style="width:18" id="contbox1"> \
      <div class="card-body"> \
        <h5 class="card-title">Atmospheric Carbon Content</h5> \
        <p class="card-text">'+ atm[yr-1994]  +' gigatons </p> \
      </div> \
    </div> \
    <div class="card" style="width:18" id="contbox2"> \
      <div class="card-body"> \
        <h5 class="card-title">Surface Ocean Carbon Content</h5> \
        <p class="card-text">'+ surfoc[yr-1994]  +' gigatons </p> \
        </div> \
    </div> \
    <div class="card" style="width:18" id="contbox3"> \
    <div class="card-body"> \
    <h5 class="card-title">Deep Ocean Carbon Content</h5> \
    <p class="card-text">'+ deepoc[yr-1994]  +' gigatons </p> \
    </div> \
    </div> \
    <div class="card" style="width:18" id="contbox4"> \
    <div class="card-body"> \
    <h5 class="card-title"> Fossil fuel Carbon content</h5> \
    <p class="card-text">'+ (foss[yr-1994])  +' gigatons </p> \
    </div> \
    </div> \
    '


    $('#blocks').append(boxes);
    $("#yearfind").val("");

    /*let sample5 = document.getElementById('graph5').getContext('2d');*/
  });




  // jQuery methods go here...

});
