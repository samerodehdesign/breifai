export interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  email: string | null
  avatar_url: string | null
  plan: 'free' | 'pro' | 'studio' | 'enterprise'
  briefs_count: number
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  company: string | null
  industry: string | null
  location: string | null
  avatar_color: string
  notes: string | null
  status: 'active' | 'inactive' | 'archived'
  created_at: string
  updated_at: string
}

export interface BriefSection {
  id: string
  title: string
  content: string
  order: number
}

export interface Brief {
  id: string
  user_id: string
  client_id: string | null
  title: string
  status: 'draft' | 'in_progress' | 'completed' | 'approved' | 'archived'
  budget: string | null
  deadline: string | null
  share_token: string
  share_enabled: boolean
  ai_enhanced: boolean
  sections: BriefSection[]
  progress: number
  created_at: string
  updated_at: string
  clients?: Client
}

export interface BriefComment {
  id: string
  brief_id: string
  author_name: string
  author_email: string | null
  content: string
  is_client: boolean
  created_at: string
}

export interface Template {
  id: string
  title: string
  description: string | null
  category: string | null
  sections_count: number
  estimated_time: string
  is_premium: boolean
  is_popular: boolean
  sections_template: BriefSection[]
  created_at: string
}

export const PLAN_LIMITS = {
  free: { briefs: 10, clients: 5 },
  pro: { briefs: Infinity, clients: Infinity },
  studio: { briefs: Infinity, clients: Infinity },
  enterprise: { briefs: Infinity, clients: Infinity },
}

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'In Progress', color: 'bg-gray-100 text-gray-900' },
  completed: { label: 'Completed', color: 'bg-green-50 text-green-700' },
  approved: { label: 'Approved', color: 'bg-green-50 text-green-700' },
  archived: { label: 'Archived', color: 'bg-gray-50 text-gray-400' },
}
