import { Schema, model } from 'mongoose';

const SeatSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
}, { timestamps: true });

export default class Seat {
    static SeatModel = model('Seat', SeatSchema);

    static async getSeats(filter = {}) {
        try {
            return await this.SeatModel.find(filter).sort({ seatNumber: 1 }).lean();
        } catch (error) {
            console.error("Error fetching Seat documents:", error);
            throw new Error('Error fetching seats');
        }
    }

    static async createSeat(seatData) {
        try {
            const newSeat = new this.SeatModel(seatData);
            await newSeat.save();
            return newSeat.toObject();
        } catch (error) {
            console.error("Error creating seat:", error);
            throw new Error('Error creating seat');
        }
    }

    static async updateSeat(id, seatData) {
        try {
            const seat = await this.SeatModel.findByIdAndUpdate(id, seatData, { new: true });
            if (!seat) throw new Error('Seat not found');
            return seat.toObject();
        } catch (error) {
            console.error("Error updating seat:", error);
            throw new Error('Error updating seat');
        }
    }

    static async deleteSeat(id) {
        try {
            const seat = await this.SeatModel.findByIdAndDelete(id);
            if (!seat) throw new Error('Seat not found');
            return seat.toObject();
        } catch (error) {
            console.error("Error deleting seat:", error);
            throw new Error('Error deleting seat');
        }
    }
}
