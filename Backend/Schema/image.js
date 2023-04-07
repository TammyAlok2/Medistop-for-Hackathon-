import mongoose from 'mongoose'

//making the schema of report 
var imageSchema = new mongoose.Schema({
    Reportname: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
const report = mongoose.model('Image', imageSchema);
export default report
