var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const saltRounds = 10;
const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w[2,3])+$/;
    return re.test(email);
};

var usuarioSchema = new Schema({
    nombre : {
        type: String,
        trim: true,
        required: [true, "El nomnbre es obligatorio"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "El email es obligatorio"],
        lowercase: true,
        validate: [validateEmail, 'Por favor ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w[2,3])+$/]
    },
    password: {
        type: String,
        required: [true, "El password es obligatorio"]
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.pre('save', function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    };
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

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