import { Schema, model } from 'mongoose';

// Lab Schema
const LabSchema = new Schema({
    building: { type: String, required: true },
    room: { type: String, required: true },
    seatIds: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
    daysOpen: [{ type: String, required: true }],
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed', 'Under Maintenance'], default: 'Open' },
}, { timestamps: true });

const labModel = model('Lab', LabSchema);

/* =============================== */
/* READ */
/* =============================== */
const getLabs = async () => {
    try {
        return await labModel.find()
            .sort({ building: 1, room: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching all Lab documents:", error);
        throw error;
    }
};

const getLabById = async (id) => {
    try {
        return await labModel.findById(id)
            .lean();
    } catch (error) {
        console.error("Error fetching Lab document by id:", error);
        throw error;
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createLab = async (labData) => {
    try {
        const newLab = new labModel(labData);
        await newLab.save();
        return newLab.toObject();
    } catch (error) {
        console.error("Error creating Lab document:", error);
        throw error;
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateLab = async (id, labData) => {
    try {
        const lab = await labModel.findByIdAndUpdate(id, labData, { new: true });
        return lab ? lab.toObject() : null;
    } catch (error) {
        console.error("Error updating Lab document by id:", error);
        throw error;
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteLab = async (id) => {
    try {
        const lab = await labModel.findByIdAndDelete(id);
        return lab ? lab.toObject() : null;
    } catch (error) {
        console.error("Error deleting Lab document by id:", error);
        throw error;
    }
};

export default {
    getLabs,
    getLabById,
    createLab,
    updateLab,
    deleteLab
};
