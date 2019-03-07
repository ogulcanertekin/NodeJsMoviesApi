const mongoose=require('mongoose');

module.exports=()=>{
    mongoose.connect('mongodb+srv://ogulcanertekin:miller5534@cluster0-jff8k.mongodb.net/test?retryWrites=true');
    mongoose.connection.on('open',()=>{
        //console.log('MongoDB:Connected');
    });
    mongoose.connection.on('error',(err)=>{
        console.log('MongoDB: Error',err);
    });

    mongoose.Promise=global.Promise; //Promise tanımlaması
};