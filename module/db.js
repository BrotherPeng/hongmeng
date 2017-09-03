var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://localhost/hongmeng');//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var nodeScheMa = new Schema({
    name: String,
    equip_id: String,
    buffer: Buffer,
    time:Number
}); //  定义了一个新的模型，但是此模式还未和nodes集合有关联
exports.node= db.model('nodes', nodeScheMa); //  与nodes集合关联