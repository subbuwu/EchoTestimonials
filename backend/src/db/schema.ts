import { pgTable, serial, varchar, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('full_name', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastLogin: timestamp('last_login', { withTimezone: true })
});

export const spaces = pgTable('spaces', {
  spaceId: serial('space_id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.userId),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const feedbackForms = pgTable('feedback_forms', {
  formId: serial('form_id').primaryKey(),
  spaceId: integer('space_id').notNull().references(() => spaces.spaceId),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const formQuestions = pgTable('form_questions', {
  questionId: serial('question_id').primaryKey(),
  formId: integer('form_id').notNull().references(() => feedbackForms.formId),
  questionText: text('question_text').notNull(),
  questionType: varchar('question_type', { length: 50 }).notNull(),
  isRequired: boolean('is_required').default(false),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const userTestimonials = pgTable('user_testimonials', {
  testimonialId: serial('testimonial_id').primaryKey(),
  formId: integer('form_id').notNull().references(() => feedbackForms.formId),
  customerName: varchar('customer_name', { length: 100 }),
  customerEmail: varchar('customer_email', { length: 255 }),
  overallRating: integer('overall_rating'),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const testimonialResponses = pgTable('testimonial_responses', {
  responseId: serial('response_id').primaryKey(),
  testimonialId: integer('testimonial_id').notNull().references(() => userTestimonials.testimonialId),
  questionId: integer('question_id').notNull().references(() => formQuestions.questionId),
  responseText: text('response_text'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const tags = pgTable('tags', {
  tagId: serial('tag_id').primaryKey(),
  spaceId: integer('space_id').notNull().references(() => spaces.spaceId),
  name: varchar('name', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// export const testimonialTags = pgTable('testimonial_tags', {
//   testimonialId: integer('testimonial_id').notNull().references(() => testimonials.testimonialId),
//   tagId: integer('tag_id').notNull().references(() => tags.tagId),
// }, (table) => {
//   return {
//     pk: primaryKey({ columns: [table.testimonialId, table.tagId] })
//   }
// });