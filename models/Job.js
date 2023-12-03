import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50,
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        defualt:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please Provide user']
    }
},{timestamps:true});

export default mongoose.model('Job', JobSchema);
