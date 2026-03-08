import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { LayoutGridIcon, TagIcon, BookOpenIcon, SparklesIcon } from 'lucide-react'
import Link from 'next/link'

const navItems = [
  {
    label: 'Content',
    items: [
      { title: 'Contents', href: '/contents', icon: LayoutGridIcon },
      { title: 'Topics', href: '/topics', icon: BookOpenIcon },
      { title: 'Categories', href: '/categories', icon: TagIcon },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5" />
          <span className="font-semibold text-sm">Automation</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}