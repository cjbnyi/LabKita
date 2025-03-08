import { Schema, model } from 'mongoose';

const LabSchema = new Schema({
    building: { type: String, required: true },
    room: { type: String, required: true },
    seatIds: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
    daysOpen: [{ type: String, required: true }],
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed', 'Under Maintenance'], default: 'Open' },
}, { timestamps: true });

export const Lab = model('Lab', LabSchema);

/* =============================== */
/* CRUD OPERATIONS */
/* =============================== */
export const getLabs = async (filter = {}) => {
    try {
        return await Lab.find(filter)
            .sort({ building: 1, room: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching Lab documents:", error);
        throw new Error('Error fetching labs');
    }
};

export const createLab = async (labData) => {
    try {
        const newLab = new Lab(labData);
        await newLab.save();
        return newLab.toObject();
    } catch (error) {
        console.error("Error creating Lab document:", error);
        throw new Error('Error creating lab');
    }
};

export const updateLab = async (id, labData) => {
    try {
        const lab = await Lab.findByIdAndUpdate(id, labData, { new: true });
        if (!lab) {
            throw new Error('Lab not found');
        }
        return lab.toObject();
    } catch (error) {
        console.error("Error updating Lab document by id:", error);
        throw new Error('Error updating lab');
    }
};

export const deleteLab = async (id) => {
    try {
        const lab = await Lab.findByIdAndDelete(id);
        if (!lab) {
            throw new Error('Lab not found');
        }
        return lab.toObject();
    } catch (error) {
        console.error("Error deleting Lab document by id:", error);
        throw new Error('Error deleting lab');
    }
};
