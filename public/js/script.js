const socket=io();

if(navigator.geolocation){
  navigator.geolocation.watchPosition((position)=>{
    const{latitude,longitude}=position.coords;

    socket.emit("send-location",{latitude,longitude});
  },(error)=>{
     console.error(error);
  },
  {
    enableHighAccuracy:true, //for high accurancy
    maximumage:0, //for no caching
    timeout:2000, 
  }
  );  
}

const map =L.map("map").setView([0,0],16); 

//for location do!! ,[0,0] as cordinates and setview for set view also zoom==10

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)



const marker={};


socket.on("receive-location",(data)=>{
    const{id,latitude,longitude}=data;
    map.setView([latitude,longitude]);

    if(marker[id]){
        marker[id].setLatLng([latitude,longitude])
    }else{
        marker[id]=L.marker([latitude,longitude]).addTo(map);
    }
})


socket.on("user-disconnect",(id)=>{
  if(marker[id]){
    map.removeLayer(marker[id]);
    delete marker[id];
  }
})


