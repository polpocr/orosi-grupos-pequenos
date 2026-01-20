import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(), 
  }).index("by_token", ["tokenIdentifier"]),

  seasons: defineTable({
    name: v.string(),     
    isActive: v.boolean(),
    
    registrationStart: v.string(), 
    registrationEnd: v.string(),

    groupStart: v.string(),
    groupEnd: v.string(),
  }),

  categories: defineTable({ name: v.string() }),
  districts: defineTable({ name: v.string() }),

  groups: defineTable({
    name: v.string(),
    description: v.string(),
    capacity: v.number(),
    
    seasonId: v.id("seasons"),     
    categoryId: v.id("categories"),
    districtId: v.id("districts"), 

    day: v.string(),
    time: v.string(),
    modality: v.string(),
    address: v.optional(v.string()), 
    updatedAt: v.optional(v.number())
  })
  .index("by_season", ["seasonId"]) 
  .index("by_category", ["categoryId"]), 


  registrations: defineTable({
    groupId: v.id("groups"), 
    
    userId: v.optional(v.string()),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    timestamp: v.number(),
  }).index("by_group", ["groupId"]),
});