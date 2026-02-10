const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    points: { type: Number, required: true },
    date: { type: Date, required: true }
});

const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    points: { type: Number, required: true },
    date: { type: Date, required: true }
});

const activityRewardPointsSchema = new mongoose.Schema({
    studentId: { type: String, required: true, ref: 'User' },
    activityPoints: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    activities: [activitySchema],
    rewards: [rewardSchema]
}, { timestamps: true });

module.exports = mongoose.model('ActivityRewardPoints', activityRewardPointsSchema);
