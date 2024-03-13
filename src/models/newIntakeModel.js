const mongoose = require("mongoose");

const newIntakeSchema = new mongoose.Schema({
  accountId: { type: String },
  firstName: { type: String, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  clientType: { type: String },
  date: { type: Date },
  dateOfBirth: { type: Date },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  province: { type: String, trim: true },
  bandOrCommunity: { type: String, trim: true },
  bandOrCommunityState: [{ type: String }],
  phones: [
    {
      phoneNumber: {
        type: String,
        trim: true,
      },
    },
  ],
  emergency: [
    {
      emergencyName: {
        type: String,
        trim: true,
      },
      emergencyNumber: {
        type: String,
        trim: true,
      },
    },
  ],
  email: { type: String, trim: true },
  program: { type: String },
  profileImage: { type: String },
  advocate: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  clientStatus: { type: String, default: "Pre-Intake Completed" },
  alert: [{ type: String }],

  //general info
  liveDuration: { type: String },
  liveDurationYears: { type: String },
  liveDurationMonths: { type: String },
  peopleWhoLive: { type: String },
  livingTogether: { type: String },
  motherNation: { type: String },
  fatherNation: { type: String },
  externalSupport: [
    {
      type: String,
    },
  ],
  motherNationState: { type: String },
  fatherNationState: { type: String },
  whoLivesAtHome: [
    {
      fullName: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
      livingTogether: {
        type: String,
        trim: true,
      },
    },
  ],
  childrenInCare: { type: String },
  files: [],

  //cfs detail
  socialWorkers: [
    {
      socialWorkerName: { type: String },
      socialWorkerPhone: { type: String },
    },
  ],
  lawyers: [
    {
      lawyerName: { type: String },
      lawyerPhone: { type: String },
    },
  ],
  EIAWorkers: [
    {
      EIAWorkerName: { type: String },
      EIAWorkerPhone: { type: String },
    },
  ],
  childs: [
    {
      name: { type: String },
      birthDate: { type: Date },
      gender: { type: String },
      other: { type: String },
      isFamily: { type: String },
      isCFS: { type: String },
      cfsYesars: { type: Number },
      cfsFile: { type: String },
      expectingDate: { type: Date },
    },
  ],
  sourceIncome: { type: String },
  reasonApprehension: { type: String },
  anyConcerns: { type: String },
  seekingAdvocacy: { type: String },

  //Placement
  haveFamily: { type: String },
  haveFamilyExplain: { type: String },
  statusCFSFile: { type: String },
  haveAnyone: { type: String },
  haveAnyoneExplain: { type: String },
  currentStatus: { type: String },
  writtenCase: { type: String },
  writtenCaseExplain: { type: String },
  stepsTaken: { type: String },
  stepsTakenExplain: { type: String },
  previousInvolvement: { type: String },
  previousInvolvementExplain: { type: String },
  willingToAttend: { type: String },
  willingToAttendExplain: { type: String },
  experience: { type: String },
  prentativeSupport: { type: String },
  prentativeSupportExplain: { type: String },
  accuratelyExplain: { type: String },
  accuratelyExplainExplain: { type: String },
  visitSchedule: { type: String },
  whereChildrenAre: { type: String },
  whereChildrenAreExplain: { type: String },
  placementPriority: { type: String },

  // family tree
  members: { type: Array },

  //children detail
  childDetail: { type: Array },

  //cfs timeline
  priorToApprehension: { type: String },
  apprehension: { type: String },
  casePlan: { type: String },
  stepsTaken: { type: String },

  //personal assessment
  martialStatus: { type: String },
  highestEducation: { type: String },
  educationalExperience: { type: String },
  residentialSchool: { type: String },
  traumaAffected: { type: String },
  sexuallyExploited: { type: String },
  diagnosedFollowing: { type: Array },
  diagnosedFollowingExplain: { type: String },
  substanceAbuse: { type: String },
  haveAttendedTreatment: { type: String },
  haveAttendedTreatmentExplain: { type: String },
  attendTreatment: { type: String },
  criminalRecord: { type: String },
  criminalRecordExplain: { type: String },
  childAbuse: { type: String },
  childAbuseExplain: { type: String },
  parentalCapacity: { type: String },
  CFSCare: { type: String },
  adoptedScoop: { type: String },
  facedTrauma: { type: String },
  familySuicide: { type: String },
  MMIW: { type: String },
  selfSuicide: { type: String },
  accessElder: { type: String },
  likeSee: { type: String },
  anyConcerns: { type: String },
  anyConcernsExplain: { type: String },
  ageFirstAlcohol: { type: String },
  ageFirstDrugs: { type: String },
  negativeCopingSkills: { type: String },
  negativeCopingSkillsExplain: { type: String },
  currentlyEmployed: { type: String },
  currentlyEmployedExplain: { type: String },
  affectedLife: { type: String },
  lastTimeUsed: { type: String },
  kindSupport: { type: String },
  specialGifts: { type: String },
  supportGroup: { type: String },
  supportGroupExplain: { type: String },

  //opportunity
  tomorrowWayWant: { type: String },
  provideDetail: { type: String },

  //notes
  notes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      noteType: { type: String },
      noteSubType: { type: String },
      description: { type: String },
      createdAt: { type: Date },
      attachment: { type: String },
      attachmentUrl: { type: String },
    },
  ],

  // programs
  programs: [
    {
      program: { type: mongoose.Schema.Types.ObjectId, ref: "program" },
      attendance: { type: Boolean, default: true },
    },
  ],
  createdAt: { type: Date, default: new Date() },
});

newIntakeSchema.index({ "$**": "text" });

const NewIntakeModel = mongoose.model("newIntake", newIntakeSchema);

module.exports = NewIntakeModel;
