import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.optional(v.string()), 
  }).index("by_token", ["tokenIdentifier"]),

  seasons: defineTable({
    name: v.string(),     
    isActive: v.boolean(),
    registrationStart: v.string(), 
    registrationEnd: v.string(),
    groupStart: v.string(),
    groupEnd: v.string(),
  }),

  categories: defineTable({
    name: v.string(),
    color: v.string(), 
    icon: v.string(),  
    isActive: v.boolean(),
  }),

  districts: defineTable({ 
    name: v.string(),
  }),

  groups: defineTable({
    name: v.string(),
    description: v.string(),
    capacity: v.number(),
    currentMembersCount: v.number(),
    
    seasonId: v.id("seasons"),     
    categoryId: v.id("categories"),
    districtId: v.id("districts"), 

    day: v.string(),
    time: v.string(),
    modality: v.string(), 
    
    address: v.optional(v.string()), 
    geoReferencia: v.optional(v.string()), 
    
    leaders: v.array(v.string()),

    targetAudience: v.optional(v.string()), 
    icon: v.optional(v.string()), 
    legacyId: v.optional(v.string()), 
    updatedAt: v.optional(v.number())
  })
  .index("by_season", ["seasonId"]) 
  .index("by_category", ["categoryId"])
  .index("by_district", ["districtId"]),

  registrations: defineTable({
    groupId: v.id("groups"), 
    userId: v.optional(v.string()),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    timestamp: v.number(),
  }).index("by_group", ["groupId"]),
});