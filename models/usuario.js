var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre : String,
});

usuarioSchema.method.allUsers = function( req, res ){
    return this.find({},cb);
};

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({ usuario:this._id, bicicleta:biciId, desde:desde, hasta:hasta });
    reserva.save(cb);
};

usuarioSchema.statics.add = function(aUser, cb){
    console.log(aUser);
    this.create(aUser,cb);
};

usuarioSchema.statics.updateUser = function(userObj, cb){
    console.log(userObj.nombre);
    this.updateOne({ _id: userObj._id }, {$set: {nombre: userObj.nombre}}, cb);
};

module.exports = mongoose.model('Usuario', usuarioSchema);