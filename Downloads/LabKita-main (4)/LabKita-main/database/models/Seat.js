import { Schema, model } from 'mongoose';

const SeatSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatNumber: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
}, { timestamps: true });

// Ensure seatNumber is unique per lab
SeatSchema.index({ labID: 1, seatNumber: 1 }, { unique: true });

export default class Seat {
    static model = model('Seat', SeatSchema);

    static async getSeats(filter = {}) {
        try {
            return await this.model.find(filter)
                .populate('labID')
                .sort({ seatNumber: 1 })
                .lean();
        } catch (error) {
            console.error("Error fetching Seat documents:", error);
            throw new Error(`Error fetching seats: ${error.message}`);
        }
    }

    static async createSeat(seatData) {
        try {
            // Check if a seat with the same number already exists in the same lab
            const existingSeat = await this.model.findOne({ labID: seatData.labID, seatNumber: seatData.seatNumber });
            if (existingSeat) throw new Error('Seat number already exists in this lab');
    
            const newSeat = await this.model.create(seatData);
            return newSeat.toObject();
        } catch (error) {
            console.error("Error creating seat:", error);
            throw new Error(`Error creating seat: ${error.message}`);
        }
    }    

    static async updateSeat(id, seatData) {
        try {
            if (seatData.seatNumber !== undefined) {
                const existingSeat = await this.model.findOne({ 
                    labID: seatData.labID, 
                    seatNumber: seatData.seatNumber, 
                    _id: { $ne: id } // Exclude the current seat from the check
                });
                if (existingSeat) throw new Error('Seat number already exists in this lab');
            }
    
            const seat = await this.model.findByIdAndUpdate(id, seatData, { new: true, runValidators: true });
            if (!seat) throw new Error('Seat not found');
            return seat.toObject();
        } catch (error) {
            console.error("Error updating seat:", error);
            throw new Error(`Error updating seat: ${error.message}`);
        }
    }    

    static async deleteSeat(id) {
        try {
            const seat = await this.model.findByIdAndDelete(id);
            if (!seat) throw new Error('Seat not found');
            return seat.toObject();
        } catch (error) {
            console.error("Error deleting seat:", error);
            throw new Error(`Error deleting seat: ${error.message}`);
        }
    }
}
