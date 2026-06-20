import mongoose from 'mongoose';
import { randomUUID } from "crypto";

const ExpenseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => randomUUID()
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format! Use YYYY-MM-DD`
    }
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2}:\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM`
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'transport', 'shopping', 'bills', 'other'],
    default: 'other'
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  // Add a timestamp for when the expense was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ExpenseSchema.index({ date: -1, time: -1 });
ExpenseSchema.index({ date: 1, category: 1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ createdAt: -1 });

// Pre-save middleware
ExpenseSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Transform the response
ExpenseSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

// Static method to get expenses grouped by date and category
ExpenseSchema.statics.getGroupedByDay = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          date: '$date',
          category: '$category'
        },
        total: { $sum: '$amount' },
        items: { 
          $push: {
            id: '$id',
            time: '$time',
            amount: '$amount',
            description: '$description'
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id.date',
        categories: {
          $push: {
            category: '$_id.category',
            total: '$total',
            items: '$items'
          }
        }
      }
    },
    {
      $sort: { '_id': -1 }
    }
  ]);
};

// Static method to get daily total
ExpenseSchema.statics.getDailyTotal = async function(date) {
  const result = await this.aggregate([
    { $match: { date } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
export default Expense;

