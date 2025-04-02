import { Schema, model } from 'mongoose';

const LabSchema = new Schema({
    building: { type: String, required: true },
    room: { type: String, required: true },
    daysOpen: [{
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        required: true
    }],
    openingTime: { type: Date, required: true },
    closingTime: { 
        type: Date, 
        required: true,
        validate: {
            validator: function (value) {
                return value > this.openingTime;
            },
            message: 'Closing time must be later than opening time.'
        }
    },
    status: { type: String, enum: ['Open', 'Closed', 'Under Maintenance'], default: 'Open' },
}, { timestamps: true });

// Enforce unique days in the daysOpen array
LabSchema.path('daysOpen').validate(function (value) {
    return Array.isArray(value) && new Set(value).size === value.length;
}, 'Days open must have unique values.');

LabSchema.index({ building: 1, room: 1 }, { unique: true });

export default class Lab {
    static model = model('Lab', LabSchema);

    static async getLabs(filter = {}) {
        try {
            const labs = await this.model.find(filter)
                .sort({ building: 1, room: 1 })
                .lean();
    
            // Format opening and closing times for each lab
            return labs.map(lab => {
                const openingTime = new Date(lab.openingTime);
                const closingTime = new Date(lab.closingTime);
    
                // Safely format time using toLocaleTimeString
                const formattedOpeningTime = openingTime instanceof Date && !isNaN(openingTime)
                    ? openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Use only hours and minutes
                    : "Invalid Time";
    
                const formattedClosingTime = closingTime instanceof Date && !isNaN(closingTime)
                    ? closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "Invalid Time";
    
                // Return the lab object with formatted times
                return {
                    ...lab,
                    openingTime: formattedOpeningTime,
                    closingTime: formattedClosingTime,
                };
            });
        } catch (error) {
            console.error("Error fetching Lab documents:", error);
            throw new Error(`Error fetching labs: ${error.message}`);
        }
    }    

    static async createLab(labData) {
        try {
            const newLab = await this.model.create(labData);
            return newLab.toObject();
        } catch (error) {
            console.error("Error creating Lab document:", error);
            throw new Error(`Error creating lab: ${error.message}`);
        }
    }

    static async updateLab(id, labData) {
        try {
            const lab = await this.model.findByIdAndUpdate(id, labData, { new: true });
            if (!lab) throw new Error('Lab not found');
            return lab.toObject();
        } catch (error) {
            console.error("Error updating Lab document by id:", error);
            throw new Error(`Error updating lab: ${error.message}`);
        }
    }

    static async deleteLab(id) {
        try {
            const lab = await this.model.findByIdAndDelete(id);
            if (!lab) throw new Error('Lab not found');
            return lab.toObject();
        } catch (error) {
            console.error("Error deleting Lab document by id:", error);
            throw new Error(`Error deleting lab: ${error.message}`);
        }
    }
}
