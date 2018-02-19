const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow

$(function(){
  $("#guide").click(function(){
    const modelPath = path.join('file://',__dirname,"help.html");
    console.log(modelPath);
    let winh = new BrowserWindow({width:800, height:600});
    winh.on('close',function(){ winh = null })
    winh.loadURL(modelPath);
    winh.show();
  });
  $("#sim").click(function(){

    const modelPath = path.join('file://',__dirname,"index.html");
    console.log(modelPath);
    let winh = new BrowserWindow({width:800, height:600});
    winh.on('close',function(){ winh = null })
    winh.loadURL(modelPath);
    //winh.webContents.openDevTools();
    winh.show();

  });

});
