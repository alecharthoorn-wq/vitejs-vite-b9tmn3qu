import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ahabdezdbdzzaiamrkpy.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYWJkZXpkYmR6emFpYW1ya3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzAyMjIsImV4cCI6MjA5NDI0NjIyMn0.UpxeYkjumNvHPzv2h39id9t-zLuyKNMpqTAWhIaHjTo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// === LEZEN ===
export const loadAll = async () => {
  const [houses, rooms, tasks, people, milestones, dagstart, feedback] = await Promise.all([
    supabase.from('houses').select('*').order('created_at'),
    supabase.from('rooms').select('*').order('o'),
    supabase.from('tasks').select('*'),
    supabase.from('people').select('*'),
    supabase.from('milestones').select('*').order('dl'),
    supabase.from('dagstart').select('*').order('date', { ascending: false }).limit(1),
    supabase.from('feedback').select('*').order('created_at', { ascending: false })
  ])
  return {
    houses: houses.data || [],
    rooms: rooms.data || [],
    tasks: tasks.data || [],
    people: people.data || [],
    milestones: milestones.data || [],
    dagstart: dagstart.data?.[0] || null,
    feedback: feedback.data || []
  }
}

// === HUIZEN ===
export const saveHouse = async (h) => {
  const { data, error } = await supabase.from('houses').upsert(h).select().single()
  if (error) console.error('saveHouse:', error)
  return data
}
export const deleteHouse = async (id) => {
  const { error } = await supabase.from('houses').delete().eq('id', id)
  if (error) console.error('deleteHouse:', error)
}

// === KAMERS ===
export const saveRoom = async (r) => {
  const { data, error } = await supabase.from('rooms').upsert(r).select().single()
  if (error) console.error('saveRoom:', error)
  return data
}
export const deleteRoom = async (id) => {
  const { error } = await supabase.from('rooms').delete().eq('id', id)
  if (error) console.error('deleteRoom:', error)
}

// === TAKEN ===
export const saveTask = async (t) => {
  const { data, error } = await supabase.from('tasks').upsert(t).select().single()
  if (error) console.error('saveTask:', error)
  return data
}
export const deleteTask = async (id) => {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) console.error('deleteTask:', error)
}

// === PERSONEN ===
export const savePerson = async (p) => {
  const { data, error } = await supabase.from('people').upsert(p).select().single()
  if (error) console.error('savePerson:', error)
  return data
}
export const deletePerson = async (id) => {
  const { error } = await supabase.from('people').delete().eq('id', id)
  if (error) console.error('deletePerson:', error)
}

// === MIJLPALEN ===
export const saveMilestone = async (m) => {
  const { data, error } = await supabase.from('milestones').upsert(m).select().single()
  if (error) console.error('saveMilestone:', error)
  return data
}
export const deleteMilestone = async (id) => {
  const { error } = await supabase.from('milestones').delete().eq('id', id)
  if (error) console.error('deleteMilestone:', error)
}

// === DAGSTART ===
export const saveDagstart = async (date, present, task_ids) => {
  const { data, error } = await supabase.from('dagstart').upsert({ date, present, task_ids }).select().single()
  if (error) console.error('saveDagstart:', error)
  return data
}

// === FEEDBACK ===
export const saveFeedback = async (fb) => {
  const { data, error } = await supabase.from('feedback').insert(fb).select().single()
  if (error) console.error('saveFeedback:', error)
  return data
}