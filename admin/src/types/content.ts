export type ContentStatus = 'pending' | 'approved' | 'rejected' | 'published'

export interface Category {
  _id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Topic {
  _id: string
  topic: string
  category: Category
  isUsed: boolean
  createdAt: string
  updatedAt: string
}

export interface Content {
  _id: string
  topic: Topic
  caption: string
  imageUrl: string
  status: ContentStatus
  instagramPostId?: string
  instagramPostUrl?: string
  rejectionReason?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}