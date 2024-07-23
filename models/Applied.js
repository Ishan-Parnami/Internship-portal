import mongoose from "mongoose";

const appliedOpportunitySchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  id: { type: Number, required: true },
  profile_name: { type: String, required: true },
  stipend: { type: String, required: true },
  company_name: { type: String, required: true },
  duration: { type: String, required: true }
});
const AppliedOpportunity = mongoose.model('AppliedOpportunity', appliedOpportunitySchema);
export { AppliedOpportunity as Applied }; 
